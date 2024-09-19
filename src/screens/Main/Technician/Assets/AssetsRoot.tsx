import {createStackNavigator} from '@react-navigation/stack';
import {AssetScreen} from './Asset/AssetScreen';
import {ArrowBackIcon} from '../../../../assets/icons/ArrowBackIcon';
import {AssetsScreen} from './AssetsScreen/AssetsScreen';
import {HeaderButtons} from '../../../../components/HeaderButtons';
import {WorkOrderScreen} from '../WorkOrders/WO/WorckOrderScreen';
import {CloseWorkOrder} from '../WorkOrders/WO/CloseWO/CloseWorkOrder';
import {AddNewSubcontractor} from '../WorkOrders/AddNewSubcontractor/AddNewSubcontractor';
import {colors} from '../../../../styles/colors';
import {HeaderActions} from './Asset/HeaderActions';
import {useAppSelector} from '../../../../hooks/hooks';
import {CreateWORoot} from '../WorkOrders/WO/CreateWO/CreateWORoot';
import {ContactInfo} from '../Contacts/ContactInfo';
import {SCREEN_WIDTH} from '../../../../styles/styles';
import {AssetsParamList} from '../../../../types/NavTypes/TechnicianNavTypes';
import {AddAssetScreen} from './AddNewAsset/AddAssetScreen';
import {WOHeaderMenu} from '../WorkOrders/WO/WOHeaderMenu';

const AssetsStack = createStackNavigator<AssetsParamList>();

export const AssetsRoot = () => {
  const {asset} = useAppSelector(state => state.assets);
  const {workOrder} = useAppSelector(state => state.wo);

  return (
    <AssetsStack.Navigator
      initialRouteName="Assets"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundMainColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}>
      <AssetsStack.Screen
        name="Assets"
        component={AssetsScreen}
        options={{
          title: 'Assets',
          headerLeft: () => null,
          headerRight: () => <HeaderButtons />,
        }}
      />
      <AssetsStack.Screen
        name="Asset"
        component={AssetScreen}
        options={{
          title: `Asset ${asset?.name}`,
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
      <AssetsStack.Screen
        name="CreateWorkOrder"
        component={CreateWORoot}
        options={{
          title: 'Create Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <AssetsStack.Screen
        name="WorkOrder"
        component={WorkOrderScreen}
        options={{
          title: workOrder?.number ? `WO #${workOrder.number}` : 'Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
          headerRight: () => <WOHeaderMenu />,
        }}
      />
      <AssetsStack.Screen
        name="CloseWorkOrder"
        component={CloseWorkOrder}
        options={{
          title: 'Close Work Order',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <AssetsStack.Screen
        name="AddNewSubcontractor"
        component={AddNewSubcontractor}
        options={{
          title: 'Add New Subcontractor',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <AssetsStack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          title: 'Contact',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <AssetsStack.Screen
        name="AddAsset"
        component={AddAssetScreen}
        options={{
          title: 'Add New Asset',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </AssetsStack.Navigator>
  );
};
