import {useFormik} from 'formik';
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {stylesModal, switchStyles} from '../../../../../../styles/styles';
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {InputItem} from '../../../../../../components/InputItam';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {FieldType} from '../../AddNewAsset/TypeAssetChildren';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {colors} from '../../../../../../styles/colors';
import {
  setAssetField,
  updateAssetTC,
} from '../../../../../../bll/reducers/assets-reducer';
import {EditAssetForm} from '../../../../../../types/FormTypes';
import {editAssetSchema} from '../../../../../../utils/validationSchemes';
import {useNetInfo} from '@react-native-community/netinfo';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../../../../enums/offline';
import {setNewModuleItem} from '../../../../../../bll/reducers/local-reducer';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {useOrientation} from '../../../../../../hooks/useOrientation';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';
import {setRequest} from '../../../../../../bll/reducers/offline-reducer';
import {DateInput} from '../../../../../../components/DateInput';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import {CrossIconWhite} from '../../../../../../assets/icons/CrossIconWhite';
import {AddPhotoIcon} from '../../../../../../assets/icons/MenuIcons/AddPhotoIcon';
import {DropdownAssetCategories} from '../../../../../../components/DropdownAssetCategories';
import {DropdownAssetTypes} from '../../../../../../components/DropdownAssetTypes';

type EditDetailsProps = {
  setIsEdit: () => void;
};

