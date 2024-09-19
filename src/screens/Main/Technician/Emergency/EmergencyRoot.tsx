import {createStackNavigator} from '@react-navigation/stack';
import {ArrowBackIcon} from '../../../../assets/icons/ArrowBackIcon';
import {
  EmergencyReportRoot,
  headerTitle,
} from './EmergencyReport/EmergencyReportRoot';
import {EmergencyTabScreen} from './EmergencyTabScreen';
import {EmergancyPlansRoot} from './EmergencyPlans/EmergencyPlansRoot';
import {HeaderButtons} from '../../../../components/HeaderButtons';
import {useAppSelector} from '../../../../hooks/hooks';
import {colors} from '../../../../styles/colors';
import React from 'react';
import {EmergencyPlan} from './EmergencyPlan/EmergencyPlan';
import {CreateEmergencyRoot} from './CreateEmergency/CreateEmergencyRoot';
import {AddNewSubcontractor} from '../WorkOrders/AddNewSubcontractor/AddNewSubcontractor';
import {WorkOrderScreen} from '../WorkOrders/WO/WorckOrderScreen';
import {CloseWorkOrder} from '../WorkOrders/WO/CloseWO/CloseWorkOrder';
import {CreateWORoot} from '../WorkOrders/WO/CreateWO/CreateWORoot';
import {AssetScreen} from '../Assets/Asset/AssetScreen';
import {HeaderActions} from '../Assets/Asset/HeaderActions';
import {ContactInfo} from '../Contacts/ContactInfo';
import {SCREEN_WIDTH} from '../../../../styles/styles';
import {EmergencyParamList} from '../../../../types/NavTypes/TechnicianNavTypes';
import {WOHeaderMenu} from '../WorkOrders/WO/WOHeaderMenu';

const EmergencyStack = createStackNavigator<EmergencyParamList>();

export const EmergencyRoot = () => {
  const name = useAppSelector(state => state.emergency?.emergencyPlan?.name);
  const {workOrder} = useAppSelector(state => state.wo);
  const {asset} = useAppSelector(state => state.assets);

  return (
    <EmergencyStack.Navigator
      initialRouteName="EmergencyTabScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundMainColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        // headerShown: false,
      }}>
      <EmergencyStack.Screen
        name="EmergencyTabScreen"
        component={EmergencyTabScreen}
        options={{
          title: 'Emergency Management',
          headerTitle: () => headerTitle('Emergency', 'Management'),
          headerRight: () => <HeaderButtons />,
        }}
      />
      <EmergencyStack.Screen
        name="EmergencyReport"
        component={EmergencyReportRoot}
        options={{
          title: 'Emergency Plan Overview',
          headerShown: false,
        }}
      />
      <EmergencyStack.Screen
        name="EmergencyPlans"
        component={EmergancyPlansRoot}
        options={{
          title: 'Emergency Plan Overview',
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
          },
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
        }}
      />
      <EmergencyStack.Screen
        name="EmergencyPlan"
        component={EmergencyPlan}
        options={{
          title: name ? `${name}` : 'Emergency Plan',
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
          },
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
        }}
      />
      <EmergencyStack.Screen
        name="CreateEmergency"
        component={CreateEmergencyRoot}
        options={{
          title: 'Update Password',
          headerShown: false,
        }}
      />
      <EmergencyStack.Screen
        name="Asset"
        component={AssetScreen}
        options={{
          title: `Asset ${asset.name}`,
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerRight: () => <HeaderActions />,
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
            maxWidth: SCREEN_WIDTH * 0.5,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
        }}
      />
      <EmergencyStack.Screen
        name="CreateWorkOrder"
        component={CreateWORoot}
        options={{
          title: 'Create Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <EmergencyStack.Screen
        name="CloseWorkOrder"
        component={CloseWorkOrder}
        options={{
          title: 'Close Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
          headerStyle: {
            backgroundColor: colors.backgroundMainColor,
          },
        }}
      />
      <EmergencyStack.Screen
        name="WorkOrder"
        component={WorkOrderScreen}
        options={{
          title: workOrder?.number ? `WO #${workOrder.number}` : 'Work Order',
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
            paddingHorizontal: 30,
          },
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
          headerRight: () => <WOHeaderMenu />,
        }}
      />
      <EmergencyStack.Screen
        name="AddNewSubcontractor"
        component={AddNewSubcontractor}
        options={{
          title: 'Add New Subcontractor',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <EmergencyStack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          title: 'Contact',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </EmergencyStack.Navigator>
  );
};
