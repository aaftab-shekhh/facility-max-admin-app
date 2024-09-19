import {createStackNavigator} from '@react-navigation/stack';
import {useAppSelector} from '../../../../hooks/hooks';
import {ArrowBackIcon} from '../../../../assets/icons/ArrowBackIcon';
import {BuildingScreen} from '../Buildings/Building/BuildingScreen';
import {MapScreen} from './MapScreen';
import {AddAssetScreen} from '../Assets/AddNewAsset/AddAssetScreen';
import {HeaderButtons} from '../../../../components/HeaderButtons';
import {AddPlanScreen} from '../Buildings/AddPlanScreen';
import {AssetScreen} from '../Assets/Asset/AssetScreen';
import {WorkOrderScreen} from '../WorkOrders/WO/WorckOrderScreen';
import {AddNewSubcontractor} from '../WorkOrders/AddNewSubcontractor/AddNewSubcontractor';
import {colors} from '../../../../styles/colors';
import {HeaderActions} from '../Assets/Asset/HeaderActions';
import {CreateWORoot} from '../WorkOrders/WO/CreateWO/CreateWORoot';
import {CloseWorkOrder} from '../WorkOrders/WO/CloseWO/CloseWorkOrder';
import {ContactInfo} from '../Contacts/ContactInfo';
import {SCREEN_WIDTH} from '../../../../styles/styles';
import {MapTabParamList} from '../../../../types/NavTypes/TechnicianNavTypes';
import {WOHeaderMenu} from '../WorkOrders/WO/WOHeaderMenu';

const MapStack = createStackNavigator<MapTabParamList>();

export const MapTab = () => {
  const {building} = useAppSelector(state => state.buildings);
  const {workOrder} = useAppSelector(state => state.wo);

  const {name} = building;
  const {asset} = useAppSelector(state => state.assets);
  return (
    <MapStack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.headerColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}>
      <MapStack.Screen
        name="Map"
        component={MapScreen}
        options={{title: 'Map', headerShown: false}}
      />
      <MapStack.Screen
        name="Building"
        component={BuildingScreen}
        options={{
          title: name ? `${name}` : 'Building',
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
          headerRight: () => (
            <HeaderButtons fill={colors.bottomActiveTextColor} />
          ),
        }}
      />
      <MapStack.Screen
        name="AddAsset"
        component={AddAssetScreen}
        options={{
          title: 'Add New Asset',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <MapStack.Screen
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
      <MapStack.Screen
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
      <MapStack.Screen
        name="CreateWorkOrder"
        component={CreateWORoot}
        options={{
          title: 'Create Work Order',
          headerShown: false,
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <MapStack.Screen
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
      <MapStack.Screen
        name="WorkOrder"
        component={WorkOrderScreen}
        options={{
          title: workOrder?.number ? `WO #${workOrder.number}` : 'Work Order',
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
            paddingHorizontal: 30,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <ArrowBackIcon stroke={colors.bottomActiveTextColor} />
          ),
          headerRight: () => <WOHeaderMenu />,
        }}
      />
      <MapStack.Screen
        name="AddNewSubcontractor"
        component={AddNewSubcontractor}
        options={{
          title: 'Add New Subcontractor',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.backgroundMainColor,
          },
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <MapStack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          title: 'Contact',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: colors.backgroundMainColor,
          },
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </MapStack.Navigator>
  );
};
