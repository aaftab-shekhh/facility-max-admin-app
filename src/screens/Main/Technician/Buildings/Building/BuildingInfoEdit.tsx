import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {stylesModal} from '../../../../../styles/styles';
import {FC, useCallback, useEffect, useState} from 'react';
import {BuildingType} from '../../../../../types/StateType';
import {Formik} from 'formik';
import {InputItem} from '../../../../../components/InputItam';
import {
  updateBuildingImageTC,
  updateBuildingTC,
} from '../../../../../bll/reducers/buildings-reducer';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {DropdownWithLeftIcon} from '../../../../../components/DropdownWithLeftIcon';
import {BuildingTypes} from '../../../../../bll/state';
import {colors} from '../../../../../styles/colors';
import {AddPhotoIcon} from '../../../../../assets/icons/MenuIcons/AddPhotoIcon';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import {CrossIconWhite} from '../../../../../assets/icons/CrossIconWhite';
import {BuildingFormType} from '../../../../../types/FormTypes';
import {regionAPI} from '../../../../../api/regionApi';

type BuildingInfoEditProps = {
  setIsEdit: () => void;
  building: BuildingType;
  numColumn: number;
};

export const BuildingInfoEdit: FC<BuildingInfoEditProps> = ({
  setIsEdit,
  building,
  numColumn,
}) => {
  const dispatch = useAppDispatch();
  const [newImage, setNewImage] = useState<Asset | null>({
    uri: building.avatar?.url,
  });
  const {customerId} = useAppSelector(state => state.user.user);
  const [regions, setRegions] = useState([]);

  const handleDocumentSelection = useCallback(async () => {
    try {
      launchImageLibrary(
        {
          selectionLimit: 1,
          mediaType: 'photo',
          includeBase64: false,
        },
        el => {
          if (el.assets) {
            setNewImage(el.assets[0]);
          }
        },
      );
    } catch (err) {
      console.warn(err);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const res = await regionAPI.getRegionsByCustomerId({
        customerId,
        page: 1,
        size: 100,
        sortField: 'name',
        sortDirection: 'ASC',
      });
      setRegions(res.data.rows);
    })();
  }, [customerId]);

  const initialValues = {
    name: building.name,
    description: building.description,
    region: building.region?.name,
    type: building.type,
    country: building.country,
    creator: building.creator,
    city: building.city,
    address: building.address,
    zipCode: building.zipCode,
    lat: building.lat,
    long: building.long,
    state: building.state,
    area: building.area,
    floorsNumber: +building.floorsNumber,
    accessInformation: building.buidingAccessInformation,
    yearBuilt: +building.yearBuilt,
    regionId: building.region.id,
  } as BuildingFormType;

  return (
    <Formik
      initialValues={initialValues}
      validateOnBlur
      onSubmit={values => {
        if (newImage?.fileName) {
          let data = new FormData();
          const uriParts = newImage.uri?.split('.');
          const fileType = uriParts![uriParts!.length - 1];

          data.append('image', {
            name: newImage.fileName,
            type: `image/${fileType}`,
            uri:
              Platform.OS === 'ios'
                ? newImage.uri?.replace('file://', '')
                : newImage.uri,
          });
          data.append('buildingId', building.id);
          dispatch(updateBuildingImageTC(data));
        }
        dispatch(
          updateBuildingTC({
            ...values,
            buildingId: building.id,
            endUpdate: () => {
              setIsEdit();
            },
          }),
        );
      }}
      // validationSchema={validationsSchema}
    >
      {({errors, values, handleChange, setFieldValue, handleSubmit}) => (
        <View style={styles.container}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.form}
            showsVerticalScrollIndicator={false}>
            <View style={numColumn === 1 ? styles.column : styles.row}>
              <View style={{flex: 1}}>
                {newImage?.uri ? (
                  <View>
                    <FastImage
                      style={styles.photo}
                      source={
                        newImage.uri
                          ? {
                              uri: newImage.uri,
                            }
                          : require('../../../../../assets/img/Building.png')
                      }
                      defaultSource={require('../../../../../assets/img/Building.png')}
                    />
                    <Pressable
                      style={styles.cross}
                      onPress={() => setNewImage({})}>
                      <CrossIconWhite />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    style={styles.addFile}
                    onPress={handleDocumentSelection}>
                    <AddPhotoIcon />
                    <Text style={styles.fileName}>Click to Upload File</Text>
                  </Pressable>
                )}
              </View>
              <View style={{flex: 1, gap: 10}}>
                <InputItem
                  label="Building name"
                  defaultValue={values.name}
                  handleChange={handleChange('name')}
                  error={errors.name}
                />
                <DropdownWithLeftIcon
                  label="Building Type"
                  onChange={item => {
                    setFieldValue('type', item.name);
                  }}
                  startValue={values.type}
                  data={BuildingTypes}
                />
                <DropdownWithLeftIcon
                  label="Region"
                  onChange={item => {
                    setFieldValue('regionId', item.id);
                  }}
                  data={regions}
                  startValue={values.regionId}
                  placeholder="Region"
                />
                <InputItem
                  label="Address"
                  defaultValue={values.address}
                  handleChange={handleChange('address')}
                  error={errors.address}
                />
              </View>
            </View>

            <View style={numColumn === 1 ? styles.column : styles.row}>
              <InputItem
                label="City"
                defaultValue={values.city}
                handleChange={handleChange('city')}
                error={errors.city}
              />
              <View style={[styles.row, {flex: 1}]}>
                <InputItem
                  label="State"
                  defaultValue={values.state}
                  handleChange={handleChange('state')}
                  error={errors.state}
                />
                <InputItem
                  label="Zip"
                  defaultValue={values.zipCode}
                  handleChange={handleChange('zipCode')}
                  error={errors.zipCode}
                />
                <InputItem
                  label="Country"
                  defaultValue={values.country}
                  handleChange={handleChange('country')}
                  error={errors.country}
                />
              </View>
            </View>
            <View style={numColumn === 1 ? styles.column : styles.row}>
              <InputItem
                label="Year built"
                defaultValue={values.yearBuilt}
                handleChange={handleChange('yearBuilt')}
                error={errors.yearBuilt}
                keyboardType={'number-pad'}
              />
              <InputItem
                label="Total area (Sq Ft)"
                defaultValue={values.area}
                handleChange={handleChange('area')}
                error={errors.area}
              />
              <InputItem
                disabled
                label="Number of Floors"
                defaultValue={values.floorsNumber}
                handleChange={handleChange('floorsNumber')}
                error={errors.floorsNumber}
              />
            </View>
            <View style={numColumn === 1 ? styles.column : styles.row}>
              <InputItem
                multiline
                label="Description"
                defaultValue={values.description}
                handleChange={handleChange('description')}
                error={errors.description}
              />
              <InputItem
                multiline
                label="Building access information"
                defaultValue={values.accessInformation}
                handleChange={handleChange('accessInformation')}
                error={errors.accessInformation}
              />
            </View>
          </KeyboardAwareScrollView>
          <View style={stylesModal.modalButtons}>
            <Pressable
              onPress={setIsEdit}
              style={[stylesModal.modalButton, stylesModal.modalButtonReset]}>
              <Text
                style={[
                  stylesModal.modalButtonText,
                  stylesModal.modalButtonTextReset,
                ]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleSubmit()}
              style={stylesModal.modalButton}>
              <Text style={stylesModal.modalButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },

  form: {
    paddingBottom: 60,
    marginHorizontal: 15,
    gap: 10,
  },

  addFile: {
    height: 290,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.mainActiveColor,
    backgroundColor: '#44B8FF1A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fileName: {
    color: colors.mainActiveColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },

  photo: {
    height: 290,
    width: '100%',
    borderRadius: 10,
  },

  cross: {
    position: 'absolute',
    width: 26,
    height: 26,
    backgroundColor: colors.mainActiveColor,
    justifyContent: 'center',
    alignItems: 'center',
    top: 5,
    right: 5,
    borderRadius: 13,
    zIndex: 1,
  },
  column: {
    gap: 10,
  },
  row: {
    gap: 10,
    flexDirection: 'row',
  },
});
