import {createStackNavigator} from '@react-navigation/stack';
import {ArrowBackIcon} from '../../../../../assets/icons/ArrowBackIcon';
import {Step1} from './Step1';
import {Step2} from './Step2';
import {Step3} from './Step3';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {EmergencyReportParamList} from '../../../../../types/NavTypes/TechnicianNavTypes';

const Stack = createStackNavigator<EmergencyReportParamList>();

export const headerTitle = (line1: string, line2: string) => (
  <>
    <Text style={styles.headerTitleText}>{line1}</Text>
    <Text style={styles.headerTitleText}>{line2}</Text>
  </>
);

export const EmergencyReportRoot = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundMainColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="EmergencyReportStep1"
        component={Step1}
        options={{
          title: 'Step 1. Choose the type of emergency',
          headerBackTitleVisible: false,
          headerTitle: () =>
            headerTitle('Step 1. Choose The Type Of', 'Emergency'),
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <Stack.Screen
        name="EmergencyReportStep2"
        component={Step2}
        options={{
          title: 'Step 2. Where is the Emergency taking place?',
          headerBackTitleVisible: false,
          headerLeft: () => null,
          headerTitle: () =>
            headerTitle('Step 2. Where Is The', 'Emergency taking place?'),

          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <Stack.Screen
        name="EmergencyReportStep3"
        component={Step3}
        options={{
          title: 'Step 3. Where is the Emergency taking place?',
          headerBackTitleVisible: false,
          headerTitle: () =>
            headerTitle(
              'Step 3. Contact Emergency',
              'Personnel and Initiate Procedures',
            ),
          headerLeft: () => null,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </Stack.Navigator>
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
