import {Pressable, Switch, Text, View} from 'react-native';
import {InputItem} from '../../../../../../components/InputItam';
import {FC, useEffect, useState} from 'react';
import {DropdownWithLeftIcon} from '../../../../../../components/DropdownWithLeftIcon';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../../hooks/hooks';
import {
  changeReplacedActions,
  deleteAssetFromForm,
  deleteReplacedAsset,
  setNewAssets,
  setReplasetAssets,
} from '../../../../../../bll/reducers/newAsset-reducer';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {TypeAsset} from '../../../Assets/AddNewAsset/TypeAsset';
import {colors} from '../../../../../../styles/colors';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {InfoItem} from '../../../../../../components/InfoItem';
import {dropdownIcons} from '../../../../../../bll/icons';
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from 'react-native-bouncy-checkbox-group';
import {styles} from './CloseCompleted';
import {AssetType} from '../../../../../../types/StateType';
import {InfoIcon} from '../../../../../../assets/icons/InfoIcon';
import {getTab} from '../../../../../../utils/getTab';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';
import uuid from 'react-native-uuid';
import {setRequest} from '../../../../../../bll/reducers/offline-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../../../../enums/offline';
import {setNewModuleItem} from '../../../../../../bll/reducers/local-reducer';
import {createAssetSchema} from '../../../../../../utils/validationSchemes';
import {CreateAssetForm} from '../../../../../../types/FormTypes';
import {useFormik} from 'formik';
import {useOrientation} from '../../../../../../hooks/useOrientation';
import {DropdownWithSearch} from '../../../../../../components/DropdownWithSearch';
import {inventoriesAPI} from '../../../../../../api/inventoryApi';
import {backgroundColor, color} from '../../../Assets/Asset/AssetInventory';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {checkboxStyles} from '../../../../../../styles/styles';
import {UserRole} from '../../../../../../enums/user';
import {DateInput} from '../../../../../../components/DateInput';
import {DropdownAssetCategories} from '../../../../../../components/DropdownAssetCategories';
import {DropdownAssetTypes} from '../../../../../../components/DropdownAssetTypes';

const isReplacedData = [
  {id: '0', text: 'Yes'},
  {id: '1', text: 'No'},
];
const actions = [
  {id: 'inventory', name: 'An Asset From Inventory'},
  {id: 'new', name: 'New Asset'},
];

const replacedActions = [
  {id: 'archive', name: 'Archive this Asset'},
  {id: 'addToInventory', name: 'Add to Inventory'},
];

type AssetProps = {
  asset: AssetType;
};

