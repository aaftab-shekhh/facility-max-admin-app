import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';
import {NativeModules} from 'react-native';

const {ZSDKModule} = NativeModules;

export const useBluPrint = () => {
  const [myPrinters, setMyPrinters] = useState<any[]>([]);
  const [printers, setPrinters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeviceView, setIsDeviceView] = useState(false);
  const [bluetoothAdvertisePermissions, setBluetoothAdvertisePermissions] =
    useState(false);
  const [bluetoothScanPermissions, setBluetoothScanPermissions] =
    useState(false);
  const [bluetoothConnectPermissions, setBluetoothConnectPermissions] =
    useState(false);

  const getBluetoothPermissions = async () => {
    Platform.OS !== 'ios'
      ? (async () => {
          try {
            const granted_ACCESS_COARSE_LOCATION =
              await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'FMPro App Bluetooth Permission',
                  message:
                    'The FMPro app needs access to your Bluetooth to be detected by other devices.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
              );
            const granted_ADVERTISE = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
              {
                title: 'FMPro App Bluetooth Permission',
                message:
                  'The FMPro app needs access to your Bluetooth to be detected by other devices.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            const granted_CONNECT = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              {
                title: 'FMPro App Bluetooth Permission',
                message:
                  'FMPro App needs access to your bluetooth for connecting devices.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            const granted_SCAN = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              {
                title: 'FMPro App Bluetooth Permission',
                message:
                  'FMPro App needs access to your bluetooth for search devices.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (
              granted_ACCESS_COARSE_LOCATION ===
              PermissionsAndroid.RESULTS.GRANTED
            ) {
              console.log('You can use the bluetooth');
            } else {
              console.log('Bluetooth permission denied');
            }
            if (granted_ADVERTISE === PermissionsAndroid.RESULTS.GRANTED) {
              setBluetoothAdvertisePermissions(true);
              console.log('You can use the bluetooth');
            } else {
              setBluetoothAdvertisePermissions(false);
              console.log('Bluetooth permission denied');
            }
            if (granted_CONNECT === PermissionsAndroid.RESULTS.GRANTED) {
              setBluetoothScanPermissions(true);
              console.log('You can use the bluetooth');
            } else {
              setBluetoothScanPermissions(false);
              console.log('Bluetooth permission denied');
            }
            if (granted_SCAN === PermissionsAndroid.RESULTS.GRANTED) {
              setBluetoothConnectPermissions(true);
              console.log('You can use the bluetooth');
            } else {
              setBluetoothConnectPermissions(false);
              console.log('Bluetooth permission denied');
            }
          } catch (err) {
            console.warn(err);
          }
        })()
      : (() => {
          check(PERMISSIONS.IOS.BLUETOOTH)
            .then(result => {
              switch (result) {
                case RESULTS.UNAVAILABLE:
                  console.log(
                    'This feature is not available (on this device / in this context)',
                  );
                  break;
                case RESULTS.DENIED:
                  console.log(
                    'The permission has not been requested / is denied but requestable',
                  );
                  break;
                case RESULTS.LIMITED:
                  console.log(
                    'The permission is limited: some actions are possible',
                  );
                  break;
                case RESULTS.GRANTED:
                  console.log('The permission is granted');
                  break;
                case RESULTS.BLOCKED:
                  console.log(
                    'The permission is denied and not requestable anymore',
                  );
                  break;
              }
            })
            .catch(error => {
              // …
            });
        })();
  };

  const checkIsBluetoothEnabled = async () => {
    try {
      const isBluetoothEnabled =
        await RNZebraBluetoothPrinter.isEnabledBluetooth();
      if (!isBluetoothEnabled) {
        await RNZebraBluetoothPrinter.pairedDevices();
      } else {
        const scannedDevices = await RNZebraBluetoothPrinter.pairedDevices();
        setMyPrinters(scannedDevices);
      }
    } catch (err) {
      console.log('enableBluetoothError', err);
    }
  };

  const scanDevices = async () => {
    setIsLoading(true);

    try {
      if (Platform.OS) {
        ZSDKModule.zsdkPrinterDiscoveryBluetooth(
          (error, discoveredPrinters) => {
            if (error) {
              console.error(`Error found! ${error}`);
            }

            const printersJson = JSON.parse(discoveredPrinters);

            setMyPrinters(
              printersJson.map(
                (el: {name: string; serialNumber: string}, index: number) => ({
                  id: index.toString(),
                  name: el.name,
                  serialNumber: el.serialNumber,
                }),
              ),
            );
          },
        );
      } else {
        const scannedDevices = await RNZebraBluetoothPrinter.scanDevices();

        const parsedObj = JSON.parse(scannedDevices).found.filter(
          el => el.name,
        );

        setPrinters(parsedObj);
      }

      setIsDeviceView(true);
    } catch (err) {
      console.log('scanDevicesError' + JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const scanPrinters = async () => {
    setIsLoading(true);
    await checkIsBluetoothEnabled();
    await scanDevices();
  };

  const connectAndPrint = async ({
    deviceAddress,
    zpl,
  }: {
    deviceAddress?: string;
    zpl: string;
  }) => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'android') {
        await RNZebraBluetoothPrinter.connectDevice(deviceAddress);
      }

      Platform.OS === 'ios'
        ? await ZSDKModule.zsdkWriteBluetooth(deviceAddress, zpl)
        : await RNZebraBluetoothPrinter.print(deviceAddress, zpl);

      setIsLoading(false);
    } catch (err) {
      console.log('error' + JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const print = async ({
    deviceAddress,
    zpl,
  }: {
    deviceAddress?: string;
    zpl: string;
  }) => {
    setIsLoading(true);

    try {
      Platform.OS === 'ios'
        ? ZSDKModule.zsdkWriteBluetooth(deviceAddress, zpl)
        : await RNZebraBluetoothPrinter.print(deviceAddress, zpl);

      setIsLoading(false);
    } catch (err) {
      console.log('error' + JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    print,
    connectAndPrint,
    scanPrinters,
    scanDevices,
    checkIsBluetoothEnabled,
    getBluetoothPermissions,
    myPrinters,
    printers,
    isLoading,
    isDeviceView,
    bluetoothAdvertisePermissions,
    bluetoothConnectPermissions,
    bluetoothScanPermissions,
  };
};
