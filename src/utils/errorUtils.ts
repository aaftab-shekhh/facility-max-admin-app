import Toast from 'react-native-toast-message';

export const handleServerNetworkError = (error: {
  message: string;
  description?: string;
}) => {
  Toast.show({
    type: 'customError',
    text1: 'Error!',
    text2: error.description
      ? error.message + ' ' + error.description
      : error.message,
  });
};
