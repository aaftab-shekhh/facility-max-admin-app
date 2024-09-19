import {FC, useCallback, useEffect, useState} from 'react';
import {
  BuildingType,
  InventoryType,
  OrderType,
} from '../../../../../types/StateType';
import {FlatList, StyleSheet, Text, View, Pressable} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {
  getAssetTC,
  getInventoriesTC,
  setAsset,
} from '../../../../../bll/reducers/assets-reducer';
import {NotFound} from '../../../../../components/NotFound';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {colors} from '../../../../../styles/colors';
import {
  AssetGetByEntityAttributes,
  AssetGetByEntityInclude,
  InventoryItemStatus,
} from '../../../../../enums/assets';
import {MyButton} from '../../../../../components/MyButton';
import {AllocatePartsIcon} from '../../../../../assets/icons/AllocatePartsIcon';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import {
  SCREEN_HEIGHT,
  checkboxStyles,
  stylesModal,
} from '../../../../../styles/styles';
import {DropdownWithLeftIcon} from '../../../../../components/DropdownWithLeftIcon';
import {OldAssetActios, AllocatePatrs} from '../../../../../enums/inventory';
import {InputItem} from '../../../../../components/InputItam';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {woAPI} from '../../../../../api/woApi';
import {inventoriesAPI} from '../../../../../api/inventoryApi';
import {assetsAPI} from '../../../../../api/assetsApi';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {buildingsAPI} from '../../../../../api/buildingsApi';
import {GetRoomsParams} from '../../../../../api/ApiTypes';
import {useFormik} from 'formik';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import * as yup from 'yup';

type InventoryProps = {
  inv: InventoryType;
};

const allocateParts: Array<{id: string; name: string}> = [
  {id: AllocatePatrs.ASSIGT_TO_WO, name: AllocatePatrs.ASSIGT_TO_WO},
  {id: AllocatePatrs.REPLACE_ASSET, name: AllocatePatrs.REPLACE_ASSET},
];

const oldAssetActions: Array<{id: string; name: string}> = [
  {id: OldAssetActios.ARHIVE, name: OldAssetActios.ARHIVE},
  {id: OldAssetActios.INVENTORY, name: OldAssetActios.INVENTORY},
];

export const color: {[key: string]: string} = {
  [InventoryItemStatus.ALLOCATED_FOR_WO]: colors.mainActiveColor,
  [InventoryItemStatus.TRANSFER_REQUESTED]: '#6C757D',
  [InventoryItemStatus.ON_HOLD]: '#FFC107',
  [InventoryItemStatus.AVAILABLE]: '#28A745',
};

export const backgroundColor: {[key: string]: string} = {
  [InventoryItemStatus.ALLOCATED_FOR_WO]: '#1b6bc025',
  [InventoryItemStatus.TRANSFER_REQUESTED]: '#6c757d24',
  [InventoryItemStatus.ON_HOLD]: '#ffc10723',
  [InventoryItemStatus.AVAILABLE]: '#28a74523',
};

