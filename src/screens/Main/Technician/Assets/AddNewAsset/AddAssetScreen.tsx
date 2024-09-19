import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {InputItem} from '../../../../../components/InputItam';
import {stylesModal, switchStyles} from '../../../../../styles/styles';
import {TypeAsset} from './TypeAsset';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../hooks/hooks';
import {
  clearNewAssetForm,
  createNewAssetTC,
} from '../../../../../bll/reducers/newAsset-reducer';
import {useCallback, useEffect, useState} from 'react';
import {colors} from '../../../../../styles/colors';
import {DropdownWithLeftIcon} from '../../../../../components/DropdownWithLeftIcon';
import {AddAssetProps} from '../../../../../types/NavTypes/NavigationTypes';
import {useFormik} from 'formik';
import {createAssetSchema} from '../../../../../utils/validationSchemes';
import {CreateAssetForm} from '../../../../../types/FormTypes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';
import {setRequest} from '../../../../../bll/reducers/offline-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../../../enums/offline';
import uuid from 'react-native-uuid';
import {setNewModuleItem} from '../../../../../bll/reducers/local-reducer';
import {useOrientation} from '../../../../../hooks/useOrientation';
import {MyButton} from '../../../../../components/MyButton';
import {DateInput} from '../../../../../components/DateInput';
import {AddNewAssetProps} from '../../../../../types/NavTypes/TechnicianNavTypes';
import {BuildingType} from '../../../../../types/StateType';
import {buildingsAPI} from '../../../../../api/buildingsApi';
import {DropdownAssetCategories} from '../../../../../components/DropdownAssetCategories';
import {DropdownAssetTypes} from '../../../../../components/DropdownAssetTypes';
import {UserRole} from '../../../../../enums/user';
import {getTab} from '../../../../../utils/getTab';
import {AddPhotoIcon} from '../../../../../assets/icons/MenuIcons/AddPhotoIcon';
import {CrossIconWhite} from '../../../../../assets/icons/CrossIconWhite';
import FastImage from 'react-native-fast-image';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {
  AssetGetByEntityAttributes,
  AssetGetByEntityInclude,
} from '../../../../../enums/assets';
import {getAssetTC} from '../../../../../bll/reducers/assets-reducer';
import {assetsAPI} from '../../../../../api/assetsApi';

