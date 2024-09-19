import {Pressable, Text, View} from 'react-native';
import {styles} from './WorkOrderInfo';
import {WOStatus} from '../../../../../../components/WOStatus';
import {FC} from 'react';
import {OrderType} from '../../../../../../types/StateType';
import {EditIcon} from '../../../../../../assets/icons/EditIcon';
import {InfoItem} from '../../../../../../components/InfoItem';
import {arrayToString} from '../../../../../../utils/arrayToString';
import moment from 'moment';
import {CalendarIcon} from '../../../../../../assets/icons/CalendarIcon';
import {enumStatuses} from '../../../../../../enums/workOrders';

type StatusWOProps = {
  order: OrderType;
  closeWO: ({title}: {title: string}) => void;
};

export const StatusWO: FC<StatusWOProps> = ({order, closeWO}) => {
  return (
    <>
      {order.workOrderStatuses && order.workOrderStatuses.length > 0 && (
        <>
          <View style={styles.section}>
            <View style={[styles.header]}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Text style={[styles.headerText, {flex: undefined}]}>
                  Status:
                </Text>
                <WOStatus status={order.status} />
              </View>

              <Pressable
                onPress={() => closeWO({title: 'Change Status'})}
                hitSlop={15}>
                <EditIcon />
              </Pressable>
            </View>
          </View>

          {order.status === enumStatuses.IN_PROGRESS && (
            <View
              style={[
                styles.section,
                {paddingHorizontal: 12, paddingVertical: 8},
              ]}>
              <InfoItem
                title="Team name"
                text={arrayToString(order.buckets.map(el => el.name))}
              />
              {order.startDate && (
                <InfoItem
                  title="Team started"
                  text={moment(order.startDate).format('l LT') || '-'}
                  icon={<CalendarIcon />}
                />
              )}
              <InfoItem
                title="Technicians"
                text={
                  order.technicians &&
                  arrayToString(
                    order.technicians?.map(
                      el => `${el.firstName} ${el.lastName}`,
                    ),
                  )
                }
                hiddeBorder={!order.subcontractor}
              />
              {order.subcontractor && (
                <InfoItem
                  title="Subcontractor"
                  text={order.subcontractor.name}
                  hiddeBorder
                />
              )}
            </View>
          )}
          {order.status === enumStatuses.ON_HOLD && (
            <View
              style={[
                styles.section,
                {paddingHorizontal: 12, paddingVertical: 8},
              ]}>
              <InfoItem
                title="Hold reason"
                text={
                  order.workOrderStatuses[order.workOrderStatuses.length - 1]
                    .reasonForOnHold || '-'
                }
                hiddeBorder
              />
              {/* <InfoItem title="Hold notes" text={'&&&&&&'} column hiddeBorder /> */}
            </View>
          )}
          {/* {order.status === enumStatuses.PENDING_REVIEW && (
        <View
          style={[styles.section, {paddingHorizontal: 12, paddingVertical: 8}]}>
          <InfoItem
            title="Submitted"
            text={'&&&&&&&&'}
            icon={<CalendarIcon />}
            hiddeBorder
          />
        </View>
      )} */}
          {order.status === enumStatuses.PENDING_REVIEW && order.endDate && (
            <View
              style={[
                styles.section,
                {paddingHorizontal: 12, paddingVertical: 8},
              ]}>
              {order.endDate && (
                <View style={{flex: 1}}>
                  <InfoItem
                    title="Submitted"
                    text={
                      moment(
                        order.workOrderStatuses[
                          order.workOrderStatuses.length - 1
                        ].creationDate,
                      ).format('l LT') || '-'
                    }
                    icon={<CalendarIcon />}
                    hiddeBorder
                  />
                </View>
              )}
            </View>
          )}
          {order.status === enumStatuses.PENDING_REVIEW && (
            <View
              style={[
                styles.section,
                {paddingHorizontal: 12, paddingVertical: 8},
              ]}>
              {order.startDate && (
                <View style={{flex: 1}}>
                  <InfoItem
                    title="Start Time"
                    text={moment(order.startDate).format('l LT') || '-'}
                  />
                </View>
              )}
              {order.endDate && (
                <View style={{flex: 1}}>
                  <InfoItem
                    title="End Time"
                    text={moment(order.endDate).format('l LT') || '-'}
                  />
                </View>
              )}
              <View style={{flex: 1}}>
                <InfoItem
                  title="Total Labor Hours"
                  text={order.actualLaborHours + ' h'}
                  hiddeBorder={!order.subcontractor}
                />
              </View>
            </View>
          )}
          {order.status === enumStatuses.CANCELLED && (
            <View
              style={[
                styles.section,
                {paddingHorizontal: 12, paddingVertical: 8},
              ]}>
              <View style={{flex: 1}}>
                <InfoItem
                  title="Cancelled"
                  text={moment(
                    order.workOrderStatuses[order.workOrderStatuses?.length - 1]
                      .lastUpdateDate,
                  ).format('l LT')}
                  icon={<CalendarIcon />}
                  hiddeBorder
                />
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
};
