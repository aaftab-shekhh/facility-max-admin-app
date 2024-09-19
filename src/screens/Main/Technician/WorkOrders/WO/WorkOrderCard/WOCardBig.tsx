import {FC} from 'react';
import {OrderType} from '../../../../../../types/StateType';
import {colors} from '../../../../../../styles/colors';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {backgroundColor, backing} from './WorcOrderCard';
import FastImage from 'react-native-fast-image';
import {dropdownIcons, workOrderIcons} from '../../../../../../bll/icons';
import {enumTypeWO} from '../../../../../../enums/workOrders';
import {RecurringIcon} from '../../../../../../assets/icons/WO/RecurringIcon';
import {getTab} from '../../../../../../utils/getTab';
import {useAppNavigation, useAppSelector} from '../../../../../../hooks/hooks';
import {WOStatus} from '../../../../../../components/WOStatus';
import moment from 'moment';
import {DoneCalendarIcon} from '../../../../../../assets/icons/DoneCalendarIcon';
import {arrayToString} from '../../../../../../utils/arrayToString';
import {UserRole} from '../../../../../../enums/user';
import {TypeWOConfig} from '../../../../../../bll/state';

type WOCardBigProps = {
  order: OrderType;
  setOpen: (open: boolean) => void;
  numColumn: number;
  hideMoreInfo?: boolean;
};