const Inventory: FC<InventoryProps> = ({inv}) => {
  const dispatch = useAppDispatch();
  const {asset} = useAppSelector(state => state.assets);
  const {customerId} = useAppSelector(state => state.user.user);

  const {isConnected} = useNetInfo();
  const {getLocalAssetsById} = useLocalStateSelector();
  const {getLocalBuildings} = useLocalStateSelector();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAllocateModal, setIsAllocateModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allocatePart, setIsAllocatePart] = useState(allocateParts[0].id);
  const [oldAssetAction, setOldAssetAction] = useState(oldAssetActions[0].id);

  const [selectedWO, setSelectedWO] = useState<string | null>();

  const [name, setName] = useState<string>(asset.name);

  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [rooms, setRooms] = useState<BuildingType[]>([]);

  const [workOrders, setWorkOrders] = useState<OrderType[]>([]);

  const toggleModal = useCallback(() => {
    setIsModalVisible(!isModalVisible);
  }, [isModalVisible]);

  const toggleAllocateModal = useCallback(() => {
    setIsAllocateModal(!isOpenAllocateModal);
  }, [isOpenAllocateModal]);

  const initialValues: ReplaceRequestBodyType = {
    itemId: inv.id,
    name,
    serialNumber: asset.serialNumber + '-1',
    isDestroyAsset: true,
  };

  const confirm = async val => {
    try {
      if (allocatePart === AllocatePatrs.ASSIGT_TO_WO && selectedWO) {
        await inventoriesAPI.allocateWO(inv.id, {
          workOrderId: selectedWO,
        });
        toggleAllocateModal();
      }
      if (allocatePart === AllocatePatrs.REPLACE_ASSET) {
        const body = {
          ...val,
          isDestroyAsset: oldAssetAction === OldAssetActios.ARHIVE,
        };

        await assetsAPI.replaceAsset(asset.id, body);
        isConnected
          ? dispatch(
              getAssetTC({
                assetId: asset.id,
                params: {
                  includeCriteria: [
                    AssetGetByEntityInclude.BUILDING,
                    AssetGetByEntityInclude.FLOOR,
                    // AssetGetByEntityInclude.ROOM,
                    AssetGetByEntityInclude.TYPE,
                    AssetGetByEntityInclude.CATEGORY,
                    AssetGetByEntityInclude.PROPS,
                  ],
                  attributeCriteria: Object.values(AssetGetByEntityAttributes),
                },
              }),
            )
          : dispatch(setAsset(getLocalAssetsById(asset.id)));
      }
      dispatch(getInventoriesTC(asset.types.id));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  };

  const {
    values,
    errors,
    handleChange,
    setFieldValue,
    submitCount,
    handleSubmit,
  } = useFormik({
    initialValues,
    onSubmit: confirm,
    validationSchema: yup.object({
      isDestroyAsset: yup.boolean(),
      buildingId: yup.string().when('isDestroyAsset', ([type], schema) => {
        if (!type) {
          return schema.required('Please Select Building');
        } else {
          return schema;
        }
      }),
      roomId: yup.string().when('isDestroyAsset', ([type], schema) => {
        if (!type) {
          return schema.required('Please Select Room');
        } else {
          return schema;
        }
      }),
    }),
  });

  const getWOs = useCallback(async () => {
    try {
      const res = await woAPI.getWorkOrders({});
      setWorkOrders(res.data.rows.map(el => ({...el, name: el.title})));
    } catch (err) {
      // handleServerNetworkError(err.response.data);
    }
  }, []);

  useEffect(() => {
    if (isOpenAllocateModal && allocatePart === AllocatePatrs.ASSIGT_TO_WO) {
      getWOs();
    }
  }, [allocatePart, isOpenAllocateModal]);

  useEffect(() => {
    isConnected
      ? (async () => {
          try {
            const res = await buildingsAPI.getBuildingByRegionId({
              customerId,
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

  const clearFields = (fields: string[]) => {
    fields.forEach(el => values[el] && setFieldValue(el, undefined));
  };

  return (
    <View style={inventoryStyles.section}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[inventoryStyles.header, isOpen && inventoryStyles.headerOpen]}>
        <Text style={inventoryStyles.headerText}>
          {inv.equipmentId}
          {'   '}
          <View
            style={[
              inventoryStyles.statusContainer,
              {
                backgroundColor: backgroundColor[inv.status],
                borderColor: color[inv.status],
              },
            ]}>
            <Text
              style={[
                inventoryStyles.statusText,
                {
                  color: color[inv.status],
                },
              ]}>
              {inv.status}{' '}
              {inv.workOrder &&
                `#${inv.workOrder?.number} ${inv.workOrder?.title}`}
            </Text>
          </View>
        </Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpen && (
        <View style={inventoryStyles.container}>
          <View style={inventoryStyles.row}>
            <Text style={inventoryStyles.title}>Manufacturer Part #</Text>
            <Text style={inventoryStyles.text}>
              {inv.manufacturerPartNumber || '-'}
            </Text>
          </View>
          <View style={inventoryStyles.row}>
            <Text style={inventoryStyles.title}>Location</Text>
            <Text style={inventoryStyles.text}>
              {inv.building?.name} {inv.room?.name} {inv.shelf} {inv.bin}
            </Text>
          </View>
          <View style={inventoryStyles.row}>
            <Text style={inventoryStyles.title}>Stock Age</Text>
            <Text style={inventoryStyles.text}>{inv.stockAge || '-'}</Text>
          </View>
          <View style={inventoryStyles.row}>
            <Text style={inventoryStyles.title}>Cost</Text>
            <Text style={inventoryStyles.text}>{inv.price + '$' || '-'}</Text>
          </View>
          <MyButton
            text={'Allocate the Part'}
            leftIcon={<AllocatePartsIcon />}
            action={toggleAllocateModal}
          />
        </View>
      )}

      <ModalLayout
        isModalVisible={isOpenAllocateModal}
        title="Allocate part"
        toggleModal={toggleAllocateModal}>
        <>
          <KeyboardAwareScrollView
            style={{maxHeight: SCREEN_HEIGHT * 0.65}}
            contentContainerStyle={{
              marginHorizontal: 5,
              gap: 10,
            }}>
            <Text style={inventoryStyles.text}>
              How would you like to allocate this inventory item?
            </Text>
            <DropdownWithLeftIcon
              onChange={item => {
                setIsAllocatePart(item.id);
                if (item.id === AllocatePatrs.ASSIGT_TO_WO) {
                  clearFields([
                    'isRetainFiles',
                    'isRetainPreferredContractors',
                    'isRetainRelationships',
                    'workOrderId',
                    'buildingId',
                    'roomId',
                    'shelf',
                    'bin',
                  ]);
                  setFieldValue('isDestroyAsset', false);
                }
                if (item.id === AllocatePatrs.REPLACE_ASSET) {
                  setFieldValue('isRetainFiles', true);
                  setFieldValue('isRetainPreferredContractors', true);
                  setFieldValue('isRetainRelationships', true);
                  setFieldValue('isDestroyAsset', true);
                }
              }}
              startValue={allocatePart}
              data={allocateParts}
            />
            {allocatePart === AllocatePatrs.ASSIGT_TO_WO && (
              <DropdownWithLeftIcon
                label="WO"
                onChange={item => {
                  setSelectedWO(item.id);
                }}
                data={workOrders}
              />
            )}
            {allocatePart === AllocatePatrs.REPLACE_ASSET && (
              <>
                <InputItem
                  label="Enter Asset name"
                  defaultValue={name}
                  handleChange={setName}
                />
                <InputItem
                  label="Serial Number"
                  defaultValue={values.serialNumber}
                  handleChange={handleChange('setSerialNumber')}
                />
                <View style={styles.checkbox}>
                  <View style={styles.checkboxTextContainer}>
                    <Text style={styles.checkboxText}>
                      Retain Asset Relationships ?
                    </Text>
                  </View>
                  <BouncyCheckbox
                    size={20}
                    style={checkboxStyles.checkbox}
                    fillColor={colors.borderAssetColor}
                    innerIconStyle={checkboxStyles.borderRadius}
                    iconStyle={checkboxStyles.borderRadius}
                    isChecked={values.isRetainRelationships}
                    onPress={(isChecked: boolean) => {
                      setFieldValue('isRetainRelationships', isChecked);
                    }}
                  />
                </View>
                <View style={styles.checkbox}>
                  <View style={styles.checkboxTextContainer}>
                    <Text style={styles.checkboxText}>
                      Transfer Files & Mops to New Asset ?
                    </Text>
                  </View>
                  <BouncyCheckbox
                    size={20}
                    style={checkboxStyles.checkbox}
                    fillColor={colors.borderAssetColor}
                    innerIconStyle={checkboxStyles.borderRadius}
                    iconStyle={checkboxStyles.borderRadius}
                    isChecked={values.isRetainFiles}
                    onPress={(isChecked: boolean) => {
                      setFieldValue('isRetainFiles', isChecked);
                    }}
                  />
                </View>
                <View style={styles.checkbox}>
                  <View style={styles.checkboxTextContainer}>
                    <Text style={styles.checkboxText}>
                      Retain Preferred Contractors for this new Asset?
                    </Text>
                  </View>
                  <BouncyCheckbox
                    size={20}
                    style={[checkboxStyles.checkbox]}
                    fillColor={colors.borderAssetColor}
                    innerIconStyle={checkboxStyles.borderRadius}
                    iconStyle={checkboxStyles.borderRadius}
                    isChecked={values.isRetainPreferredContractors}
                    onPress={(isChecked: boolean) => {
                      setFieldValue('isRetainPreferredContractors', isChecked);
                    }}
                  />
                </View>

                <View style={inventoryStyles.line} />
                <Text style={inventoryStyles.text}>
                  What would you like to do with the old asset?
                </Text>
                <DropdownWithLeftIcon
                  onChange={item => {
                    setOldAssetAction(item.id);
                    if (item.id === OldAssetActios.ARHIVE) {
                      setFieldValue('isDestroyAsset', true);
                    } else {
                      setFieldValue('isDestroyAsset', false);
                    }
                  }}
                  startValue={oldAssetAction}
                  data={oldAssetActions}
                />
                {oldAssetAction === OldAssetActios.INVENTORY && (
                  <>
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
                    {rooms.length > 0 && !!values.buildingId && (
                      <DropdownWithLeftIcon
                        label={'Room'}
                        onChange={item => {
                          setFieldValue('roomId', item.id);
                        }}
                        data={rooms}
                        startValue={values.roomId}
                        placeholder={'Select Room'}
                        error={errors.roomId}
                        touched={submitCount > 0}
                      />
                    )}
                    <InputItem
                      label="Shelf"
                      handleChange={handleChange('shelf')}
                      error={errors.shelf}
                      touched={submitCount > 0}
                    />
                    <InputItem
                      label="Bin"
                      handleChange={handleChange('bin')}
                      error={errors.bin}
                      touched={submitCount > 0}
                    />
                  </>
                )}
              </>
            )}
          </KeyboardAwareScrollView>
          <View
            style={[
              stylesModal.modalButtons,
              {position: 'relative', marginHorizontal: 0, paddingTop: 10},
            ]}>
            <MyButton
              // isLoading={isLoadingButtons}
              // disabled={isLoadingButtons}
              text={'Cancel'}
              action={toggleAllocateModal}
              style="mainBorder"
            />
            <MyButton
              // isLoading={isLoadingButtons}
              // disabled={isLoadingButtons}
              text={'Confirm'}
              action={() => {
                if (
                  allocatePart === AllocatePatrs.REPLACE_ASSET &&
                  !values.isRetainRelationships &&
                  !values.isRetainFiles &&
                  !values.isRetainPreferredContractors
                ) {
                  toggleModal();
                } else {
                  handleSubmit();
                }
              }}
              style="main"
            />
          </View>
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
                    handleSubmit();
                  }}
                  style="remove"
                />
              </View>
            </>
          </ModalLayout>
        </>
      </ModalLayout>
    </View>
  );
};

export const AssetInventory = () => {
  const dispatch = useAppDispatch();
  const {inventories, types} = useAppSelector(state => state.assets.asset);

  useEffect(() => {
    dispatch(getInventoriesTC(types.id));
  }, [types.id]);

  return (
    <FlatList
      data={inventories}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        return <Inventory inv={item} />;
      }}
      style={styles.container}
      contentContainerStyle={styles.flatList}
      ListEmptyComponent={() => {
        return (
          <NotFound title="There are currently no replacement parts on hand for this work order's identified assets." />
        );
      }}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 10,
    flexGrow: 1,
  },
  checkbox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  checkboxTextContainer: {
    width: '100%',
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 21,
    color: '#000',
    // width: '100%',
  },
});

const inventoryStyles = StyleSheet.create({
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  statusContainer: {
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderStyle: 'solid',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    textAlign: 'center',
  },
  headerText: {
    gap: 10,
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },
  container: {
    marginLeft: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    gap: 10,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopStartRadius: 4,
    borderBottomStartRadius: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#848A9B',
  },
  text: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#202534',
  },
  line: {
    height: 1,
    backgroundColor: colors.backgroundGreyColor,
  },
});