export const AddAssetScreen = ({route}: AddAssetProps | AddNewAssetProps) => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const {numColumn, onLayout} = useOrientation();
  const navigation = useAppNavigation();

  const {getLocalBuildings} = useLocalStateSelector();
  const buildingId = useAppSelector(state => state.buildings.building.id);
  const {building, assetcategory} = useAppSelector(state => state.local.db);
  const {regionId} = useAppSelector(state => state.user.user);
  const [newImage, setNewImage] = useState<Asset | null>(null);
  const [buildings, setBuildings] = useState<BuildingType[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const planId = route?.params?.planId;

  const createAsset = async (val: any) => {
    try {
      const res = await dispatch(
        createNewAssetTC({
          body: {...val},
          nav: navigation,
        }),
      );

      navigation.navigate('Main', {
        screen: UserRole.TECHNICIAN,
        params: {
          screen: getTab(navigation.getState().routeNames[0]),
          params: {
            screen: 'Asset',
            params: {id: res.payload.id},
          },
        },
      });

      if (newImage?.fileName) {
        let data = new FormData();
        const uriParts = newImage.uri?.split('.');
        const fileType = uriParts![uriParts!.length - 1];

        data.append('file', {
          name: newImage.fileName,
          type: `image/${fileType}`,
          uri:
            Platform.OS === 'ios'
              ? newImage.uri?.replace('file://', '')
              : newImage.uri,
        });
        await assetsAPI.updateAssetAvatar(res.payload.id, data);
      }
      dispatch(
        getAssetTC({
          assetId: res.payload.id,
          params: {
            includeCriteria: [
              AssetGetByEntityInclude.BUILDING,
              AssetGetByEntityInclude.AVATAR,
              AssetGetByEntityInclude.TYPE,
              AssetGetByEntityInclude.CATEGORY,
              AssetGetByEntityInclude.PROPS,
            ],
            attributeCriteria: Object.values(AssetGetByEntityAttributes),
          },
        }),
      );
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const createLocalAsset = (val: any) => {
    const id = uuid.v4().toString();
    const body = {...val, buildingId};
    const model = 'asset';

    dispatch(
      setRequest({
        action: OFFLINE_ACTIONS.CREATE_ASSET,
        method: OFFLINE_METHOD.POST,
        model,
        id,
        body,
      }),
    );
    dispatch(
      setNewModuleItem({
        model,
        id,
        body: {
          ...body,
          assetPropsAnswers: val.props,
          category: assetcategory[val.categoryId],
          building: building[val.buildingId],
          isLocal: true,
        },
      }),
    );
    navigation.goBack();
  };

  useEffect(() => {
    dispatch(clearNewAssetForm());
  }, [planId]);

  const [validation, setValidation] = useState<any>(createAssetSchema);

  const initialValues = {
    isCritical: false,
    buildingId: planId ? buildingId : undefined,
    // model: '',
    // manufacturer: '',
    // installDate: '',
    // laborValue: 0,
    // cost: 0,
    // serialNumber: '',
    // equipmentId: '',
  } as CreateAssetForm;

  const {
    errors,
    setFieldValue,
    handleBlur,
    handleSubmit,
    setValues,
    values,
    submitCount,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: isConnected ? createAsset : createLocalAsset,
    validateOnBlur: true,
  });

  const clearFields = (fields: string[]) => {
    fields.forEach(el => values[el] && setFieldValue(el, undefined));
  };

  useEffect(() => {
    isConnected && !planId
      ? (async () => {
          try {
            const res = await buildingsAPI.getBuildingsListByRegion({
              regionIds: [regionId],
              page: 1,
              size: 100,
              sortField: 'name',
              sortDirection: 'ASC',
              keySearchValue: '',
            });
            setBuildings(
              res.data.rows.map(el => ({
                ...el,
                file: el.avatar,
              })),
            );
          } catch (err) {}
        })()
      : setBuildings(getLocalBuildings({regionId}).payload as BuildingType[]);
  }, [isConnected, planId, regionId]);

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

  return (
    <View
      style={styles.container}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 60,
          marginHorizontal: 15,
          gap: 10,
        }}>
        {newImage?.uri ? (
          <View>
            <FastImage
              style={styles.photo}
              source={{
                uri: newImage.uri,
              }}
            />
            <Pressable style={styles.cross} onPress={() => setNewImage({})}>
              <CrossIconWhite />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.addFile} onPress={handleDocumentSelection}>
            <AddPhotoIcon />
            <Text style={styles.fileName}>Click to Upload File</Text>
          </Pressable>
        )}
        <View style={switchStyles.switchContainer}>
          <Text style={switchStyles.switchText}>Is Asset Critical?</Text>
          <View style={switchStyles.switchSubContainer}>
            <Switch
              trackColor={{
                false: '#6C757D',
                true: colors.deleteColor,
              }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#6C757D"
              onValueChange={isChecked =>
                setFieldValue('isCritical', isChecked)
              }
              value={values.isCritical}
              style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
            />
          </View>
        </View>

        <View style={numColumn === 1 ? styles.column : styles.row}>
          <InputItem
            label="Name*"
            handleChange={value => {
              setFieldValue('name', value);
            }}
            error={errors.name}
            touched={submitCount > 0}
            handleBlur={handleBlur('name')}
          />
          {/* <InputItem
            label="Equipment ID"
            handleChange={value => {
              setFieldValue('equipmentId', value);
            }}
            error={errors.equipmentId}
            touched={submitCount > 0}
            handleBlur={handleBlur('equipmentId')}
          /> */}
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          {!planId && (
            <DropdownWithLeftIcon
              label="Building"
              onChange={item => {
                setFieldValue('buildingId', item.id);
              }}
              data={buildings}
              isIcon
              dropdownIcons={{
                defaultSource: require('../../../../../assets/img/Building.png'),
              }}
              startValue={values.buildingId}
              placeholder="Select a Building"
              error={errors.buildingId}
              touched={submitCount > 0}
            />
          )}
          <DropdownAssetCategories
            startValue={values.categoryId}
            onChange={item => {
              clearFields(['typeId', 'props']);
              setFieldValue('categoryId', item.id);
            }}
            error={errors.categoryId}
            touched={submitCount > 0}
          />
          {values.categoryId && values.categoryId !== '' && (
            <DropdownAssetTypes
              startValue={values.typeId}
              onChange={item => {
                setFieldValue('typeId', item.id);
              }}
              categoryId={values.categoryId}
              error={errors.typeId}
              touched={submitCount > 0}
            />
          )}
        </View>

        <View style={numColumn === 1 ? styles.column : styles.row}>
          <InputItem
            label="Model"
            handleChange={value => {
              setFieldValue('model', value);
            }}
            error={errors.model}
            touched={submitCount > 0}
            handleBlur={handleBlur('model')}
          />
          <InputItem
            label="Serial Number"
            handleChange={value => {
              setFieldValue('serialNumber', value);
            }}
            error={errors.serialNumber}
            touched={submitCount > 0}
            handleBlur={handleBlur('serialNumber')}
          />
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <InputItem
            label="Manufacturer"
            handleChange={value => {
              setFieldValue('manufacturer', value);
            }}
            error={errors.manufacturer}
            touched={submitCount > 0}
            handleBlur={handleBlur('manufacturer')}
          />
          {/* <InputItem
                label="Notes"
                handleChange={value => {
                  dispatch(setNewAssetField({notes: value}));
                  setFieldValue('notes', value);
                }}
              /> */}
          <DateInput
            labelDate="Install Date"
            onChange={value => {
              setFieldValue('installDate', new Date(value).toISOString());
            }}
            error={errors.installDate}
            touched={submitCount > 0}
          />
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          {/* <InputItem
            label="Current Value"
            numeric
            handleChange={value => {
              setFieldValue('laborValue', +value);
            }}
            error={errors.laborValue}
            touched={submitCount > 0}
            handleBlur={handleBlur('laborValue')}
          /> */}
          {/* <InputItem
            label="Cost"
            numeric
            handleChange={value => {
              setFieldValue('cost', +value);
            }}
            defaultValue={values.cost}
            error={errors.cost}
            touched={submitCount > 0}
            handleBlur={handleBlur('cost')}
          /> */}
        </View>
        <InputItem
          label="Description"
          multiline
          handleChange={value => {
            setFieldValue('description', +value);
          }}
          defaultValue={values.description}
          error={errors.description}
          touched={submitCount > 0}
          handleBlur={handleBlur('description')}
        />
        {values.typeId && (
          <>
            <Text style={styles.checkboxText}>Additional Properties</Text>

            <TypeAsset
              onChangeNewValidation={newValidation => {
                setValidation(newValidation);
              }}
              setFieldType={value => {
                setFieldValue('typeId', value);
                clearFields(['props']);
              }}
              setNewProps={({id, val}) => {
                setValues({
                  ...values,
                  props: {...values.props, [id]: val},
                });
              }}
              values={values}
              setDefaultProps={initProps => {
                setValues({
                  ...values,
                  props: initProps,
                });
              }}
              errors={errors}
              submitCount={submitCount}
            />
          </>
        )}

        <View style={styles.footer} />
        {Object.keys(errors).length > 0 && submitCount > 0 && (
          <Text style={styles.notValidCount}>
            Not valid fields: {Object.keys(errors).length}
          </Text>
        )}
      </KeyboardAwareScrollView>
      <View style={[stylesModal.modalButtons]}>
        <MyButton
          disabled={isLoading}
          text="Cancel"
          action={() => {
            dispatch(clearNewAssetForm());
            navigation.goBack();
          }}
          style="mainBorder"
        />
        <MyButton
          text="Save"
          action={() => {
            handleSubmit();
          }}
          style="main"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  checkbox: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: 20,
    marginRight: -10,
  },
  borderRadius: {
    borderRadius: 5,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },
  footer: {height: 15},
  notValidCount: {
    marginBottom: 10,
    color: colors.deleteColor,
  },
  column: {
    gap: 10,
  },
  row: {
    gap: 10,
    flexDirection: 'row',
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
});
