import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

export const notificationUtil = (
  notification: FirebaseMessagingTypes.Notification,
) => {
  Toast.show({
    type: 'notification',
    text1: notification.title,
    text2: notification.body,
  });
};
