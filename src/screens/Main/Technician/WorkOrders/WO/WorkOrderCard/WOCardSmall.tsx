import {FC, useState} from 'react';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {OrderType} from '../../../../../../types/StateType';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {backgroundColor, backing} from './WorcOrderCard';
import {WOStatus} from '../../../../../../components/WOStatus';
import {enumTypeWO} from '../../../../../../enums/workOrders';
import {RecurringIcon} from '../../../../../../assets/icons/WO/RecurringIcon';
import FastImage from 'react-native-fast-image';
import {dropdownIcons, workOrderIcons} from '../../../../../../bll/icons';
import {WOCardBig} from './WOCardBig';
import Tooltip from 'react-native-walkthrough-tooltip';
import {TypeWOConfig} from '../../../../../../bll/state';

type WOCardSmallProps = {
  order: OrderType;
  setOpen: (open: boolean) => void;
  numColumn: number;
};

export const WOCardSmall: FC<WOCardSmallProps> = ({
  order,
  setOpen,
  numColumn,
}) => {
  // const navigation = useAppNavigation();
  const {id} = useAppSelector(state => state.user.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const changeStatus = async ({title}: {title?: string}) => {
  //   setIsMenuOpen(false);
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
  //         screen: UserRole.TECHNICIAN,
  //         params: {
  //           screen: getTab(navigation.getState().routeNames[0]),
  //           params: {
  //             screen: 'CloseWorkOrder',
  //             params: {id: order.id, title},
  //           },
  //         },
  //       });
  // };

  const techInWO = order.technicians?.find(t => t.id === id);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');

  return (
    <Tooltip
      isVisible={isMenuOpen}
      content={
        <WOCardBig
          order={order}
          setOpen={setIsMenuOpen}
          numColumn={numColumn}
        />
      }
      placement={placement}
      closeOnContentInteraction={true}
      contentStyle={{padding: 0, borderRadius: 10}}
      useInteractionManager={true}
      arrowSize={{width: 0, height: 0}}
      disableShadow
      onClose={() => setIsMenuOpen(false)}>
      <Pressable
        onPress={event => {
          numColumn && numColumn === 1
            ? setOpen(true)
            : (() => {
                event.nativeEvent.pageY < Dimensions.get('window').height / 2
                  ? setPlacement('bottom')
                  : setPlacement('top');
                setIsMenuOpen(true);
              })();
        }}
        style={[
          styles.container,
          {
            borderColor: backing[order.priority] || colors.textSecondColor,
            backgroundColor: backgroundColor[order.priority] || '#FFF',
          },
        ]}>
        <View style={[styles.row, styles.spaceBetween]}>
          <View style={[styles.gap, styles.row]}>
            <View style={[styles.row]}>
              {order?.assets && order?.assets?.length > 0 && (
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
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.itemText}>
                    #{order.number} - {order.title}
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
          <View
          // onPress={() => techInWO && changeStatus({title: 'Change Status'})}
          >
            <WOStatus status={order.status} />
          </View>
        </View>

        <Text
          style={[styles.itemText, styles.light]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {TypeWOConfig[order.type]} {order.subType && '- ' + order.subType}
        </Text>

        {order.building?.address && (
          <Text
            style={[styles.itemText, styles.light]}
            numberOfLines={1}
            ellipsizeMode="tail">
            Location:{' '}
            <Text
              style={[styles.itemText]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {order.building.address}
            </Text>
          </Text>
        )}
        {order.creatorId === id || techInWO ? (
          <View style={[styles.belongingContainer]}>
            <Text style={[styles.belongingText]}>
              {order.creatorId === id
                ? 'You are the creator'
                : 'You are assigned'}
            </Text>
          </View>
        ) : (
          <View style={{position: 'absolute'}} />
        )}
      </Pressable>
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    gap: 5,
  },
  assetIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  center: {
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  gap: {
    flex: 1,
    gap: 5,
  },
  container: {
    flex: 1,
    minHeight: 65,
    alignItems: 'baseline',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: colors.bottomActiveTextColor,
    paddingHorizontal: 15,
    paddingBottom: 10,
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
  belongingContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopStartRadius: 10,
    borderBottomEndRadius: 9,
    backgroundColor: colors.textSecondColor,
    opacity: 0.8,
  },
  belongingText: {
    fontSize: 9,
    fontFamily: '500',
    color: colors.bottomActiveTextColor,
  },
});
