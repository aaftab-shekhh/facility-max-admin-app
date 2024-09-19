import {
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import {checkboxStyles, stylesModal, switchStyles} from '../../styles/styles';
import {MyButton} from '../../components/MyButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DropdownWithLeftIcon} from '../../components/DropdownWithLeftIcon';
import {useCallback, useEffect, useState} from 'react';
import {OldAssetActios, ReplaceAssetAction} from '../../enums/inventory';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {colors} from '../../styles/colors';
import {InputItem} from '../../components/InputItam';
import {AssetType, BuildingType} from '../../types/StateType';
import {ReplaceAssetProps} from '../../types/NavTypes/NavigationTypes';
import {getAssetTC, getInventoriesTC} from '../../bll/reducers/assets-reducer';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../hooks/hooks';
import {
  AssetGetByEntityAttributes,
  AssetGetByEntityInclude,
} from '../../enums/assets';
import {assetsAPI} from '../../api/assetsApi';
import {TypeAsset} from '../Main/Technician/Assets/AddNewAsset/TypeAsset';
import {useFormik} from 'formik';
import {CreateAssetForm} from '../../types/FormTypes';
import {createAssetSchema} from '../../utils/validationSchemes';
import {useNetInfo} from '@react-native-community/netinfo';
import {useOrientation} from '../../hooks/useOrientation';
import {useLocalStateSelector} from '../../hooks/useLocalStateSelector';
import {styles} from '../Main/Technician/WorkOrders/WO/CloseWO/CloseCompleted';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {DateInput} from '../../components/DateInput';
import {GetRoomsParams} from '../../api/ApiTypes';
import {buildingsAPI} from '../../api/buildingsApi';
import * as yup from 'yup';
import {ModalLayout} from '../../components/Layouts/ModalLayout';
import {DropdownAssetCategories} from '../../components/DropdownAssetCategories';
import {DropdownAssetTypes} from '../../components/DropdownAssetTypes';
import FastImage from 'react-native-fast-image';
import {CrossIconWhite} from '../../assets/icons/CrossIconWhite';
import {AddPhotoIcon} from '../../assets/icons/MenuIcons/AddPhotoIcon';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

const actions = [
  {
    id: ReplaceAssetAction.SELECT_FROM_LIST,
    name: ReplaceAssetAction.SELECT_FROM_LIST,
  },
  {
    id: ReplaceAssetAction.PULL_FROM_INVENTORY,
    name: ReplaceAssetAction.PULL_FROM_INVENTORY,
  },
  {
    id: ReplaceAssetAction.ADD_NEW_ASSET,
    name: ReplaceAssetAction.ADD_NEW_ASSET,
  },
];

const oldAssetActions: Array<{id: string; name: string}> = [
  {id: OldAssetActios.ARHIVE, name: OldAssetActios.ARHIVE},
  {id: OldAssetActios.INVENTORY, name: OldAssetActios.INVENTORY},
];

export type ReplaceRequestBodyType = {
  buildingId?: string;
  roomId?: string;
  shelf?: string;
  bin?: string;
  name?: string;
  newAsset?: any;
  isDestroyAsset?: boolean;
  isRetainRelationships?: boolean;
  isRetainFiles?: boolean;
  isRetainPreferredContractors?: boolean;
  assetId?: string;
  itemId?: string;
  serialNumber?: string;
};

export const ReplaceAsset = ({route}: ReplaceAssetProps) => {
  const {assetId} = route.params;
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const {isConnected} = useNetInfo();
  const {numColumn, onLayout} = useOrientation();
  const {customerId, regionId} = useAppSelector(state => state.user.user);

  const {getLocalBuildings} = useLocalStateSelector();

  const {asset} = useAppSelector(state => state.assets);
  const {building} = useAppSelector(state => state.buildings);
  const [newImage, setNewImage] = useState<Asset | null>(null);

  const [name, setName] = useState<string>(asset?.name || '');
  const [serialNumber, setSerialNumber] = useState<string>(
    asset?.serialNumber + '-1',
  );

  const [selectedAsset, setSelectedAsset] = useState();
  const [selectedInventory, setSelectedInventory] = useState();

  const [selectedAction, setSelectedAction] = useState(actions[0].id);
  const [oldAssetAction, setOldAssetAction] = useState(oldAssetActions[0].id);
  const [isRetainRelationships, setIsRetainRelationships] =
    useState<boolean>(true);
  const [isRetainFiles, setIsRetainFiles] = useState<boolean>(true);
  const [isRetainPreferredContractors, setIsRetainPreferredContractors] =
    useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = useCallback(() => {
    setIsModalVisible(!isModalVisible);
  }, [isModalVisible]);

  const [assets, setAssets] = useState<AssetType[]>([]);
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [rooms, setRooms] = useState<BuildingType[]>([]);

  const getAssets = async () => {
    const res = await assetsAPI.getAssetsByAntity({
      sortField: 'name',
      sortDirection: 'ASC',
      typeIdes: [asset?.types?.id],
    });
    setAssets(res.data.assets);
  };

  const createAsset = async (val: any) => {
    try {
      const props = val.props
        ? Array.from(Object.keys(val.props), id => ({
            id,
            value: String(val.props[id].value),
            name: val.props[id].name,
            type: val.props[id].type,
          }))
        : undefined;
      if (props) {
        val.props = props;
      }
      const body: ReplaceRequestBodyType = {
        name: val.name,
        newAsset: val,
        isDestroyAsset: oldAssetAction === OldAssetActios.ARHIVE,
        isRetainRelationships,
        isRetainFiles,
        isRetainPreferredContractors,
      };
      if (oldAssetAction === OldAssetActios.INVENTORY) {
        body.buildingId = form.values.buildingId;
        body.roomId = form.values.roomId;
        body.shelf = form.values.shelf;
        body.bin = form.values.bin;
      }

      const res = await assetsAPI.replaceAsset(asset.id, body);

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
        await assetsAPI.updateAssetAvatar(res.data.id, data);
      }
      navigation.goBack();
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  };

  const [validation, setValidation] = useState<any>(createAssetSchema);

  const initialValues = {
    buildingId: building?.id,
    manufacturer: '',
    isCritical: false,
    serialNumber: '',
  } as CreateAssetForm;

  const {
    errors,
    setFieldValue,
    handleBlur,
    handleSubmit,
    setValues,
    values,
    validateForm,
    submitCount,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: createAsset,
    validateOnBlur: true,
  });

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
    if (selectedAction === ReplaceAssetAction.SELECT_FROM_LIST) {
      getAssets();
    }
  }, [selectedAction, assetId, asset?.types?.id]);

  useEffect(() => {
    if (selectedAction === ReplaceAssetAction.PULL_FROM_INVENTORY) {
      dispatch(getInventoriesTC(asset?.types?.id));
    }
  }, [assetId, selectedAction]);

  useEffect(() => {
    isConnected
      ? (async () => {
          try {
            const res = await buildingsAPI.getBuildingsList({
              customerId,
              regionIdes: [regionId],
              page: 1,
              size: 100,
              sortField: 'name',
              sortDirection: 'ASC',
              keySearchValue: '',
            });
            setBuildings(
              res.data.rows.map((el: BuildingType) => ({
                ...el,
                file: el.avatar,
              })),
            );
          } catch (err) {
            handleServerNetworkError(err.response.data);
          }
        })()
      : setBuildings(getLocalBuildings({customerId}).payload as BuildingType[]);
  }, [isConnected, customerId]);

  useEffect(() => {
    if (values.buildingId) {
      (async () => {
        const params: GetRoomsParams = {
          buildingId: values.buildingId,
          page: 1,
          size: 10,
          sortField: 'name',
          sortDirection: 'ASC',
          keySearchValue: '',
        };
        const res = await buildingsAPI.getRoomsByEntity(params);
        setRooms(res.data.rows);
      })();
    }
  }, [values.buildingId]);

  useEffect(() => {
    dispatch(
      getAssetTC({
        assetId,
        params: {
          includeCriteria: [
            AssetGetByEntityInclude.TYPE,
            AssetGetByEntityInclude.CATEGORY,
          ],
          attributeCriteria: Object.values(AssetGetByEntityAttributes),
        },
      }),
    );
  }, []);

  const clearFields = (fields: string[]) => {
    fields.forEach(el => values[el] && setFieldValue(el, undefined));
  };

  useEffect(() => {
    setName(asset?.name);
    setSerialNumber(asset?.serialNumber + '-1');
  }, [asset]);

  const inventories =
    asset?.inventories?.map(el =>
      el.name ? el : {...el, name: el.equipmentId},
    ) || [];

  const save = async (val: any) => {
    try {
      const body: ReplaceRequestBodyType = {
        name,
        isDestroyAsset: oldAssetAction === OldAssetActios.ARHIVE,
        isRetainRelationships,
        isRetainFiles,
        isRetainPreferredContractors,
      };
      if (oldAssetAction === OldAssetActios.INVENTORY) {
        body.buildingId = val.buildingId;
        body.roomId = val.roomId;
        body.shelf = val.shelf;
        body.bin = val.bin;
      }

      switch (selectedAction) {
        case ReplaceAssetAction.SELECT_FROM_LIST:
          body.assetId = selectedAsset;
          await assetsAPI.replaceAsset(asset.id, body);
          navigation.goBack();
          break;
        case ReplaceAssetAction.PULL_FROM_INVENTORY:
          body.itemId = selectedInventory;
          body.serialNumber = serialNumber;
          await assetsAPI.replaceAsset(asset.id, body);
          navigation.goBack();
          break;
        case ReplaceAssetAction.ADD_NEW_ASSET:
          validateForm();
          handleSubmit();
          break;
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  };

  const form = useFormik({
    initialValues: {
      isDestroyAsset: oldAssetAction === OldAssetActios.INVENTORY,
    } as ReplaceRequestBodyType,
    validationSchema: yup.object({
      isDestroyAsset: yup.boolean(),
      buildingId: yup.string().when('isDestroyAsset', ([type], schema) => {
        if (type) {
          return schema.required('Please Select Building');
        } else {
          return schema;
        }
      }),
      roomId: yup.string().when('isDestroyAsset', ([type], schema) => {
        if (type) {
          return schema.required('Please Select Room');
        } else {
          return schema;
        }
      }),
    }),
    onSubmit: save,
    validateOnBlur: true,
  });

  return (
    <>
      <ScrollView
        onLayout={event => {
          onLayout(event.nativeEvent.layout.width);
        }}
        contentContainerStyle={[
          styles.container,
          {paddingBottom: insets.bottom + 65, paddingHorizontal: 15},
        ]}>
        <>
          <DropdownWithLeftIcon
            label="Choose an action"
            onChange={item => {
              setSelectedAction(item.id);
            }}
            startValue={selectedAction}
            data={actions}
          />
          {selectedAction === ReplaceAssetAction.SELECT_FROM_LIST && (
            <>
              <DropdownWithLeftIcon
                label="Choose Asset from the list"
                onChange={item => {
                  setSelectedAsset(item.id);
                }}
                startValue={selectedAsset}
                data={assets.filter(el => el.id !== assetId)}
              />
              <InputItem
                label="Enter Asset name"
                defaultValue={name}
                handleChange={setName}
              />
            </>
          )}
          {selectedAction === ReplaceAssetAction.PULL_FROM_INVENTORY && (
            <>
              <DropdownWithLeftIcon
                label="Choose Inventory form the list"
                onChange={item => {
                  setSelectedInventory(item.id);
                }}
                startValue={selectedInventory}
                data={inventories}
              />
            </>
          )}
          {selectedAction === ReplaceAssetAction.ADD_NEW_ASSET && (
            <View style={styles.newAssetFormContainer}>
              {newImage?.uri ? (
                <View>
                  <FastImage
                    style={styles.photo}
                    source={{
                      uri: newImage.uri,
                    }}
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
                    setFieldValue('installDate', new Date(value).toISOString());
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
                  label="Current Value"
                  handleChange={value => {
                    setFieldValue('laborValue', +value);
                  }}
                  error={errors.laborValue}
                  touched={submitCount > 0}
                  handleBlur={handleBlur('laborValue')}
                />
              </View>
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
              {/* <View>
                <View style={{position: 'absolute', top: -1}}>
                  <InfoIcon />
                </View>
                <Text style={styles.discriptionText}>
                  {'       '}
                  This asset will retain location info as well as any Fed
                  To/From Relationships, Custom Assignments, Affected Areas,
                  Plan Assignments and Positioning, and Preferred Contractors.
                </Text>
              </View> */}
              {/* <Text style={styles.checkboxLabel}>
              Would you like to retain any of these files and MOPs?
            </Text> */}
            </View>
          )}
          <Text style={[styles.switchText]}>Transfer Oprtions</Text>
          {selectedAction === ReplaceAssetAction.PULL_FROM_INVENTORY && (
            <>
              <InputItem
                label="Enter Asset name"
                defaultValue={name}
                handleChange={setName}
              />
              <InputItem
                label="Serial Number"
                defaultValue={serialNumber}
                handleChange={setSerialNumber}
              />
            </>
          )}
          <BouncyCheckbox
            size={20}
            style={checkboxStyles.checkbox}
            fillColor={colors.borderAssetColor}
            innerIconStyle={checkboxStyles.borderRadius}
            iconStyle={checkboxStyles.borderRadius}
            textStyle={[checkboxStyles.checkboxText, {fontWeight: '400'}]}
            text={'Retain Asset Relationships ?'}
            isChecked={isRetainRelationships}
            onPress={(isChecked: boolean) => {
              setIsRetainRelationships(isChecked);
            }}
          />
          <BouncyCheckbox
            size={20}
            style={checkboxStyles.checkbox}
            fillColor={colors.borderAssetColor}
            innerIconStyle={checkboxStyles.borderRadius}
            iconStyle={checkboxStyles.borderRadius}
            textStyle={[checkboxStyles.checkboxText, {fontWeight: '400'}]}
            text={'Transfer Files & Mops to New Asset ?'}
            isChecked={isRetainFiles}
            onPress={(isChecked: boolean) => {
              setIsRetainFiles(isChecked);
              // clearFields(['subcontractorId']);
            }}
          />
          <BouncyCheckbox
            size={20}
            style={[checkboxStyles.checkbox]}
            fillColor={colors.borderAssetColor}
            innerIconStyle={checkboxStyles.borderRadius}
            iconStyle={checkboxStyles.borderRadius}
            textStyle={[checkboxStyles.checkboxText, {fontWeight: '400'}]}
            text={'Retain Preferred Contractors for this new Asset?'}
            isChecked={isRetainPreferredContractors}
            onPress={(isChecked: boolean) => {
              setIsRetainPreferredContractors(isChecked);
            }}
          />
          <DropdownWithLeftIcon
            label="What would you like to do with the current asset?"
            onChange={item => {
              setOldAssetAction(item.id);
              form.setFieldValue(
                'isDestroyAsset',
                item.id === OldAssetActios.INVENTORY,
              );
            }}
            startValue={oldAssetAction}
            data={oldAssetActions}
          />
          {oldAssetAction === OldAssetActios.INVENTORY && (
            <>
              <DropdownWithLeftIcon
                label="Building"
                onChange={item => {
                  form.setFieldValue('buildingId', item.id);
                }}
                data={buildings}
                isIcon
                dropdownIcons={{
                  defaultSource: require('../../assets/img/Building.png'),
                }}
                startValue={form.values.buildingId}
                placeholder="Select a Building"
                error={form.errors.buildingId}
                touched={form.submitCount > 0}
              />
              {rooms.length > 0 && !!form.values.buildingId && (
                <DropdownWithLeftIcon
                  label={'Room'}
                  onChange={item => {
                    form.setFieldValue('roomId', item.id);
                  }}
                  data={rooms}
                  startValue={form.values.roomId}
                  placeholder={'Select Room'}
                  error={form.errors.roomId}
                  touched={form.submitCount > 0}
                />
              )}
              <InputItem
                label="Shelf"
                handleChange={form.handleChange('shelf')}
                error={form.errors.shelf}
                touched={form.submitCount > 0}
              />
              <InputItem
                label="Bin"
                handleChange={form.handleChange('bin')}
                error={form.errors.bin}
                touched={form.submitCount > 0}
              />
            </>
          )}
          <ModalLayout
            title="Remove Asset Relationships"
            toggleModal={toggleModal}
            isModalVisible={isModalVisible}>
            <>
              <Text
                style={{
                  color: colors.textColor,
                  textAlign: 'center',
                  lineHeight: 21,
                }}>
                The asset you are currently replacing has relationships,
                affected areas, preferred subcontractors, files and MOPs. If you
                click Confirm, you will lose these connections and they will not
                be transferred to the new asset. If you don’t want this, close
                this modal window and select transfer of all relationships.
              </Text>
              <View
                style={[
                  stylesModal.modalButtons,
                  {position: 'relative', marginTop: 15, marginHorizontal: 0},
                ]}>
                <MyButton text={'Cancel'} action={toggleModal} style="main" />
                <MyButton
                  text={'Confirm'}
                  action={() => {
                    form.handleSubmit();
                  }}
                  style="remove"
                />
              </View>
            </>
          </ModalLayout>
        </>
      </ScrollView>
      <View style={[stylesModal.modalButtons, {paddingBottom: insets.bottom}]}>
        <MyButton
          text={'Save'}
          action={() => {
            if (
              !isRetainRelationships &&
              !isRetainFiles &&
              !isRetainPreferredContractors
            ) {
              toggleModal();
            } else {
              form.handleSubmit();
            }
          }}
          style="main"
        />
      </View>
    </>
  );
};
