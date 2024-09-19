import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppNavigation, useAppSelector } from '../../../../../hooks/hooks';
import { DotsIcon } from '../../../../../assets/icons/DotsIcon';
import { colors } from '../../../../../styles/colors';
import { useEffect, useState } from 'react';
import { PrintQRIcon } from '../../../../../assets/icons/PrintQRIcon';
import { CreateWOIcon } from '../../../../../assets/icons/MenuIcons/CreateWOIcon';
import { getTab } from '../../../../../utils/getTab';
// import { useBluPrint } from '../../../../../hooks/useBluPrint';
import { ModalLayout } from '../../../../../components/Layouts/ModalLayout';
import { PrintIcon } from '../../../../../assets/icons/PrintIcon';
import { SCREEN_HEIGHT, stylesModal } from '../../../../../styles/styles';
import { Zpl } from 'react-native-zpl-code';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { MyButton } from '../../../../../components/MyButton';
import { qrTemplate } from '../../../../../assets/qrTemplate';
import moment from 'moment';
import { qrAndroidTemplate } from '../../../../../assets/qrAndroidTemplate';
import { UserRole } from '../../../../../enums/user';

export const HeaderActions = () => {
  const navigation = useAppNavigation();
  const { asset } = useAppSelector(state => state.assets);

  const {
    getBluetoothPermissions,
    scanPrinters,
    myPrinters,
    printers,
    isLoading,
    connectAndPrint,
    print,
    bluetoothAdvertisePermissions,
    bluetoothConnectPermissions,
    bluetoothScanPermissions,
  } = useBluPrint();

  const [zpl, setZpl] = useState('');

  const zplDescription = asset.description
    ? asset.description.length > 160
      ? asset.description.slice(0, 160) + '...'
      : asset.description
    : '';

  const getZPL = async () => {
    const zplBuilder = new Zpl.Builder();

    zplBuilder.setup({
      size: {
        heightDots: 384, //384
        widthDots: 410,
      },
      labelHome: {
        x: 0,
        y: 0,
      },
      labelTop: 0,
      labeShift: 0,
      // orientation: 'INVERT',
      media: {
        type: 'NO_CONTINUOUS',
        dots: 24, //24
      },
    });

    zplBuilder.image({
      uri: Platform.OS === 'ios' ? qrTemplate : qrAndroidTemplate,
      x: 0,
      y: 0,
      width: 420,
      height: 415,
    });

    zplBuilder.qrcode({
      x: 120,
      y: 110,
      model: '1',
      size: 6,
      errorLevel: 'M',
      text: asset.id,
    });

    zplBuilder.textBlock({
      x: 10,
      y: 65,
      font: {
        type: 'ZERO',
        h: 20,
        w: 20,
      },
      text: moment(asset.installDate).format('MM-DD-YYYY'),
      width: 406,
      numLines: 1,
      textJustification: 'CENTER',
    });

    zplBuilder.textBlock({
      x: 10,
      y: 335,
      font: {
        type: 'ZERO',
        h: 20,
        w: 20,
      },
      text: asset.equipmentId,
      width: 406,
      numLines: 1,
      textJustification: 'CENTER',
    });
    zplBuilder.push(`^FO50,0^A0R,36,20^FB400,1,0,C^FD${asset.name}^FS`);
    zplBuilder.push(`^FO0,10^A0R,18,16^FB390,3,0,C^FD${zplDescription}^FS`);

    const zplCode = await zplBuilder.build();
    setZpl(zplCode);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // useEffect(() => {
  //   if (
  //     isModalVisible &&
  //     "bluetoothAdvertisePermissions" &&
  //     bluetoothConnectPermissions &&
  //     bluetoothScanPermissions
  //   ) {
  //     console.log("scanPrinters();")
  //   }
  //   if (
  //     isModalVisible &&
  //     (!bluetoothAdvertisePermissions ||
  //       !bluetoothConnectPermissions ||
  //       !bluetoothScanPermissions)
  //   ) {
  //     console.log("getBluetoothPermissions();")
  //   }
  //   getZPL();
  // }, [
  //   isModalVisible,
  //   bluetoothAdvertisePermissions,
  //   bluetoothConnectPermissions,
  //   bluetoothScanPermissions,
  // ]);

  return (
    <>
      <View style={styles.container}>
        {asset.isCritical && (
          <View style={styles.critical}>
            <Text style={styles.criticalText}>Critical</Text>
          </View>
        )}
        <Menu>
          <MenuTrigger>
            <DotsIcon
              color={colors.headerColor}
              fill={colors.bottomActiveTextColor}
            />
          </MenuTrigger>
          <MenuOptions customStyles={{ optionsContainer: styles.menuOptions }}>
            <MenuOption
              customStyles={{ optionWrapper: styles.button }}
              onSelect={toggleModal}>
              <PrintQRIcon />
              <Text style={styles.buttonText}>Print QR Code</Text>
            </MenuOption>
            <MenuOption
              customStyles={{ optionWrapper: styles.button }}
              onSelect={() => {
                navigation.getState().routeNames[0] === 'PDFPlan'
                  ? navigation.navigate('Plan', {
                    screen: 'CreateWorkOrder',
                    params: { assetId: asset.id },
                  })
                  : navigation.getState().routeNames[0] === 'Scaner'
                    ? navigation.navigate('QR', {
                      screen: 'CreateWorkOrder',
                      params: { assetId: asset.id },
                    })
                    : navigation.navigate('Main', {
                      screen: UserRole.TECHNICIAN,
                      params: {
                        screen: getTab(navigation.getState().routeNames[0]),
                        params: {
                          screen: 'CreateWorkOrder',
                          params: { assetId: asset.id },
                        },
                      },
                    });
              }}>
              <CreateWOIcon />
              <Text style={styles.buttonText}>Create WO</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      <ModalLayout
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        title="Print QR code">
        <View style={styles.modalContainer}>
          <Text style={styles.headerText}>My devices</Text>
          <FlatList
            contentContainerStyle={styles.flatList}
            // data={myPrinters}
            data={[]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.device}
                disabled={false}
                // disabled={isLoading}
                onPress={() => {
                  console.log("print")
                  // print({
                  //   deviceAddress:
                  //     Platform.OS === 'ios' ? item.serialNumber : item.address,
                  //   zpl,
                  // });
                }}>
                <Text style={styles.buttonText}>
                  {item?.name || item?.serialNumber}
                </Text>
                <PrintIcon />
              </TouchableOpacity>
            )}
          />

          {"printers" && "printers".length > 0 && (
            <Text style={styles.headerText}>Other devices</Text>
          )}
          <FlatList
            contentContainerStyle={styles.flatList}
            // data={printers}
            data={[]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.device}
                onPress={() => {
                  console.log("connectAndPrint")
                  // connectAndPrint({
                  //   deviceAddress:
                  //     Platform.OS === 'ios' ? item.name : item.address,
                  //   zpl,
                  // });
                }}>
                <Text style={styles.buttonText}>{item?.name}</Text>
                <PrintIcon />
              </TouchableOpacity>
            )}
          />
          <View
            style={[
              stylesModal.modalButtons,
              { position: 'relative', marginHorizontal: 0 },
            ]}>
            <MyButton
              text="Update device list"
              action={() => console.log("scanPrinters")}
              style="main"
              // isLoading={isLoading}
              isLoading={false}
              // disabled={isLoading}
              disabled={false}
            />
          </View>
        </View>
      </ModalLayout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
  },
  critical: {
    width: 55,
    borderRadius: 3,
    backgroundColor: '#EFAEB5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.deleteColor,
    justifyContent: 'center',
  },
  criticalText: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.deleteColor,
  },
  modal: {
    gap: 15,
  },
  menuOptions: {
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  button: {
    // minWidth: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textColor,
  },

  modalContainer: {
    maxHeight: SCREEN_HEIGHT * 0.7,
    marginBottom: 10,
    gap: 15,
  },

  flatList: {
    gap: 15,
  },

  device: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonUpdate: {
    backgroundColor: colors.mainActiveColor,
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.mainActiveColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonUpdaText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
});
