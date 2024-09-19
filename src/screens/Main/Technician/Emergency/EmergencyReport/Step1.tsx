import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import {stylesModal} from '../../../../../styles/styles';
import {useCallback, useEffect, useState} from 'react';
import {colors} from '../../../../../styles/colors';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {
  addOrDeleteAssetTC,
  createOrUpdateEmergencyReportTC,
  getMyUnfilledReportTC,
} from '../../../../../bll/reducers/createNewEmergencyReport';
import {EmergencyType} from '../../../../../types/StateType';
import {EmergencyReportStep1Props} from '../../../../../types/NavTypes/TechnicianNavTypes';
import {EmergencyScenario} from '../../../../../bll/state';
import {EmergencyPlanScenario} from '../../../../../enums/emergency';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {EmergencyTypeCard} from './EmergencyTypeCard';

export const Step1 = ({navigation}: EmergencyReportStep1Props) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {currentLevel, scenario} = useAppSelector(
    state => state.createNewEmergencyResport.newEmergencyReport,
  );
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [value, setValue] = useState(scenario || '');

  const getReportAssets = useCallback(async () => {
    try {
      const res = await emergencyAPI.getReportAssets();
      setSelectedAssets(res.data.assets.map(el => el.asset));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
    }
  }, []);

  const next = async () => {
    if (value !== '') {
      setIsLoading(true);
      try {
        await dispatch(createOrUpdateEmergencyReportTC({scenario: value}));
        if (value !== EmergencyPlanScenario.INFRASTRUCTURE_FAILURES) {
          selectedAssets?.forEach(asset => {
            dispatch(
              addOrDeleteAssetTC({
                action: 'detach',
                body: {assetId: asset.id},
              }),
            );
          });
        }
      } catch (err) {
        handleServerNetworkError(err.response.data);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!currentLevel || currentLevel === 0) {
      navigation.navigate('EmergencyReportStep1');
    }
    if (currentLevel === 1) {
      navigation.navigate('EmergencyReportStep2');
    }
    if (currentLevel === 2) {
      navigation.navigate('EmergencyReportStep3');
    }
  }, [currentLevel]);

  useEffect(() => {
    dispatch(getMyUnfilledReportTC({}));
    getReportAssets();
  }, []);

  const renderItem = ({item}: {item: EmergencyType}) => {
    return (
      <EmergencyTypeCard
        key={item.id}
        emergency={item}
        value={value}
        onChange={setValue}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={EmergencyScenario}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList}
      />

      <Pressable disabled={isLoading} onPress={next} style={styles.modalButton}>
        {isLoading ? (
          <ActivityIndicator color={colors.bottomActiveTextColor} />
        ) : (
          <Text style={stylesModal.modalButtonText}>Continue</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
  flatList: {
    marginTop: 10,
    gap: 10,
    paddingBottom: 70,
  },
  modalButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    width: '90%',
    paddingHorizontal: 15,
    height: 42,
    backgroundColor: colors.mainActiveColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
