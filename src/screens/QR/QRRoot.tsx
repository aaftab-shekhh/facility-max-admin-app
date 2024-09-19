import {createStackNavigator} from '@react-navigation/stack';
import {QRParamList} from '../../types/NavTypes/NavigationTypes';
import {QRModal} from './QRModal';
import {SuccessfullyQRScreen} from './SuccessfullyQRScreen';
import {ArrowBackIcon} from '../../assets/icons/ArrowBackIcon';
import {AddNewSubcontractor} from '../Main/Technician/WorkOrders/AddNewSubcontractor/AddNewSubcontractor';
import {AssetScreen} from '../Main/Technician/Assets/Asset/AssetScreen';
import {WorkOrderScreen} from '../Main/Technician/WorkOrders/WO/WorckOrderScreen';
import {WorkOrderInstruction} from '../Main/Technician/WorkOrders/WorkOrderInstruction';
import {CloseWorkOrder} from '../Main/Technician/WorkOrders/WO/CloseWO/CloseWorkOrder';
import {colors} from '../../styles/colors';
import {HeaderActions} from '../Main/Technician/Assets/Asset/HeaderActions';
import {useAppSelector} from '../../hooks/hooks';
import {CreateWORoot} from '../Main/Technician/WorkOrders/WO/CreateWO/CreateWORoot';
import {ContactInfo} from '../Main/Technician/Contacts/ContactInfo';
import {SCREEN_WIDTH} from '../../styles/styles';
import {EmergencyReportRoot} from '../Main/Technician/Emergency/EmergencyReport/EmergencyReportRoot';
import {RoomDetailsScreen} from '../Main/Technician/Buildings/Building/FlorsAndPlans/RoomDetailsScreen';
import {WOHeaderMenu} from '../Main/Technician/WorkOrders/WO/WOHeaderMenu';

const Stack = createStackNavigator<QRParamList>();

export const QRRoot = () => {
  const {asset} = useAppSelector(state => state.assets);
  const {workOrder} = useAppSelector(state => state.wo);

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
        name="Scaner"
        component={QRModal}
        options={{
          title: 'QR Scaner',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <Stack.Screen
        name="Successfully"
        component={SuccessfullyQRScreen}
        options={{
          title: 'Successfully Scanned',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <Stack.Screen
        name="WorkOrder"
        component={WorkOrderScreen}
        options={{
          title: workOrder?.number ? `WO #${workOrder.number}` : 'Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
          headerRight: () => <WOHeaderMenu />,
        }}
      />
      <Stack.Screen
        name="WorkOrderInstruction"
        component={WorkOrderInstruction}
        options={{
          title: 'Instructions',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <Stack.Screen
        name="CloseWorkOrder"
        component={CloseWorkOrder}
        options={{
          title: 'Close Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <Stack.Screen
        name="AddNewSubcontractor"
        component={AddNewSubcontractor}
        options={{
          title: 'Add New Subcontractor',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <Stack.Screen
        name="CreateWorkOrder"
        component={CreateWORoot}
        options={{
          headerShown: false,
          title: 'Create Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <Stack.Screen
        name="Asset"
        component={AssetScreen}
        options={{
          title: `Asset ${asset.name}`,
          headerRight: () => <HeaderActions />,
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
            paddingHorizontal: 30,
            maxWidth: SCREEN_WIDTH * 0.5,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
        }}
      />
      <Stack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          title: 'Contact',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <Stack.Screen
        name="EmergencyReport"
        component={EmergencyReportRoot}
        options={{
          title: 'Emergency Plan Overview',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RoomDetailsScreen"
        component={RoomDetailsScreen}
        options={{
          title: 'Room Details',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </Stack.Navigator>
  );
};
