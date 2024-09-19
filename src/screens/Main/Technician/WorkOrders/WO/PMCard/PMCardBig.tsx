import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import moment from 'moment';
import {DoneCalendarIcon} from '../../../../../../assets/icons/DoneCalendarIcon';
import FastImage from 'react-native-fast-image';
import {PMTypeIcons, dropdownIcons} from '../../../../../../bll/icons';
import {getTab} from '../../../../../../utils/getTab';
import {useAppNavigation} from '../../../../../../hooks/hooks';
import {OrderType} from '../../../../../../types/StateType';
import {FC} from 'react';
import {arrayToString} from '../../../../../../utils/arrayToString';
import {UserRole} from '../../../../../../enums/user';

type PMCardBigProps = {
  order: OrderType;
  setOpen: (open: boolean) => void;
  numColumn: number;
};

export const PMCardBig: FC<PMCardBigProps> = ({order, setOpen, numColumn}) => {
  const navigation = useAppNavigation();

  return (
    <Pressable onPress={() => setOpen(false)} style={styles.backing}>
      <View
        style={[
          styles.container,
          {
            borderColor: colors.mainActiveColor,
            backgroundColor: '#44B8FF1A',
          },
        ]}>
        <View style={[styles.row, styles.spaceBetween]}>
          <View style={[styles.gap, styles.row]}>
            <View style={[styles.row, {alignItems: 'center'}]}>
              {order.assets && order.assets.length > 0 && (
                <Pressable
                  onPress={() => {
                    navigation.navigate('Main', {
                      screen: UserRole.TECHNICIAN,
                      params: {
                        screen: getTab(navigation.getState().routeNames[0]),
                        params: {
                          screen: 'Asset',
                          params: {id: order.assets[0].id},
                        },
                      },
                    });
                  }}>
                  <FastImage
                    source={
                      order.assets[0].category?.link
                        ? {uri: order.assets[0].category?.link}
                        : dropdownIcons[order.assets[0].category?.name]
                    }
                    style={styles.assetIcon}
                    defaultSource={
                      dropdownIcons[order.assets[0].category?.name]
                    }
                  />
                </Pressable>
              )}
              <FastImage
                source={PMTypeIcons[order.subType]}
                style={styles.assetIcon}
                defaultSource={PMTypeIcons[order.subType]}
              />
              <View style={styles.row}>
                <Text style={styles.itemText}>{order.title || '-'}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.line} />

        <View>
          <Text style={styles.itemTextHeader}>Location:</Text>
          <Text
            style={styles.description}
            numberOfLines={1}
            ellipsizeMode="tail">
            <Text>
              {order.building?.name} {order.building?.address}{' '}
              {/* {order.building?.city} {order.building?.state}{' '}
              {order.building?.zipCode} */}
            </Text>
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.gap}>
            <Text style={styles.itemTextHeader}>Assets:</Text>
            <Text>{arrayToString(order.assets?.map(el => `${el.name}`))}</Text>
          </View>
          <View style={styles.gap}>
            <Text style={styles.itemTextHeader}>Serviced By:</Text>
            <Text>{order.assignedTeam?.name || '-'}</Text>
          </View>
        </View>
        <View style={styles.line} />

        {order.expectedCompletionDate && (
          <View style={[styles.row]}>
            <View style={[styles.gap]}>
              <Text style={styles.itemTextHeader}>Next scheduled date:</Text>
              <View style={[styles.row, {marginTop: -2, alignItems: 'center'}]}>
                <DoneCalendarIcon />
                <View>
                  <Text style={[styles.itemText, {marginRight: 20}]}>
                    {moment(order.expectedCompletionDate).format('M/D/YYYY')}
                  </Text>
                  <Text style={[styles.itemText, {marginRight: 20}]}>
                    {moment(order.expectedCompletionDate).format('h:mm A')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        <View style={styles.gap}>
          <Text style={styles.createdDate}>
            Created by {order.creator?.firstName} {order.creator?.lastName}
            {' - '}
            {moment(order.creationDate).format('M/D/YYYY hh:mm A')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setOpen(false);
            navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: getTab(navigation.getState().routeNames[0]),
                params: {
                  screen: 'WorkOrder',
                  params: {id: order.id},
                },
              },
            });
          }}
          style={[
            styles.moreButton,
            {backgroundColor: colors.mainActiveColor},
          ]}>
          <Text style={styles.moreButtonText}>More Info</Text>
        </TouchableOpacity>
      </View>
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
    // marginBottom: 5,
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
  statusText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.mainActiveColor,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.mainActiveColor,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  backing: {
    maxWidth: 500,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: colors.bottomActiveTextColor,
    paddingHorizontal: 15,
    gap: 7,
    paddingTop: 10,
    borderRadius: 10,
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
  modalContainer: {
    maxHeight: 300,
  },
  modalPickers: {
    marginTop: 30,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: colors.loadBackground,
    borderRadius: 5,
  },
  itemTextHeader: {
    color: colors.textSecondColor,
  },
});
