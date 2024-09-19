import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ArrowRightIcon} from '../../assets/icons/ArrowRightIcon';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../hooks/hooks';
import {colors} from '../../styles/colors';
import {useEffect} from 'react';
import {getAssetTC} from '../../bll/reducers/assets-reducer';
import {
  AssetGetByEntityAttributes,
  AssetGetByEntityInclude,
} from '../../enums/assets';
import {CreateWOIcon} from '../../assets/icons/MenuIcons/CreateWOIcon';
import {InfoIcon} from '../../assets/icons/InfoIcon';
import ViewPlansIcon from '../../assets/icons/ViewPlansIcon';
import {emergencyAPI} from '../../api/emergencyApi';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {getMyUnfilledReportTC} from '../../bll/reducers/createNewEmergencyReport';

export const SuccessfullyQRScreen = ({route}: any) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  const {id} = route.params;
  const {asset} = useAppSelector(state => state.assets);

  useEffect(() => {
    dispatch(
      getAssetTC({
        assetId: id,
        params: {
          includeCriteria: [
            AssetGetByEntityInclude.BUILDING,
            AssetGetByEntityInclude.FLOOR,
            AssetGetByEntityInclude.TYPE,
            AssetGetByEntityInclude.CATEGORY,
            AssetGetByEntityInclude.QR_CODE,
          ],
          attributeCriteria: Object.values(AssetGetByEntityAttributes),
        },
      }),
    );
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Asset: {asset?.name}</Text>
        <FastImage
          style={styles.photo}
          source={
            asset?.qrCode?.url
              ? {
                  uri: asset?.qrCode?.url,
                }
              : require('../../assets/img/QR.png')
          }
          resizeMode={FastImage.resizeMode.contain}
          defaultSource={require('../../assets/img/QR.png')}
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('QR', {
                screen: 'Asset',
                params: {id},
              });
            }}>
            <View style={styles.subContainer}>
              <InfoIcon />
              <Text style={styles.buttonText}>View Asset Information</Text>
            </View>
            <ArrowRightIcon stroke={colors.textSecondColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('QR', {
                screen: 'Asset',
                params: {id, tab: 'plans'},
              });
            }}>
            <View style={styles.subContainer}>
              <ViewPlansIcon />
              <Text style={styles.buttonText}>View Plans</Text>
            </View>
            <ArrowRightIcon stroke={colors.textSecondColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('QR', {
                screen: 'CreateWorkOrder',
                params: {assetId: id},
              });
            }}>
            <View style={styles.subContainer}>
              <CreateWOIcon />
              <Text style={styles.buttonText}>Create WO</Text>
            </View>
            <ArrowRightIcon stroke={colors.textSecondColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              try {
                await emergencyAPI.autoGenerateReport(id);
                await dispatch(getMyUnfilledReportTC({}));
                navigation.navigate('QR', {
                  screen: 'EmergencyReport',
                  params: {screen: 'EmergencyReportStep2'},
                });
              } catch (err) {
                handleServerNetworkError(err.response.data);
              }
            }}
            style={[
              styles.button,
              {backgroundColor: colors.deleteButtonBackground},
            ]}>
            <View style={styles.subContainer}>
              <CreateWOIcon color={colors.deleteColor} />
              <Text style={[styles.buttonText, {color: colors.deleteColor}]}>
                Report Emergency
              </Text>
            </View>
            <ArrowRightIcon stroke={colors.deleteColor} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  subContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    textAlign: 'center',
    paddingVertical: 26,
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27,
    color: colors.textColor,
    flex: 1,
  },
  photo: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginBottom: 60,
    borderRadius: 8,
  },
  buttons: {
    flex: 1,
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    height: 38,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  buttonText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
});
