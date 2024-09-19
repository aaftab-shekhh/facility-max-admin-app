import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {colors} from '../styles/colors';
import {notificationsAPI} from '../api/notificationsApi';
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import {notificationsChanging} from '../bll/reducers/notifications-Reducer';

export const NotificationActions = () => {
  const dispatch = useAppDispatch();
  const {notificationsUnreadCount} = useAppSelector(
    state => state.notifications,
  );

  const readAll = async () => {
    try {
      await notificationsAPI.readAll();
      dispatch(notificationsChanging());
    } catch (err) {
      console.log(err);
    }
  };
  if (notificationsUnreadCount > 0) {
    return (
      <TouchableOpacity style={styles.container} onPress={readAll}>
        <Text style={styles.text}>Read All</Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.mainActiveColor,
  },
});