export const WOCardBig: FC<WOCardBigProps> = ({
  order,
  setOpen,
  numColumn,
  hideMoreInfo,
}) => {
  const navigation = useAppNavigation();
  const {id} = useAppSelector(state => state.user.user);

  // const changeStatus = async ({title}: {title?: string}) => {
  //   navigation.getState().routeNames[0] === 'PDFPlan'
  //     ? navigation.navigate('Plan', {
  //         screen: 'CloseWorkOrder',
  //         params: {id: order.id},
  //       })
  //     : navigation.getState().routeNames[0] === 'Scaner'
  //     ? navigation.navigate('QR', {
  //         screen: 'CloseWorkOrder',
  //         params: {id: order.id, title},
  //       })
  //     : navigation.navigate('Main', {
  //         screen:UserRole.TECHNICIAN,
  //         params: {
  //           screen: getTab(navigation.getState().routeNames[0]),
  //           params: {
  //             screen: 'CloseWorkOrder',
  //             params: {id: order.id, title},
  //           },
  //         },
  //       });
  // };
  // const techInWO = order.technicians?.find(t => t.id === id);
  return (
    <Pressable
      onPress={() => setOpen(false)}
      style={[
        styles.container,
        hideMoreInfo && {paddingBottom: 10},
        {
          borderColor: backing[order.priority] || colors.textSecondColor,
          backgroundColor: backgroundColor[order.priority] || '#FFF',
        },
      ]}>
      <View style={[styles.row, styles.spaceBetween]}>
        <View style={[styles.gap, styles.row]}>
          <View style={[styles.row]}>
            {order.assets && order.assets.length > 0 && (
              <Pressable>
                <FastImage
                  source={
                    order.assets[0].category?.file
                      ? {uri: order.assets[0].category?.file.url}
                      : dropdownIcons[order.assets[0]?.category?.name]
                  }
                  style={[
                    styles.assetIcon,
                    order.assets[0].category?.color && {
                      backgroundColor: order.assets[0].category?.color,
                    },
                  ]}
                  defaultSource={dropdownIcons[order.assets[0].category?.name]}
                />
              </Pressable>
            )}
            <View>
              <FastImage
                source={workOrderIcons[order.type]}
                style={styles.assetIcon}
                defaultSource={workOrderIcons[order.type]}
              />
              {order.type === enumTypeWO.RECURRING_MAINTENANCE && (
                <View style={{position: 'absolute', left: 19, top: 18}}>
                  <RecurringIcon />
                </View>
              )}
            </View>
            <View style={{flex: 1}}>
              <View style={styles.row}>
                <Text style={styles.itemText}>
                  #{order?.number} - {order?.title}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.itemText, styles.light]}>Priority:</Text>
                <Text
                  style={[
                    styles.itemText,
                    {
                      color: backing[order.priority],
                      lineHeight: 14,
                    },
                  ]}>
                  {order.priority}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Pressable
        // onPress={() =>
        //   techInWO?.WorkOrderTechnician.workTechStatus ===
        //     WorkTechStatuses.WORKING && changeStatus({title: 'Change Status'})
        // }
        >
          <WOStatus status={order.status} />
        </Pressable>
        {order.creatorId === id && numColumn === 1 && (
          <View style={styles.belongingContainer}>
            <Text style={styles.belongingText}>
              {order.creatorId === id
                ? 'You are the creator'
                : 'You are assigned'}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={[styles.itemText, styles.light]}
        numberOfLines={1}
        ellipsizeMode="tail">
        {TypeWOConfig[order.type]} {order.subType && '- ' + order.subType}
      </Text>
      <View style={styles.line} />
      <View>
        <Text style={styles.itemTextHeader}>Description:</Text>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {order.description || '-'}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={styles.gap}>
          <Text style={styles.itemTextHeader}>Building:</Text>
          <Text style={styles.itemText}>{order.building?.name}</Text>
        </View>

        <View style={styles.gap}>
          <Text style={styles.itemTextHeader}>Assigned team:</Text>
          {order.buckets ? (
            <Text style={styles.description}>
              {arrayToString(order.buckets.map(el => el.name))}
            </Text>
          ) : (
            <Text style={styles.description}>-</Text>
          )}
        </View>
      </View>

      <View style={styles.line} />
      <View style={[styles.row]}>
        {order.expectedCompletionDate && (
          <View style={[styles.gap]}>
            <Text style={styles.itemTextHeader}>Due Date:</Text>
            <View style={[styles.row, {marginTop: -2, alignItems: 'center'}]}>
              <DoneCalendarIcon />
              <View>
                <Text style={[styles.itemText, {marginRight: 20}]}>
                  {moment(order.expectedCompletionDate).format('l')}
                </Text>
                <Text style={[styles.itemText, {marginRight: 20}]}>
                  {moment(order.expectedCompletionDate).format('LT')}
                </Text>
              </View>
            </View>
          </View>
        )}
        {order.estimatedLaborHours ? (
          <View style={styles.gap}>
            <Text style={styles.itemTextHeader}>Estimated Labour hours:</Text>
            <Text style={[styles.itemText]}>{order.estimatedLaborHours} h</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.gap}>
        <Text style={styles.createdDate}>
          Created by {order.creator?.firstName} {order.creator?.lastName}
          {' - '}
          {moment(order.creationDate).format('M/D/YYYY hh:mm A')}
        </Text>
      </View>
      {!hideMoreInfo && (
        <TouchableOpacity
          onPress={() => {
            setOpen(false);
            navigation.getState().routeNames[0] === 'PDFPlan'
              ? navigation.navigate('Plan', {
                  screen: 'WorkOrder',
                  params: {id: order!.id},
                })
              : navigation.getState().routeNames[0] === 'Scaner'
              ? navigation.navigate('QR', {
                  screen: 'WorkOrder',
                  params: {id: order!.id},
                })
              : navigation.navigate('Main', {
                  screen: UserRole.TECHNICIAN,
                  params: {
                    screen: getTab(navigation.getState().routeNames[0]),
                    params: {
                      screen: 'WorkOrder',
                      params: {id: order.woId ? order.woId : order.id},
                    },
                  },
                });
          }}
          style={[
            styles.moreButton,
            {
              backgroundColor:
                backing[order.priority] || colors.textSecondColor,
            },
          ]}>
          <Text style={styles.moreButtonText}>More Info</Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
  },
  assetIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  gap: {
    flex: 1,
    gap: 5,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },
  createdDate: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: colors.textSecondColor,
  },
  container: {
    flex: 1,
    maxWidth: 500,
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: colors.bottomActiveTextColor,
    paddingHorizontal: 15,
    gap: 7,
    paddingTop: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },
  light: {
    lineHeight: 14,
    color: colors.textSecondColor,
  },
  line: {
    height: 1,
    marginHorizontal: -15,
    backgroundColor: colors.backgroundGreyColor,
  },
  moreButton: {
    flex: 1,
    height: 30,
    backgroundColor: colors.mainActiveColor,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    marginHorizontal: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  itemTextHeader: {
    color: colors.textSecondColor,
  },
  belongingContainer: {
    position: 'absolute',
    right: -15,
    bottom: -28,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopStartRadius: 10,
    backgroundColor: colors.textSecondColor,
    opacity: 0.8,
  },
  belongingText: {
    fontSize: 9,
    fontFamily: '500',
    color: colors.bottomActiveTextColor,
  },
});
