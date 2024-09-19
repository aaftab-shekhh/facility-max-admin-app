import {createStackNavigator} from '@react-navigation/stack';
import {PlanParamList} from '../../types/NavTypes/NavigationTypes';
import {PlanScreen} from './PlanScreen';
import {useAppSelector} from '../../hooks/hooks';
import {ArrowBackIcon} from '../../assets/icons/ArrowBackIcon';
import {WorkOrderScreen} from '../Main/Technician/WorkOrders/WO/WorckOrderScreen';
import {WorkOrderInstruction} from '../Main/Technician/WorkOrders/WorkOrderInstruction';
import {CloseWorkOrder} from '../Main/Technician/WorkOrders/WO/CloseWO/CloseWorkOrder';
import {AddNewSubcontractor} from '../Main/Technician/WorkOrders/AddNewSubcontractor/AddNewSubcontractor';
import {AssetScreen} from '../Main/Technician/Assets/Asset/AssetScreen';
import {AddAssetScreen} from '../Main/Technician/Assets/AddNewAsset/AddAssetScreen';
import {colors} from '../../styles/colors';
import {HeaderActions} from '../Main/Technician/Assets/Asset/HeaderActions';
import {CreateWORoot} from '../Main/Technician/WorkOrders/WO/CreateWO/CreateWORoot';
import {ContactInfo} from '../Main/Technician/Contacts/ContactInfo';
import {ReplaceAsset} from './ReplaceAsset';
import {RoomDetailsScreen} from '../Main/Technician/Buildings/Building/FlorsAndPlans/RoomDetailsScreen';
import {WOHeaderMenu} from '../Main/Technician/WorkOrders/WO/WOHeaderMenu';

const PlanStack = createStackNavigator<PlanParamList>();

export const PlanRoot = () => {
  const {plan} = useAppSelector(state => state.plan);
  const {asset} = useAppSelector(state => state.assets);
  const {workOrder} = useAppSelector(state => state.wo);

  const name = plan?.name || '';
  return (
    <PlanStack.Navigator
      initialRouteName="PDFPlan"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundMainColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}>
      <PlanStack.Screen
        name="PDFPlan"
        component={PlanScreen}
        options={{
          headerShown: true,
          title: name,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
            paddingHorizontal: 30,
          },
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
        }}
      />
      <PlanStack.Screen
        name="RoomDetailsScreen"
        component={RoomDetailsScreen}
        options={{
          title: 'Room Details',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <PlanStack.Screen
        name="WorkOrder"
        component={WorkOrderScreen}
        options={{
          title: workOrder?.number ? `WO #${workOrder.number}` : 'Work Order',
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
          headerRight: () => <WOHeaderMenu />,
        }}
      />
      <PlanStack.Screen
        name="WorkOrderInstruction"
        component={WorkOrderInstruction}
        options={{
          title: 'Instructions',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <PlanStack.Screen
        name="CloseWorkOrder"
        component={CloseWorkOrder}
        options={{
          title: 'Close Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <PlanStack.Screen
        name="AddNewSubcontractor"
        component={AddNewSubcontractor}
        options={{
          title: 'Add New Subcontractor',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <PlanStack.Screen
        name="CreateWorkOrder"
        component={CreateWORoot}
        options={{
          title: 'Create Work Order',
          headerShown: false,
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <PlanStack.Screen
        name="AddAsset"
        component={AddAssetScreen}
        options={{
          title: 'Add New Asset',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <PlanStack.Screen
        name="Asset"
        component={AssetScreen}
        options={{
          title: `Asset ${asset?.name}`,
          headerRight: () => <HeaderActions />,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
            paddingHorizontal: 30,
          },
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
        }}
      />
      <PlanStack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          title: 'Contact',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <PlanStack.Screen
        name="ReplaceAsset"
        component={ReplaceAsset}
        options={{
          title: 'Replaced Asset',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </PlanStack.Navigator>
  );
};
