import {createStackNavigator} from '@react-navigation/stack';
import {ArrowBackIcon} from '../../../../../assets/icons/ArrowBackIcon';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {CreateEmergencyParamList} from '../../../../../types/NavTypes/TechnicianNavTypes';
import {CreateEmergencyStep1} from './CreateEmergencyStep1';
import {CreateEmergencyStep2} from './CreateEmergencyStep2';
import {CreateEmergencyStep3} from './CreateEmergencyStep3';
import {CreateEmergencyStep4} from './CreateEmergencyStep4';
import {CreateEmergencyStep5} from './CreateEmergencyStep5';
import {CreateEmergencyStep6} from './CreateEmergencyStep6';
import {FocusAwareStatusBar} from '../../../../../components/FocusAwareStatusBar';

const Stack = createStackNavigator<CreateEmergencyParamList>();

export const headerTitle = (line1: string, line2: string) => (
  <>
    <Text style={styles.headerTitleText}>{line1}</Text>
    <Text style={styles.headerTitleText}>{line2}</Text>
  </>
);

export const CreateEmergencyRoot = () => {
  return (
    <>
      <FocusAwareStatusBar barStyle="light-content" />
      <Stack.Navigator
        initialRouteName="CreateEmergencyStep1"
        screenOptions={{
          animationEnabled: false,
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}>
        <Stack.Screen
          name="CreateEmergencyStep1"
          component={CreateEmergencyStep1}
          options={{
            title: 'Create New Emergency Plan',
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
            ),
          }}
        />
        <Stack.Screen
          name="CreateEmergencyStep2"
          component={CreateEmergencyStep2}
          options={{
            title: 'Create New Emergency Plan',
            headerBackTitleVisible: false,
            headerBackImage: () => null,
          }}
        />
        <Stack.Screen
          name="CreateEmergencyStep3"
          component={CreateEmergencyStep3}
          options={{
            title: 'Create New Emergency Plan',
            headerBackTitleVisible: false,
            headerBackImage: () => null,
          }}
        />
        <Stack.Screen
          name="CreateEmergencyStep4"
          component={CreateEmergencyStep4}
          options={{
            title: 'Create New Emergency Plan',
            headerBackTitleVisible: false,
            headerBackImage: () => null,
          }}
        />
        <Stack.Screen
          name="CreateEmergencyStep5"
          component={CreateEmergencyStep5}
          options={{
            title: 'Create New Emergency Plan',
            headerBackTitleVisible: false,
            headerBackImage: () => null,
          }}
        />
        <Stack.Screen
          name="CreateEmergencyStep6"
          component={CreateEmergencyStep6}
          options={{
            title: 'Create New Emergency Plan',
            headerBackTitleVisible: false,
            headerBackImage: () => null,
          }}
        />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  headerTitleText: {
    maxWidth: Dimensions.get('screen').width * 0.8,
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27,
  },
});
