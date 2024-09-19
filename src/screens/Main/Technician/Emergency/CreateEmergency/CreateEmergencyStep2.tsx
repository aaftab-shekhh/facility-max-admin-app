import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import {colors} from '../../../../../styles/colors';
import {InputItem} from '../../../../../components/InputItam';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {ActionsButtons} from './ActionsButtons';
import {updateNewPlanStep2TC} from '../../../../../bll/reducers/createNewEmergencyPlan';

export const CreateEmergencyStep2 = ({navigation}: any) => {
  const dispatch = useAppDispatch();

  const {id, currentLevel, name, description} = useAppSelector(
    state => state.createNewEmergencyPlan.newEmergencyPlan,
  );

  const [newName, setNewName] = useState(name || '');
  const [newDescription, setNewDescription] = useState(description || '');

  const nextStep = () => {
    dispatch(
      updateNewPlanStep2TC({id, name: newName, description: newDescription}),
    );
  };

  useEffect(() => {
    if (!currentLevel) {
      navigation.navigate('CreateEmergencyStep1');
    }
    if (currentLevel === 0) {
      navigation.navigate('CreateEmergencyStep1');
    }
    if (currentLevel === 2) {
      navigation.navigate('CreateEmergencyStep3');
    }
  }, [currentLevel]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Step 2. Provide a name and detailed description for the emergency
        scenario
      </Text>
      <ScrollView style={styles.body} contentContainerStyle={{gap: 10}}>
        <InputItem
          label="Name"
          handleChange={setNewName}
          defaultValue={newName}
          error={newName.length === 0 ? 'This value can not be blank' : ''}
          touched
        />
        <InputItem
          label="Description"
          handleChange={setNewDescription}
          multiline
          defaultValue={newDescription}
          error={
            newDescription.length === 0 ? 'This value can not be blank' : ''
          }
          touched
        />
      </ScrollView>
      <ActionsButtons
        disabled={newName.length === 0 || newDescription.length === 0}
        onChange={nextStep}
      />
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

  body: {
    flex: 1,
    paddingHorizontal: 10,
  },

  previous: {
    backgroundColor: colors.textSecondColor,
    borderColor: colors.textSecondColor,
  },
});