export const Asset: FC<AssetProps> = ({asset}) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const {isConnected} = useNetInfo();

  const {numColumn, onLayout} = useOrientation();

  const [action, setAction] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [isReplaced, setIsReplaced] = useState('No');

  const {building, assetcategory} = useAppSelector(state => state.local.db);
  const {replacedAssets} = useAppSelector(state => state.newAsset);

  const [inventories, setInventories] = useState([]);

  const createAsset = async (val: any) => {
    dispatch(setNewAssets({id: asset.id, asset: val}));
  };

  const createLocalAsset = (val: any) => {
    const id = uuid.v4().toString();
    const body = {...val, buildingId: asset.building.id};
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

  const [validation, setValidation] = useState<any>(createAssetSchema);

  const initialValues = {
    buildingId: asset?.building?.id,
    model: '',
    manufacturer: '',
    installDate: '',
    isCritical: false,
    laborValue: 0,
    cost: 0,
    serialNumber: '',
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
    handleSubmit();
  }, [values]);

  const getInventories = async () => {
    const res = await inventoriesAPI.getInventories({
      typeIdes: [asset.types.id],
    });
    setInventories(
      res.data.payload.map(el => ({
        ...el,
        name: el.id.split('-')[0],
        labelColor: color[el.status],
        labelText: el.status,
        labelBackgroundColor: backgroundColor[el.status],
      })),
    );
  };

  useEffect(() => {
    if (isReplaced === 'Yes' && action && action !== 'new') {
      getInventories();
    }
  }, [isReplaced, action]);

  return (
    <View
      style={[
        styles.assetContainer,
        errors &&
          isReplaced === 'Yes' &&
          action === 'new' && {
            borderColor: colors.deleteColor,
            borderWidth: 1,
          },
      ]}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.header, isOpen && styles.headerOpen]}>
        <Text style={styles.headerText}>Asset: {asset.name}</Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>

      {isOpen && (
        <>
          <View style={styles.assetInfoContainer}>
            <View style={{flex: 1}}>
              <InfoItem
                title="Asset Name"
                text={asset?.name || '-'}
                hiddeBorder
                action={() => {
                  navigation.getState().routeNames[0] === 'PDFPlan'
                    ? navigation.navigate('Plan', {
                        screen: 'Asset',
                        params: {id: asset!.id},
                      })
                    : navigation.getState().routeNames[0] === 'Scaner'
                    ? navigation.navigate('QR', {
                        screen: 'Asset',
                        params: {id: asset!.id},
                      })
                    : navigation.navigate('Main', {
                        screen: UserRole.TECHNICIAN,
                        params: {
                          screen: getTab(navigation.getState().routeNames[0]),
                          params: {
                            screen: 'Asset',
                            params: {id: asset!.id},
                          },
                        },
                      });
                }}
              />
              <InfoItem
                title="Asset Category"
                text={asset?.category?.name || '-'}
                hiddeBorder
                img={dropdownIcons[asset?.category?.name]}
              />
              <InfoItem
                title="Asset Type"
                text={asset?.types?.name || '-'}
                hiddeBorder
              />
              {asset.building && (
                <InfoItem
                  title="Building"
                  text={asset?.building?.name || '-'}
                  hiddeBorder
                />
              )}
              {asset.floor && (
                <InfoItem
                  title="Floor"
                  text={asset?.floor.name || '-'}
                  hiddeBorder
                />
              )}
              {asset.room && (
                <InfoItem
                  title="Room"
                  text={asset?.room.name || '-'}
                  hiddeBorder
                />
              )}
            </View>
          </View>
          <View
            style={[
              {marginHorizontal: 10},
              action !== 'new' && {paddingBottom: 10},
            ]}>
            {/* <DropdownWithLeftIcon
              label="Was this asset replaced?"
              onChange={item => setIsReplaced(item.id)}
              startValue={isReplaced}
              data={isReplacedData}
            /> */}
            <Text style={styles.checkboxLabel}>Was this asset replaced?</Text>
            <BouncyCheckboxGroup
              data={isReplacedData}
              style={styles.checkboxGroup}
              checkboxProps={{
                textStyle: styles.checkboxText,
                fillColor: '#1B6BC0',
                size: 20,
                textContainerStyle: {flex: 0.5, paddingVertical: 5},
                iconImageStyle: {
                  backgroundColor: '#FFF',
                  borderRadius: 5,
                },
              }}
              //@ts-ignore
              initial={isReplaced === 'Yes' ? '0' : '1'} //error in the library. this is how it works correctly, otherwise the android app crash
              onChange={(selectedItem: ICheckboxButton) => {
                setIsReplaced(selectedItem.text as string);

                if (selectedItem.id === '1') {
                  dispatch(deleteAssetFromForm(asset.id));
                  dispatch(deleteReplacedAsset(asset.id));
                } else {
                  setIsReplaced('Yes');
                  setValues(initialValues);
                  dispatch(
                    setReplasetAssets({
                      id: asset.id,
                      item: asset,
                    }),
                  );
                }
              }}
            />
            {isReplaced === 'Yes' && (
              <DropdownWithLeftIcon
                label="Asset Source"
                onChange={item => {
                  setValues(initialValues);
                  dispatch(deleteAssetFromForm(asset.id));
                  dispatch(deleteReplacedAsset(asset.id));
                  setAction(item.id);
                }}
                startValue={action}
                data={actions}
                placeholder="Select action"
                backgroundColor={colors.secondInputBackground}
              />
            )}
          </View>
          {isReplaced === 'Yes' &&
            action &&
            (action === 'new' ? (
              <View style={styles.newAssetFormContainer}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>Is Asset Critical?</Text>
                  <View style={styles.switchSubContainer}>
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
                <InputItem
                  label="Name*"
                  defaultValue={values.name}
                  handleChange={value => {
                    setFieldValue('name', value);
                  }}
                  error={errors.name}
                  touched={submitCount > 0}
                />
                <View style={numColumn === 1 ? styles.column : styles.row}>
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
                    label="Serial Number*"
                    handleChange={value => {
                      setFieldValue('serialNumber', value);
                    }}
                    error={errors.serialNumber}
                    touched={submitCount > 0}
                    handleBlur={handleBlur('serialNumber')}
                  />
                  <InputItem
                    label="Manufacturer"
                    handleChange={value => {
                      setFieldValue('manufacturer', value);
                    }}
                    error={errors.manufacturer}
                    touched={submitCount > 0}
                    handleBlur={handleBlur('manufacturer')}
                  />
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
                  <DateInput
                    labelDate="Install Date"
                    onChange={value => {
                      setFieldValue(
                        'installDate',
                        new Date(value).toISOString(),
                      );
                    }}
                    error={errors.installDate}
                    touched={submitCount > 0}
                  />
                </View>
                <View style={numColumn === 1 ? styles.column : styles.row}>
                  <InputItem
                    label="Asset Cost"
                    numeric
                    handleChange={value => {
                      setFieldValue('cost', +value);
                    }}
                    defaultValue={values.cost}
                    error={errors.cost}
                    touched={submitCount > 0}
                    handleBlur={handleBlur('cost')}
                  />
                  <InputItem
                    label="Labor Value"
                    handleChange={value => {
                      setFieldValue('laborValue', value);
                    }}
                    error={errors.laborValue}
                    touched={submitCount > 0}
                    handleBlur={handleBlur('laborValue')}
                  />
                </View>
                {values.typeId && (
                  <>
                    <Text style={styles.checkboxText}>
                      Additional Properties
                    </Text>

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
                <View>
                  <View style={{position: 'absolute', top: -1}}>
                    <InfoIcon />
                  </View>
                  <Text style={styles.discriptionText}>
                    {'       '}
                    This asset will retain location info as well as any Fed
                    To/From Relationships, Custom Assignments, Affected Areas,
                    Plan Assignments and Positioning, and Preferred Contractors.
                  </Text>
                </View>
                {/* <Text style={styles.checkboxLabel}>
                  Would you like to retain any of these files and MOPs?
                </Text> */}
              </View>
            ) : (
              <View style={[{marginHorizontal: 10}]}>
                <DropdownWithSearch
                  label="Asset Name"
                  data={inventories}
                  onChange={item => {
                    dispatch(
                      setReplasetAssets({
                        id: asset.id,
                        item: {
                          itemId: item.id,
                          name: item.id.split('-')[0],
                          serialNumber: asset.serialNumber + 'a',
                        },
                      }),
                    );
                  }}
                  // startValue={values.bucketsId}
                  placeholder="Select Asset"
                  rightLabel
                  search={false}
                  backgroundColor={colors.secondInputBackground}
                />
              </View>
            ))}
          {isReplaced === 'Yes' && action && action !== 'new' && (
            <View style={{marginHorizontal: 15, marginBottom: 10}}>
              <Text style={styles.checkboxLabel}>
                What would you like to do with the replaced asset?
              </Text>
              <DropdownWithLeftIcon
                data={replacedActions}
                placeholder="Select action"
                onChange={item => {
                  dispatch(
                    changeReplacedActions({
                      id: asset.id,
                      item: {isDestroyAsset: item.id === 'archive'},
                    }),
                  );
                }}
                backgroundColor={colors.secondInputBackground}
              />
              {replacedAssets && replacedAssets[asset.id] && (
                <BouncyCheckbox
                  size={20}
                  style={checkboxStyles.checkbox}
                  fillColor={colors.borderAssetColor}
                  innerIconStyle={checkboxStyles.borderRadius}
                  iconStyle={checkboxStyles.borderRadius}
                  textStyle={[checkboxStyles.checkboxText, {fontWeight: '400'}]}
                  text={'Would you like to retain any of these files and MOPs?'}
                  isChecked={
                    (replacedAssets &&
                      replacedAssets[asset.id]?.isRetainFiles) ||
                    false
                  }
                  onPress={(isChecked: boolean) => {
                    dispatch(
                      changeReplacedActions({
                        id: asset.id,
                        item: {isRetainFiles: isChecked},
                      }),
                    );
                  }}
                />
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};
