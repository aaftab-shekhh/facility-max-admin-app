import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {EmergencyType} from '../../../../../types/StateType';
import {useEffect, useState} from 'react';
import {stylesModal} from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {
  createOrUpdateEmergencyPlanTC,
  getMyUnfilledTC,
} from '../../../../../bll/reducers/createNewEmergencyPlan';
import {EmergencyScenario} from '../../../../../bll/state';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {EmergencyTypeCard} from '../EmergencyReport/EmergencyTypeCard';

export const CreateEmergencyStep1 = ({navigation}: any) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const {id, currentLevel, scenario} = useAppSelector(
    state => state.createNewEmergencyPlan.newEmergencyPlan,
  );

  const [value, setValue] = useState(scenario || '');

  const next = async () => {
    setIsLoading(true);
    try {
      if (value !== '') {
        id
          ? await dispatch(createOrUpdateEmergencyPlanTC({id, scenario: value}))
          : await dispatch(createOrUpdateEmergencyPlanTC({scenario: value}));
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentLevel || currentLevel === 0) {
      navigation.navigate('CreateEmergencyStep1');
    }
    if (currentLevel === 1) {
      navigation.navigate('CreateEmergencyStep2');
    }
    if (currentLevel === 2) {
      navigation.navigate('CreateEmergencyStep3');
    }
    if (currentLevel === 3) {
      navigation.navigate('CreateEmergencyStep4');
    }
    if (currentLevel === 4) {
      navigation.navigate('CreateEmergencyStep5');
    }
    if (currentLevel === 5) {
      navigation.navigate('CreateEmergencyStep6');
    }
  }, [currentLevel]);

  useEffect(() => {
    dispatch(getMyUnfilledTC({}));
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
    <View style={styles.container}>
      <Text style={styles.title}>Step 1. Select Emergency Scenario</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={EmergencyScenario}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList}
      />
      <View style={stylesModal.modalButtons}>
        <Pressable
          disabled={isLoading}
          onPress={next}
          style={stylesModal.modalButton}>
          {isLoading ? (
            <ActivityIndicator color={colors.bottomActiveTextColor} />
          ) : (
            <Text style={stylesModal.modalButtonText}>Next</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: colors.textColor,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    marginVertical: 10,
    paddingHorizontal: 15,
  },

  flatList: {
    gap: 10,
    paddingBottom: 65,
  },
});