export const EditDetails: FC<EditDetailsProps> = ({setIsEdit}) => {
  const dispatch = useAppDispatch();
  const {asset} = useAppSelector(state => state.assets);
  const {asset: localAsset} = useAppSelector(state => state.local.db);
  const {numColumn, onLayout} = useOrientation();

  const startType = useRef(asset?.types?.id);
  const {isConnected} = useNetInfo();
  const {getLocalAssetTypeProps} = useLocalStateSelector();

  const {
    installDate,
    category,
    model,
    serialNumber,
    assetPropsAnswers,
    manufacturer,
    laborValue,
    cost,
    id,
    description,
    equipmentId,
    avatar,
  } = asset;

  const [children, setChildren] = useState<FieldType[]>([]);
  const [newImage, setNewImage] = useState<Asset | null>({
    uri: avatar?.url,
  });

  const getStartValue = (type: string) => {
    switch (type) {
      case 'String':
        return '';
      case 'Integer':
        return 0;
      case 'Decimal':
        return 0;
      case 'Float':
        return 0;
      case 'Boolean':
        return false;
      case 'Date':
        return new Date().toISOString();
      case 'DateTime':
        return new Date().toISOString();
      default:
        return '';
    }
  };

  const setFields = (fields: any[]) => {
    const newFields: {
      [key: string]: {
        id: string;
        name: string;
        type: string;
        value: string | number | boolean;
        isActive: boolean;
      };
    } = {};
    fields.forEach(
      (el: any) =>
        el.assetTypesProps &&
        el.assetTypesProps[0].isActive &&
        (newFields[el.id] = {
          id: el.id,
          name: el.name,
          type: el.type,
          value: getStartValue(el.type),
          isActive: el.assetTypesProps ? el.assetTypesProps[0].isActive : false,
        }),
    );
    return newFields;
  };

  const [uiProps, setUiProps] = useState<any>();

  const netEdit = async () => {
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
      await assetsAPI.updateAssetAvatar(id, data);
    }

    if (values.props) {
      const props = Object.values(values.props).map((el: any) => ({
        id: el.id,
        value: String(el.value),
        name: el.name,
        type: el.type,
      }));

      dispatch(
        updateAssetTC({
          assetId: id,
          body: {...values, props: props.length ? props : undefined},
        }),
      );
    } else {
      dispatch(
        updateAssetTC({
          assetId: id,
          body: values,
        }),
      );
    }
  };

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

  const localEdit = () => {
    const {props, ...body} = values;
    if (props) {
      const newProps = Object.values(props).map((el: any) => ({
        id: el.id,
        value: String(el.value),
        name: el.name,
        type: el.type,
      }));

      dispatch(
        setRequest({
          action: OFFLINE_ACTIONS.EDIT_ASSET,
          method: OFFLINE_METHOD.PUT,
          model: 'asset',
          id,
          body: {...body, props: newProps},
        }),
      );
      dispatch(
        setNewModuleItem({
          model: 'assetpropsanswer',
          id,
          body: newProps,
        }),
      );
    } else {
      dispatch(
        setRequest({
          action: OFFLINE_ACTIONS.EDIT_ASSET,
          method: OFFLINE_METHOD.PUT,
          model: 'asset',
          id,
          body,
        }),
      );
    }
    dispatch(
      setNewModuleItem({
        model: 'asset',
        id,
        body: {...localAsset[id], ...body},
      }),
    );
  };

  const edit = () => {
    if (isConnected) {
      netEdit();
    } else {
      localEdit();
    }
  };

  const submitEditAsset = () => {
    setIsEdit();
    edit();
  };

  const initialValues = {
    typeId: asset.types.id,
    categoryId: category.id,
    buildingId: asset.building?.id,
    name: asset.name,
    installDate: installDate || undefined,
    model: model || undefined,
    serialNumber,
    manufacturer: manufacturer || undefined,
    laborValue,
    cost,
    description,
    equipmentId,
    props: asset.assetPropsAnswers.reduce((obj, value) => {
      return {
        ...obj,
        [value.assetPropId]: {
          id: value.assetPropId,
          name: value.assetProp.name,
          type: value.assetProp.type,
          value: value.value,
        },
      };
    }, {}),
  } as EditAssetForm;

  const {errors, values, setFieldValue, handleSubmit} = useFormik({
    initialValues,
    validationSchema: editAssetSchema,
    onSubmit: submitEditAsset,
    validateOnBlur: true,
  });

  const getAssetTypeProps = async () => {
    if (values.typeId) {
      const res = isConnected
        ? await assetsAPI.getPropsByAssetTypeId({typeId: values.typeId})
        : getLocalAssetTypeProps(values.typeId);
      const fields = res.data.props;
      if (values.typeId === asset.types.id) {
        assetPropsAnswers.forEach((el: any) =>
          setFieldValue('props', {
            ...values.props,
            [el.assetPropId]: {
              id: el.assetPropId,
              value:
                el.assetProp.type === 'Boolean'
                  ? el.value === 'true'
                  : el.value,
              name: el.assetProp.name,
              type: el.assetProp.type,
            },
          }),
        );
      }
      setChildren(fields);
      setUiProps(setFields(fields));
      if (values.typeId !== startType.current) {
        clearFields(['props']);
      }
      startType.current = values.typeId;
    }
  };

  const renderField = ({name, type, id}: any) => {
    switch (type) {
      case 'String':
        return (
          <InputItem
            label={name}
            defaultValue={values.props && values.props[id]?.value}
            handleChange={value => {
              if (values.props) {
                setFieldValue('props', {
                  ...values.props,
                  [id]: {...uiProps[id], value},
                });
              } else {
                setFieldValue('props', {
                  [id]: {...uiProps[id], value},
                });
              }
            }}
          />
        );
      case 'Integer':
        return (
          <InputItem
            numeric
            label={name}
            defaultValue={values.props && values.props[id]?.value}
            handleChange={value => {
              if (values.props) {
                setFieldValue('props', {
                  ...values.props,
                  [id]: {...uiProps[id], value},
                });
              } else {
                setFieldValue('props', {
                  [id]: {...uiProps[id], value},
                });
              }
            }}
          />
        );
      case 'Decimal':
        return (
          <InputItem
            numeric
            label={name}
            defaultValue={values.props && values.props[id]?.value}
            handleChange={value => {
              if (values.props) {
                setFieldValue('props', {
                  ...values.props,
                  [id]: {...uiProps[id], value},
                });
              } else {
                setFieldValue('props', {
                  [id]: {...uiProps[id], value},
                });
              }
            }}
          />
        );
      case 'Float':
        return (
          <InputItem
            numeric
            label={name}
            defaultValue={values.props && values.props[id]?.value}
            handleChange={value => {
              if (values.props) {
                setFieldValue('props', {
                  ...values.props,
                  [id]: {...uiProps[id], value},
                });
              } else {
                setFieldValue('props', {
                  [id]: {...uiProps[id], value},
                });
              }
            }}
          />
        );
      case 'Boolean':
        return (
          <BouncyCheckbox
            size={20}
            style={styles.checkbox}
            fillColor={colors.mainActiveColor}
            innerIconStyle={styles.borderRadius}
            iconStyle={styles.borderRadius}
            textStyle={styles.checkboxText}
            text={name}
            isChecked={values.props && values.props[id]?.value}
            onPress={(isChecked: boolean) => {
              if (values.props) {
                setFieldValue('props', {
                  ...values.props,
                  [id]: {...uiProps[id], value: isChecked},
                });
              } else {
                setFieldValue('props', {
                  [id]: {...uiProps[id], value: isChecked},
                });
              }
            }}
          />
        );
      case 'Date':
        return (
          <DateInput
            labelDate={name}
            startValue={values.props && values.props[id]?.value}
            onChange={value => {
              if (values.props) {
                setFieldValue('props', {
                  ...values.props,
                  [id]: {...uiProps[id], value: new Date(value).toISOString()},
                });
              } else {
                setFieldValue('props', {
                  [id]: {...uiProps[id], value: new Date(value).toISOString()},
                });
              }
            }}
          />
        );
      case 'DateTime':
        return (
          <DateInput
            labelDate={name}
            startValue={values.props && values.props[id]?.value}
            onChange={value => {
              if (values.props) {
                setFieldValue('props', {
                  ...values.props,
                  [id]: {...uiProps[id], value: new Date(value).toISOString()},
                });
              } else {
                setFieldValue('props', {
                  [id]: {...uiProps[id], value: new Date(value).toISOString()},
                });
              }
            }}
          />
        );
      default:
        return <Text>Invalid type</Text>;
    }
  };

  useEffect(() => {
    getAssetTypeProps();
  }, [values.typeId, isConnected]);

  const clearFields = (fields: string[]) => {
    fields.forEach(el => values[el] && setFieldValue(el, undefined));
  };

  return (
    <>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.form}
        onLayout={event => {
          onLayout(event.nativeEvent.layout.width);
        }}>
        <View style={{flex: 1}}>
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
        </View>
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
              onValueChange={isChecked => {
                setFieldValue('isCritical', isChecked);
              }}
              value={values.isCritical}
              style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
            />
          </View>
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <InputItem
            label="Name"
            defaultValue={asset.name}
            handleChange={value => {
              setFieldValue('name', value);
            }}
            error={errors.name}
            touched={true}
          />
          <InputItem
            label="Equipment ID"
            handleChange={value => {
              setFieldValue('equipmentId', value);
            }}
            defaultValue={values.equipmentId}
            error={errors.equipmentId}
            touched={true}
          />
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <DropdownAssetCategories
            startValue={values.categoryId}
            onChange={item => {
              clearFields(['typeId', 'props']);
              setFieldValue('categoryId', item.id);
            }}
            error={errors.categoryId}
            touched={true}
          />
          <DropdownAssetTypes
            startValue={values.typeId}
            onChange={item => {
              setFieldValue('typeId', item.id);
              clearFields(['props']);
              dispatch(setAssetField({['typeId']: item.id}));
            }}
            categoryId={values.categoryId!}
            error={errors.typeId}
            touched={true}
          />
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <InputItem
            label="Model Number"
            defaultValue={model}
            handleChange={value => {
              setFieldValue('model', value);
            }}
            error={errors.model}
            touched={true}
          />
          <InputItem
            label="Serial Number"
            defaultValue={serialNumber}
            handleChange={value => {
              setFieldValue('serialNumber', value);
            }}
            error={errors.serialNumber}
            touched={true}
          />
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <InputItem
            label="Manufacturer"
            defaultValue={manufacturer}
            handleChange={value => {
              setFieldValue('manufacturer', value);
            }}
            error={errors.manufacturer}
            touched={true}
          />
          <DateInput
            labelDate="Install Date"
            startValue={values.installDate}
            onChange={value => {
              setFieldValue('installDate', new Date(value).toISOString());
            }}
            error={errors.installDate}
            touched={true}
            maxDate={new Date()}
          />
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <InputItem
            label="Current Value"
            numeric
            defaultValue={laborValue}
            handleChange={value => {
              setFieldValue('laborValue', +value);
            }}
            error={errors.laborValue}
            touched={true}
          />
          <InputItem
            label="Asset Cost"
            numeric
            defaultValue={cost}
            handleChange={value => {
              setFieldValue('cost', +value);
            }}
            error={errors.cost}
            touched={true}
          />
        </View>

        <InputItem
          multiline
          label="Description"
          defaultValue={description}
          handleChange={value => {
            setFieldValue('description', value);
          }}
          error={errors.description}
          touched={true}
        />
        {/* <View style={styles.line} /> */}
        {isConnected && (
          <>
            <Text style={styles.title}>Additional Properties</Text>
            <View
              style={{
                flex: 1,
                gap: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {uiProps &&
                Object.values(uiProps).map((el: any) => (
                  <View
                    key={el.id}
                    style={{flex: 1, minWidth: 300, height: 60}}>
                    {renderField(el)}
                  </View>
                ))}
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
      <View style={[stylesModal.modalButtons, styles.buttons]}>
        <Pressable
          onPress={setIsEdit}
          style={[
            stylesModal.modalButton,
            stylesModal.modalButtonReset,
            styles.button,
          ]}>
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
          style={[stylesModal.modalButton, styles.button]}>
          <Text style={stylesModal.modalButtonText}>Save</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingBottom: 65,
    paddingTop: 10,
    marginHorizontal: 15,
    gap: 10,
  },
  revers: {
    flexDirection: 'column-reverse',
  },
  checkbox: {
    height: 45,
    alignItems: 'center',
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
  line: {
    height: 2,
    backgroundColor: colors.backgroundGreyColor,
    marginTop: 15,
    borderRadius: 2,
  },
  buttons: {
    marginHorizontal: 15,
  },
  button: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 20,
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
