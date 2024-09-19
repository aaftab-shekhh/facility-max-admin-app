import {createStackNavigator} from '@react-navigation/stack';
import {colors} from '../../../../styles/colors';
import {BuildingsScreen} from './BuildingsScreen';
import {HeaderButtons} from '../../../../components/HeaderButtons';
import {ArrowBackIcon} from '../../../../assets/icons/ArrowBackIcon';
import {ContactInfo} from '../Contacts/ContactInfo';
import {BuildingsParamList} from '../../../../types/NavTypes/TechnicianNavTypes';

const BuildingsStack = createStackNavigator<BuildingsParamList>();

export const BuildingsRoot = () => {
  return (
    <BuildingsStack.Navigator
      initialRouteName="Buildings"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundMainColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}>
      <BuildingsStack.Screen
        name="Buildings"
        component={BuildingsScreen}
        options={{
          title: 'Assets',
          headerLeft: () => null,
          headerRight: () => <HeaderButtons />,
        }}
      />
      <BuildingsStack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          title: 'Contact',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      {/* <BuildingsStack.Screen
        name="Asset"
        component={AssetScreen}
        options={{
          title: `Asset ${asset.name}`,
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
      <BuildingsStack.Screen
        name="CreateWorkOrder"
        component={CreateWORoot}
        options={{
          title: 'Create Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <BuildingsStack.Screen
        name="WorkOrder"
        component={WorkOrderScreen}
        options={{
          title: 'Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <BuildingsStack.Screen
        name="CloseWorkOrder"
        component={CloseWorkOrder}
        options={{
          title: 'Close Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <BuildingsStack.Screen
        name="AddNewSubcontractor"
        component={AddNewSubcontractor}
        options={{
          title: 'Add New Subcontractor',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      /> */}
    </BuildingsStack.Navigator>
  );
};
