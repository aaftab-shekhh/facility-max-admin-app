import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {WorkOrdersRoot} from './WorkOrders/WorkOrdersRoot';
import {OrdersIcon} from '../../../assets/icons/MenuIcons/OrdersIcon';
import {MapTabIcon} from '../../../assets/icons/MenuIcons/MapTabIcon';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {QRIcon} from '../../../assets/icons/QRIcon';
import {MapTab} from './Map/MapTab';
import {colors} from '../../../styles/colors';
import {MenuRoot} from './Menu/MenuRoot';
import {MenuTabIco} from '../../../assets/icons/MenuIcons/MenuTabIco';
import {EmergencyTabIcon} from '../../../assets/icons/MenuIcons/EmergencyTabIcon';
import {EmergencyRoot} from './Emergency/EmergencyRoot';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../../hooks/hooks';
import {getAssignedBucketsTC} from '../../../bll/reducers/user-reducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ParamList} from '../../../types/NavTypes/TechnicianNavTypes';

const TechnicianTab = createBottomTabNavigator<ParamList>();

export const TechnicianRoot = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const {bottom} = useSafeAreaInsets();
  const userId = useAppSelector(state => state.user?.user.id);

  useEffect(() => {
    dispatch(getAssignedBucketsTC({userId}));
  }, []);

  return (
    <>
      <TechnicianTab.Navigator
        initialRouteName="MenuTab"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          tabBarStyle: {
            paddingTop: 10,
            paddingHorizontal: 1,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          tabBarHideOnKeyboard: true,
          tabBarLabelPosition: 'below-icon',
          tabBarActiveTintColor: colors.mainActiveColor,
          tabBarInactiveTintColor: 'rgba(27, 107, 192, 0.50)',
        }}>
        <TechnicianTab.Screen
          name="WorkOrdersTab"
          component={WorkOrdersRoot}
          options={{
            headerShown: false,
            title: 'Work Orders',
            tabBarIcon: ({color}) => <OrdersIcon fill={color} />,
          }}
        />
        <TechnicianTab.Screen
          name="MapTab"
          component={MapTab}
          options={{
            title: 'Map',
            headerShown: false,
            tabBarIcon: ({color}) => <MapTabIcon fill={color} />,
          }}
        />
        <TechnicianTab.Screen
          name="QR"
          component={MenuRoot}
          options={{
            headerShown: false,
            title: 'QR',
            tabBarIcon: ({color}) => <MenuTabIco fill={color} />,
            tabBarButton: () => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.qr, bottom === 0 && styles.smallQr]}
                onPress={() => {
                  navigation.navigate('QR', {screen: 'Scaner'});
                }}>
                <QRIcon />
              </TouchableOpacity>
            ),
          }}
        />
        <TechnicianTab.Screen
          name="EmergencyTab"
          component={EmergencyRoot}
          options={{
            title: 'Emergency',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <EmergencyTabIcon fill={focused ? color : '#dc35457e'} />
            ),
            tabBarActiveTintColor: colors.deleteColor,
            tabBarLabel: ({color, focused}) => (
              <Text
                style={{
                  color: focused ? color : '#dc35457e',
                  fontSize: 10,
                }}>
                Emergency
              </Text>
            ),
          }}
        />
        <TechnicianTab.Screen
          name="MenuTab"
          component={MenuRoot}
          options={{
            headerShown: false,
            title: 'Menu',
            tabBarIcon: ({color}) => <MenuTabIco fill={color} />,
            tabBarButton: props => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            ),
          }}
        />
      </TechnicianTab.Navigator>
    </>
  );
};

export const styles = StyleSheet.create({
  qr: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    top: 10,
    marginHorizontal: 5,
    width: 65,
    height: 65,
    backgroundColor: colors.mainActiveColor,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.53,
    shadowRadius: 2.62,
    elevation: 4,
  },
  smallQr: {
    top: -2,
    width: 53,
    height: 53,
    borderRadius: 16,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginVertical: 30,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 1,
    gap: 8,
  },
  buttonActive: {
    borderWidth: 1,
    marginHorizontal: 0,
    backgroundColor: '#1b6bc02a',
    borderRadius: 12,
    borderStyle: 'solid',
    borderColor: colors.mainActiveColor,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
  },
});
