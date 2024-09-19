import {FC, memo, useState} from 'react';
import {AllocatePartIcon} from '../../../../../../assets/icons/AllocatePartIcon';
import {CancelTransferIcon} from '../../../../../../assets/icons/CancelTransferIcon';
import {DotsIcon} from '../../../../../../assets/icons/DotsIcon';
import {RemoveAllocationIcon} from '../../../../../../assets/icons/RemoveAllocationIcon';
import {InventoryItemStatus} from '../../../../../../enums/assets';
import {colors} from '../../../../../../styles/colors';
import {StyleSheet, Text, View} from 'react-native';
import {ActionsMenu} from '../../../../../../components/ActionsMenu';
import {backgroundColor, color} from '../../../Assets/Asset/AssetInventory';
import {dropdownIcons} from '../../../../../../bll/icons';
import FastImage from 'react-native-fast-image';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {MyButton} from '../../../../../../components/MyButton';
import {stylesModal} from '../../../../../../styles/styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {InputItem} from '../../../../../../components/InputItam';
import {inventoriesAPI} from '../../../../../../api/inventoryApi';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {enumStatuses} from '../../../../../../enums/workOrders';

type ReplacementPartsItemProps = {
  item: any;
  getInventory: () => void;
};

export const ReplacementPartsItem: FC<ReplacementPartsItemProps> = memo(
  ({item, getInventory}) => {
    const partName = item.id.split('-')[0];

    const {workOrder} = useAppSelector(state => state.wo);
    const [reason, setReason] = useState('');
    const [isOpenCancelModal, setIsOpenCancelModal] = useState({
      type: '',
      isOpen: false,
    });

    const toggleIsOpen = () => {
      setIsOpenCancelModal(prev => ({...prev, isOpen: !prev.isOpen}));
    };

    const menuActions = {
      [InventoryItemStatus.ALLOCATED_FOR_WO]: {
        icon: <RemoveAllocationIcon />,
        text: 'Remove allocation',
        textColor: colors.deleteColor,
        action: async () => {
          await inventoriesAPI.setAvailable(item.id, {});
          getInventory();
        },
      },
      [InventoryItemStatus.AVAILABLE]: {
        icon: <AllocatePartIcon />,
        text: 'Allocate this part',
        action: async () => {
          await inventoriesAPI.allocateWO(item.id, {
            workOrderId: workOrder.id,
          });
          getInventory();
        },
      },
      [InventoryItemStatus.TRANSFER_REQUESTED]: {
        icon: <CancelTransferIcon />,
        text: 'Cancel Transfer request',
        action: () => {
          setIsOpenCancelModal({type: 'Transfer reques', isOpen: true});
        },
      },
      [InventoryItemStatus.ON_HOLD]: {
        icon: <CancelTransferIcon />,
        text: 'Cancel On Hold',
        action: () => {
          setIsOpenCancelModal({type: 'On Hold', isOpen: true});
        },
      },
    } as {[key: string]: any};

    const menuConfig = {
      menuButton: (
        <DotsIcon
          color={colors.backgroundLightColor}
          fill={colors.textSecondColor}
        />
      ),
      items: [] as any[],
    };

    menuConfig.items.push(menuActions[item.status]);

    return (
      <>
        <View style={styles.itemContainer}>
          <View style={styles.itemSubContainer}>
            <FastImage
              source={
                item.type.categories?.file
                  ? {uri: item.type.categories?.file.url}
                  : dropdownIcons[item.type?.categories?.name]
              }
              style={[
                styles.assetIcon,
                item.type.categories?.color && {
                  backgroundColor: item.type.categories?.color,
                },
              ]}
              defaultSource={dropdownIcons[item.type.categories?.name]}
            />
            <Text style={styles.name}>{partName}</Text>
            <View style={{flex: 1}}>
              <View
                style={[
                  styles.statusContainer,
                  {
                    backgroundColor: backgroundColor[item.status],
                    borderColor: color[item.status],
                  },
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: color[item.status],
                    },
                  ]}>
                  {item.status}{' '}
                  {item.workOrder &&
                    `#${item.workOrder?.number} ${item.workOrder?.title}`}
                </Text>
              </View>
            </View>
          </View>
          <View>
            {(item.status === InventoryItemStatus.ALLOCATED_FOR_WO &&
              item.workOrder.id !== workOrder.id) ||
            workOrder.status === enumStatuses.PENDING_REVIEW ? (
              <View style={{width: 24}} />
            ) : (
              <ActionsMenu menuConfig={menuConfig} />
            )}
          </View>
        </View>
        <ModalLayout
          isModalVisible={isOpenCancelModal.isOpen}
          title={`Cancel ‘${isOpenCancelModal.type}’ status`}
          toggleModal={toggleIsOpen}>
          <>
            <KeyboardAwareScrollView
              contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalText}>
                {isOpenCancelModal.type === 'On Hold'
                  ? 'Are you sure you want to cancel “On Hold” status? Please mention the reason.'
                  : 'Are you sure you want to cancel “Transfer request” status'}
              </Text>
              <InputItem
                label="Reason*"
                defaultValue={reason}
                handleChange={setReason}
                multiline
                placeholder="Enter your note..."
              />
            </KeyboardAwareScrollView>
            <View
              style={[
                stylesModal.modalButtons,
                {position: 'relative', marginHorizontal: 0, paddingTop: 10},
              ]}>
              <MyButton
                // isLoading={isLoadingButtons}
                // disabled={isLoadingButtons}
                text={'No'}
                action={toggleIsOpen}
                style="mainBorder"
              />
              <MyButton
                // isLoading={isLoadingButtons}
                // disabled={isLoadingButtons}
                text={'Yes'}
                action={async () => {
                  await inventoriesAPI.setAvailable(item.id, {reason});
                  getInventory();
                }}
                style="main"
              />
            </View>
          </>
        </ModalLayout>
      </>
    );
  },
);

const styles = StyleSheet.create({
  assetIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemSubContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  modalContent: {
    gap: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textColor,
    textAlign: 'center',
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textColor,
  },
});
