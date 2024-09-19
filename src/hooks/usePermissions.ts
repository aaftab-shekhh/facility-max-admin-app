import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {Alert, Linking, Platform} from 'react-native';
import {useState} from 'react';

export const usePermissions = () => {
  const [storagePermissions, setStoragePermissions] = useState(false);
  const [cameraPermissions, setCameraPermissions] = useState(false);

  const getCameraPermissions = async () => {
    Platform.OS !== 'ios'
      ? (async () => {
          check(PERMISSIONS.ANDROID.CAMERA)
            .then(async result => {
              switch (result) {
                case RESULTS.UNAVAILABLE:
                  console.log(
                    'This feature is not available (on this device / in this context)',
                  );
                  return cameraPermissions;
                case RESULTS.DENIED:
                  request(PERMISSIONS.ANDROID.CAMERA).then(async res => {
                    res === RESULTS.GRANTED && setCameraPermissions(true);
                  });
                  console.log(
                    'The permission has not been requested / is denied but requestable',
                  );
                  return cameraPermissions;
                case RESULTS.LIMITED:
                  console.log(
                    'The permission is limited: some actions are possible',
                  );
                  setCameraPermissions(true);
                  return cameraPermissions;
                case RESULTS.GRANTED:
                  console.log('The permission is granted');
                  setCameraPermissions(true);
                  return cameraPermissions;
                case RESULTS.BLOCKED:
                  Alert.alert(
                    'Camera Access',
                    'FMPro App needs access to your Camera',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'destructive',
                      },
                      {
                        text: 'Settings',
                        onPress: async () => {
                          await openSettings();
                        },
                      },
                    ],
                  );
                  console.log(
                    'The permission is denied and not requestable anymore',
                  );
                  return cameraPermissions;
              }
            })
            .catch(error => {
              // …
            });
        })()
      : check(PERMISSIONS.IOS.CAMERA).then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)',
              );
              setCameraPermissions(false);

              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable',
              );
              request(PERMISSIONS.IOS.CAMERA).then(result => {
                if (result === RESULTS.GRANTED) {
                  setCameraPermissions(true);
                }
              });
              break;
            case RESULTS.LIMITED:
              console.log(
                'The permission is limited: some actions are possible',
              );
              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted');
              setCameraPermissions(true);

              break;
            case RESULTS.BLOCKED:
              Alert.alert(
                'Camera Access',
                'FMPro App needs access to your Camera',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'destructive',
                  },
                  {
                    text: 'Settings',
                    onPress: async () => {
                      await openSettings();
                    },
                  },
                ],
              );
              console.log(
                'The permission is denied and not requestable anymore',
              );
              break;
          }
        });
  };

  const getStoragePermissions = async () => {
    Platform.OS !== 'ios'
      ? (async () => {
          check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
            .then(async result => {
              switch (result) {
                case RESULTS.UNAVAILABLE:
                  console.log(
                    'This feature is not available (on this device / in this context)',
                  );
                  return storagePermissions;
                case RESULTS.DENIED:
                  request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(
                    async res => {
                      res === RESULTS.GRANTED && setStoragePermissions(true);
                    },
                  );
                  console.log(
                    'The permission has not been requested / is denied but requestable',
                  );
                  return storagePermissions;
                case RESULTS.LIMITED:
                  console.log(
                    'The permission is limited: some actions are possible',
                  );
                  setStoragePermissions(true);
                  return storagePermissions;
                case RESULTS.GRANTED:
                  console.log('The permission is granted');
                  setStoragePermissions(true);
                  return storagePermissions;
                case RESULTS.BLOCKED:
                  Alert.alert('Storage Access', '', [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                      style: 'destructive',
                    },
                    {
                      text: 'Settings',
                      onPress: async () => {
                        await Linking.openSettings();
                      },
                    },
                  ]);
                  console.log(
                    'The permission is denied and not requestable anymore',
                  );
                  return storagePermissions;
              }
            })
            .catch(error => {
              // …
            });
        })()
      : null;
  };
  return {
    getStoragePermissions,
    storagePermissions,
    getCameraPermissions,
    cameraPermissions,
    // getBluetoothPermissions,
    // bluetoothScanPermissions,
    // bluetoothConnectPermissions,
  };
};
