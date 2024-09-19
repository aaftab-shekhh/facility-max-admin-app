import {createStackNavigator} from '@react-navigation/stack';
import {ContactsTab} from '../Contacts/ContactsTab';
import {NotificationsScreen} from '../../../Notifications/NotificationsScreen';
import {ProfileRoot} from '../Settings/ProfileRoot';
import {DashboardTab} from '../Dashboard/DashboardTab';
import {AssetScreen} from '../Assets/Asset/AssetScreen';
import {WorkOrderScreen} from '../WorkOrders/WO/WorckOrderScreen';
import {WorkOrderInstruction} from '../WorkOrders/WorkOrderInstruction';
import {CloseWorkOrder} from '../WorkOrders/WO/CloseWO/CloseWorkOrder';
import {AddNewSubcontractor} from '../WorkOrders/AddNewSubcontractor/AddNewSubcontractor';
import {ArrowBackIcon} from '../../../../assets/icons/ArrowBackIcon';
import {AssetsRoot} from '../Assets/AssetsRoot';
import {colors} from '../../../../styles/colors';
import {HeaderActions} from '../Assets/Asset/HeaderActions';
import {useAppSelector} from '../../../../hooks/hooks';
import {CreateWORoot} from '../WorkOrders/WO/CreateWO/CreateWORoot';
import {NotificationActions} from '../../../../components/NotificationActions';
import {BuildingsScreen} from '../Buildings/BuildingsScreen';
import {HeaderButtons} from '../../../../components/HeaderButtons';
import {BuildingScreen} from '../Buildings/Building/BuildingScreen';
import {AddPlanScreen} from '../Buildings/AddPlanScreen';
import {ContactInfo} from '../Contacts/ContactInfo';
import {SCREEN_WIDTH} from '../../../../styles/styles';
import {MenuParamList} from '../../../../types/NavTypes/TechnicianNavTypes';
import {RoomDetailsScreen} from '../Buildings/Building/FlorsAndPlans/RoomDetailsScreen';
import {WOHeaderMenu} from '../WorkOrders/WO/WOHeaderMenu';

const MenuStack = createStackNavigator<MenuParamList>();

export const MenuRoot = () => {
  const {asset} = useAppSelector(state => state.assets);
  const {building} = useAppSelector(state => state.buildings);
  const {workOrder} = useAppSelector(state => state.wo);

  const headerRight = () => <HeaderButtons />;

  return (
    <MenuStack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundMainColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        // headerLeft: () => null,
      }}>
      <MenuStack.Screen
        name="Dashboard"
        component={DashboardTab}
        options={{
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
          },
          title: 'Dashboard',
          headerLeft: () => null,
        }}
      />

      <MenuStack.Screen
        name="Buildings"
        component={BuildingsScreen}
        options={{
          title: 'Buildings',
          headerRight: headerRight,
          headerLeft: () => null,
        }}
      />
      <MenuStack.Screen
        name="ContactsScreen"
        component={ContactsTab}
        options={{
          title: 'Contacts',
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <MenuStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerStyle: {
            backgroundColor: colors.backgroundMainColor,
          },
          headerLeft: () => null,
          headerRight: () => <NotificationActions />,
        }}
      />
      <MenuStack.Screen
        name="Settings"
        component={ProfileRoot}
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />

      <MenuStack.Screen
        name="WorkOrder"
        component={WorkOrderScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
            paddingHorizontal: 30,
          },
          title: workOrder?.number ? `WO #${workOrder.number}` : 'Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
          headerRight: () => <WOHeaderMenu />,
        }}
      />
      <MenuStack.Screen
        name="WorkOrderInstruction"
        component={WorkOrderInstruction}
        options={{
          title: 'Instructions',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <MenuStack.Screen
        name="CloseWorkOrder"
        component={CloseWorkOrder}
        options={{
          title: 'Close Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <MenuStack.Screen
        name="AddNewSubcontractor"
        component={AddNewSubcontractor}
        options={{
          title: 'Add New Subcontractor',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <MenuStack.Screen
        name="CreateWorkOrder"
        component={CreateWORoot}
        options={{
          title: 'Create Work Order',
          headerBackTitleVisible: false,
          headerShown: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <MenuStack.Screen
        name="RootAssets"
        component={AssetsRoot}
        options={{
          title: 'Assets',
          headerShown: false,
          // headerRight: () => <HeaderButtons />,
        }}
      />
      <MenuStack.Screen
        name="Asset"
        component={AssetScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
            maxWidth: SCREEN_WIDTH * 0.5,
          },
          title: `Asset ${asset?.name}`,
          headerRight: () => <HeaderActions />,
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
        }}
      />
      <MenuStack.Screen
        name="Building"
        component={BuildingScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
            paddingHorizontal: 30,
          },
          title: building?.name || 'Building',
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
        }}
      />
      <MenuStack.Screen
        name="RoomDetailsScreen"
        component={RoomDetailsScreen}
        options={{
          title: 'Room Details',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <MenuStack.Screen
        name="AddPlan"
        component={AddPlanScreen}
        options={{
          title: 'Add Plan',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
          headerTitleStyle: {
            paddingHorizontal: 30,
          },
          headerStyle: {
            backgroundColor: colors.backgroundMainColor,
          },
        }}
      />
      <MenuStack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          title: 'Contact',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </MenuStack.Navigator>
  );
};
