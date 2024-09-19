import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NotificationType} from './NotificationsScreen';
import {CalendarIcon} from '../../assets/icons/CalendarIcon';
import {FC} from 'react';
import moment from 'moment';
import {colors} from '../../styles/colors';
import FastImage from 'react-native-fast-image';
import {ListItem} from '@rneui/base';
import {DeleteIcon} from '../../assets/icons/DeleteIcon';
import {EyeIcon} from '../../assets/icons/EyeIcon';
import {EyeCrossedIcon} from '../../assets/icons/EyeCrossedIcon';
import {notificationsAPI} from '../../api/notificationsApi';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {useAppDispatch} from '../../hooks/hooks';
import {getNotificationsCountTC} from '../../bll/reducers/notifications-Reducer';
import {useNavFromNotification} from '../../hooks/useNavFromNotification';

type NotificationProps = {
  notification: NotificationType;
  deleteNotification: (id: string) => void;
  toggleViewed: (id: string) => void;
};

export const Notification: FC<NotificationProps> = ({
  notification,
  deleteNotification,
  toggleViewed,
}) => {
  const dispatch = useAppDispatch();
  const {id, isViewed, title, supportSticker, creationDate, body} =
    notification;

  const {navTo} = useNavFromNotification();

  const deleteNotifi = async () => {
    try {
      await notificationsAPI.deleteNotification(id);
      deleteNotification(id);
      dispatch(getNotificationsCountTC());
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  };

  return (
    <>
      <ListItem.Swipeable
        onPress={() => {
          navTo(notification);
        }}
        containerStyle={[
          styles.container,
          {
            backgroundColor: isViewed
              ? colors.backgroundLightColor
              : colors.secondButtonColor,
          },
        ]}
        leftContent={reset => (
          <Pressable
            onPress={() => {
              toggleViewed(id);
              reset();
            }}
            style={[
              styles.viewButton,
              {
                backgroundColor: isViewed
                  ? colors.mainActiveColor
                  : colors.textSecondColor,
              },
            ]}>
            {isViewed ? <EyeIcon /> : <EyeCrossedIcon />}
          </Pressable>
        )}
        rightContent={reset => (
          <Pressable
            onPress={() => {
              deleteNotifi();
              reset();
            }}
            style={styles.deleteButton}>
            <DeleteIcon fill={colors.bottomActiveTextColor} />
          </Pressable>
        )}
        minSlideWidth={20}
        leftWidth={60}
        rightWidth={60}>
        <View style={[styles.subCcontainer]}>
          {supportSticker && (
            <View style={styles.statusBlock}>
              <View style={styles.status}>
                <Text style={styles.statusText}>{supportSticker}</Text>
              </View>
            </View>
          )}
          <View style={styles.titleContainer}>
            <View style={styles.title}>
              <FastImage
                source={{uri: notification.icon?.url}}
                style={styles.icon}
              />
              <Text style={styles.titleText}>{title}</Text>
            </View>
          </View>

          <View style={styles.title}>
            <CalendarIcon />
            <Text style={styles.date}>{moment(creationDate).format('LL')}</Text>
          </View>

          <Text style={styles.discription}>{body}</Text>
        </View>
      </ListItem.Swipeable>
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderRadius: 10,
  },
  subCcontainer: {
    borderRadius: 10,
    gap: 12,
  },
  icon: {
    width: 36,
    height: 36,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },
  discription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textColor,
  },
  statusBlock: {
    alignItems: 'flex-end',
  },
  status: {
    borderRadius: 12,
    backgroundColor: '#DEF3E9',
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 15,
    textAlign: 'center',
    color: '#202534',
  },
  deleteButton: {
    backgroundColor: colors.deleteColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -100,
    paddingLeft: 100,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  viewButton: {
    backgroundColor: colors.mainActiveColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -100,
    paddingRight: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
