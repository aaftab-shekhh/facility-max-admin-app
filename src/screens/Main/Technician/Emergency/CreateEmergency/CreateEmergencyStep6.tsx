import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {updateFrequencyTC} from '../../../../../bll/reducers/createNewEmergencyPlan';
import {DropdownWithLeftIcon} from '../../../../../components/DropdownWithLeftIcon';
import {InputItem} from '../../../../../components/InputItam';
import {FREQUENCY} from '../../../../../bll/state';
import {ActionsButtons} from './ActionsButtons';
import {DateInput} from '../../../../../components/DateInput';

export const CreateEmergencyStep6 = ({navigation}: any) => {
  const {newEmergencyPlan} = useAppSelector(
    state => state.createNewEmergencyPlan,
  );

  const {id, currentLevel} = newEmergencyPlan;

  const [isEnabled, setIsEnabled] = useState<boolean>(
    newEmergencyPlan.frequency ? true : false,
  );
  const [frequency, setFrequency] = useState<string | undefined>(
    newEmergencyPlan.frequency || undefined,
  );
  const [frequencyStartDate, setFrequencyStartDate] = useState<
    string | undefined
  >(newEmergencyPlan.frequencyStartDate || undefined);

  const toggleSwitch = () => setIsEnabled(!isEnabled);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const payload: {
      frequency?: string;
      frequencyStartDate?: string;
      id: string;
    } = {id};

    if (frequency) {
      payload.frequency = frequency;
    }

    if (frequencyStartDate) {
      payload.frequencyStartDate = new Date(frequencyStartDate).toISOString();
    }

    isEnabled
      ? dispatch(updateFrequencyTC(payload))
      : dispatch(updateFrequencyTC({id}));
  }, [isEnabled, frequency, frequencyStartDate]);

  useEffect(() => {
    if (!currentLevel) {
      navigation.navigate('CreateEmergencyStep1');
    }
    if (currentLevel === 4) {
      navigation.navigate('CreateEmergencyStep5');
    }
    if (currentLevel === 6) {
      navigation.navigate('EmergencyTabScreen');
    }
  }, [currentLevel]);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>
          Step 6. Create Emergency Plan Review Reminder
        </Text>
        <ScrollView style={styles.body}>
          <View style={styles.switchContainer}>
            <Text style={styles.frequency}>Frequency</Text>
            <View style={styles.switchSubContainer}>
              <Text style={styles.status}>{isEnabled ? 'On' : 'Off'}</Text>
              <Switch
                trackColor={{false: '#6C757D', true: '#28A745'}}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#6C757D"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
              />
            </View>
          </View>
          <Text style={styles.text}>
            {`Would you like to set up a reminder to review this emergency plan in the future?

It is important when creating an emergency plan that it is verified from time to time to ensure that the emergency response contacts and procedures are still current.  In the event of a critical infrastructure failure or natural disaster, response time is crucial.

Choosing to set up a review reminder here will create a Preventative Maintenance Work Order at the frequency interval of your choosing, and automatically be added to your calendar and work flow.`}
          </Text>
          {!isEnabled ? (
            <>
              <InputItem
                label="Frequency"
                disabled
                defaultValue="Select a Frequency"
              />
              <InputItem
                label="Start Date"
                disabled
                defaultValue="Select a date"
              />
            </>
          ) : (
            <>
              <DropdownWithLeftIcon
                label="Frequency"
                data={FREQUENCY}
                startValue={frequency ? frequency : undefined}
                onChange={item => {
                  setFrequency(item.id);
                }}
                placeholder="Select a Frequency"
              />
              <DateInput
                labelDate="Start Date"
                startValue={frequencyStartDate ? frequencyStartDate : undefined}
                onChange={value => {
                  setFrequencyStartDate(new Date(value).toISOString());
                }}
              />
            </>
          )}
        </ScrollView>
        <ActionsButtons />
      </View>
    </>
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
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  body: {
    flex: 1,
    paddingHorizontal: 15,
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },

  switchSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  frequency: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  status: {
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14,
  },

  text: {
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginVertical: 10,
  },

  buttons: {
    marginHorizontal: 15,
  },

  previous: {
    backgroundColor: colors.textSecondColor,
    borderColor: colors.textSecondColor,
  },
});
