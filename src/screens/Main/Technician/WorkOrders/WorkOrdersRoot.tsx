import {createStackNavigator} from '@react-navigation/stack';
import {WorkOrdersScreen} from './WorkOrdersScreen';
import {ArrowBackIcon} from '../../../../assets/icons/ArrowBackIcon';
import {WorkOrderScreen} from './WO/WorckOrderScreen';
import {WorkOrderInstruction} from './WorkOrderInstruction';
import {CloseWorkOrder} from './WO/CloseWO/CloseWorkOrder';
import {AddNewSubcontractor} from './AddNewSubcontractor/AddNewSubcontractor';
import {HeaderButtons} from '../../../../components/HeaderButtons';
import {AssetScreen} from '../Assets/Asset/AssetScreen';
import {colors} from '../../../../styles/colors';
import {CreateWORoot} from './WO/CreateWO/CreateWORoot';
import {useAppSelector} from '../../../../hooks/hooks';
import {HeaderActions} from '../Assets/Asset/HeaderActions';
import {ContactInfo} from '../Contacts/ContactInfo';
import {SCREEN_WIDTH} from '../../../../styles/styles';
import {WorksOrdersParamList} from '../../../../types/NavTypes/TechnicianNavTypes';
import {WOHeaderMenu} from './WO/WOHeaderMenu';

const WorkOrdersStack = createStackNavigator<WorksOrdersParamList>();

export const WorkOrdersRoot = () => {
  const {asset} = useAppSelector(state => state.assets);
  const {workOrder} = useAppSelector(state => state.wo);

  const headerRight = () => (
    <HeaderButtons fill={colors.bottomActiveTextColor} />
  );

  return (
    <WorkOrdersStack.Navigator
      initialRouteName="WorkOrders"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundMainColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}>
      <WorkOrdersStack.Screen
        name="WorkOrders"
        component={WorkOrdersScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
          },
          title: 'Work Orders',
          headerRight: headerRight,
        }}
      />
      <WorkOrdersStack.Screen
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
      <WorkOrdersStack.Screen
        name="WorkOrderInstruction"
        component={WorkOrderInstruction}
        options={{
          title: 'Instructions',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <WorkOrdersStack.Screen
        name="CloseWorkOrder"
        component={CloseWorkOrder}
        options={{
          title: 'Close Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <WorkOrdersStack.Screen
        name="AddNewSubcontractor"
        component={AddNewSubcontractor}
        options={{
          title: 'Add New Subcontractor',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <WorkOrdersStack.Screen
        name="CreateWorkOrder"
        component={CreateWORoot}
        options={{
          headerShown: false,
          // title: 'Create Work Order',
          // headerBackTitleVisible: false,
          // headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <WorkOrdersStack.Screen
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
          title: `Asset ${asset.name}`,
          headerRight: () => <HeaderActions />,
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
        }}
      />
      <WorkOrdersStack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          title: 'Contact',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </WorkOrdersStack.Navigator>
  );
};
