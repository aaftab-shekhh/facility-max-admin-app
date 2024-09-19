import {FC, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {InfoItem} from '../../../../../../components/InfoItem';
import {WOStatus} from '../../../../../../components/WOStatus';
import {EditIcon} from '../../../../../../assets/icons/EditIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {colors} from '../../../../../../styles/colors';
import {styles} from './WorkOrderInfo';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {DropdownWithLeftIcon} from '../../../../../../components/DropdownWithLeftIcon';
import {Priority, TypeWOConfig} from '../../../../../../bll/state';
import {OrderType} from '../../../../../../types/StateType';
import {enumTypeWO} from '../../../../../../enums/workOrders';
import moment from 'moment';
import {CalendarIcon} from '../../../../../../assets/icons/CalendarIcon';
import {stylesModal} from '../../../../../../styles/styles';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {
  setWorkOrder,
  updateWOTC,
} from '../../../../../../bll/reducers/wo-Reducer';
import {FileItem} from '../../../../../../components/FileItem';
import {MyButton} from '../../../../../../components/MyButton';
import {setRequest} from '../../../../../../bll/reducers/offline-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../../../../enums/offline';
import {setNewModuleItem} from '../../../../../../bll/reducers/local-reducer';
import {useNetInfo} from '@react-native-community/netinfo';

type DetailsWOProps = {
  order: OrderType;
  numColumn: number;
};

export const DetailsWO: FC<DetailsWOProps> = ({order, numColumn}) => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();

  const {workorder} = useAppSelector(state => state.local.db);

  const [isOpen, setIsOpen] = useState(true);
  const [isModalPriority, setIsModalPriority] = useState(false);
  const [isLoadingButtons, setIsLoadingButtons] = useState(false);

  const [newPriority, setNewPriority] = useState(order.priority);

  const netSave = () => {
    try {
      setIsLoadingButtons(true);
      dispatch(
        updateWOTC({
          priority: newPriority,
          workOrderId: order.id,
        }),
      );
      setIsLoadingButtons(false);
      setIsModalPriority(false);
    } catch (err) {
      console.log(err);
    }
  };

  const localSave = () => {
    dispatch(
      setRequest({
        action: OFFLINE_ACTIONS.EDIT_WO,
        method: OFFLINE_METHOD.PATCH,
        model: 'workorder',
        id: order.id,
        body: {priority: newPriority},
      }),
    );

    dispatch(
      setNewModuleItem({
        model: 'workorder',
        id: order.id,
        body: {...workorder[order.id], priority: newPriority},
      }),
    );

    dispatch(setWorkOrder({...order, priority: newPriority}));
    setIsModalPriority(false);
  };

  const save = async () => {
    isConnected ? netSave() : localSave();
  };

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.header, isOpen && styles.headerOpen]}>
        <Text style={styles.headerText}>WO Details</Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpen && (
        <View style={styles.itemContainer}>
          <View style={numColumn === 1 ? styles.column : styles.row}>
            <View style={{flex: 1}}>
              <InfoItem title="Title" text={order.title || '-'} />
            </View>
            {order.creationDate && (
              <View style={{flex: 1}}>
                <InfoItem
                  title="Created On"
                  text={moment(order.creationDate).format('l LT') || '-'}
                  icon={<CalendarIcon />}
                />
              </View>
            )}
          </View>
          <View style={numColumn === 1 ? styles.column : styles.row}>
            {order.priority && (
              <View style={{flex: 1}}>
                <InfoItem
                  title="Priority"
                  customText={<WOStatus status={order.priority} />}
                  rightIcon={
                    order.type !== enumTypeWO.PREVENTATIVE_MAINTENANCE ? (
                      <EditIcon />
                    ) : undefined
                  }
                  action={() => {
                    order.type !== enumTypeWO.PREVENTATIVE_MAINTENANCE &&
                      setIsModalPriority(!isModalPriority);
                  }}
                />
              </View>
            )}
            {order.type !== enumTypeWO.PREVENTATIVE_MAINTENANCE && (
              <View style={{flex: 1}}>
                <InfoItem
                  title="WO Type"
                  text={TypeWOConfig[order.type] || '-'}
                />
              </View>
            )}
          </View>
          <View style={numColumn === 1 ? styles.column : styles.row}>
            {order.subType && order.type === enumTypeWO.SERVICE_REQUEST && (
              <View style={{flex: 1}}>
                <InfoItem title="Service Type" text={order.subType || '-'} />
              </View>
            )}
            {order.subType && order.type === enumTypeWO.ACCESS_CONTROL && (
              <View style={{flex: 1}}>
                <InfoItem title="Access Control" text={order.subType || '-'} />
              </View>
            )}
            {order.subType &&
              order.type === enumTypeWO.RECURRING_MAINTENANCE && (
                <View style={{flex: 1}}>
                  <InfoItem title="Sub Type" text={order.subType || '-'} />
                </View>
              )}
            {order.subType &&
              order.type === enumTypeWO.PREVENTATIVE_MAINTENANCE && (
                <View style={{flex: 1}}>
                  <InfoItem title="PM Type" text={order.subType || '-'} />
                </View>
              )}
            {order.expectedCompletionDate && (
              <InfoItem
                title="Expected Completion Date/Time"
                text={moment(order.expectedCompletionDate).format('l LT')}
                icon={<CalendarIcon />}
              />
            )}
          </View>
          <InfoItem
            title="Description"
            text={order.description || '-'}
            column
            hiddeBorder
          />
          {order.requestorFiles && order.requestorFiles?.length > 0 && (
            <View style={styles.files}>
              {order.requestorFiles.map(file => (
                <FileItem
                  key={file.id}
                  file={file}
                  small
                  // refresh={getFilesAndPlans}
                />
              ))}
            </View>
          )}
        </View>
      )}
      <ModalLayout
        isModalVisible={isModalPriority}
        title="Change Work Order Priority"
        toggleModal={() => setIsModalPriority(!isModalPriority)}>
        <ScrollView>
          <DropdownWithLeftIcon
            label="Priority"
            onChange={item => {
              setNewPriority(item.id);
            }}
            startValue={newPriority}
            data={Priority}
          />
          <View style={[stylesModal.modalButtons, styles.buttons]}>
            <MyButton
              isLoading={isLoadingButtons}
              disabled={isLoadingButtons}
              text={'Save'}
              action={save}
              style="main"
            />
          </View>
        </ScrollView>
      </ModalLayout>
    </View>
  );
};
