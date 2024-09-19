import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../hooks/hooks';
import {MainParamList} from '../../types/NavTypes/NavigationTypes';
import {
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../styles/colors';
import {ContactsTabIcon} from '../../assets/icons/MenuIcons/ContactsTabIcon';
import {NotificationsIcon} from '../../assets/icons/MenuIcons/NotificationsIcon';
import {DashboardTabIcon} from '../../assets/icons/MenuIcons/DashboardTabIcon';
import {logoutTC} from '../../bll/reducers/app-reducer';
import {UserRole} from '../../enums/user';
import {QuitIcon} from '../../assets/icons/QuitIcon';
import {AssetsIcon} from '../../assets/icons/MenuIcons/AssetsIcon';
import {OfflineMode} from '../../components/OfflineMode';
import {ProfileIcon} from '../../assets/icons/MenuIcons/ProfileIcon';
import {BuildingIcon} from '../../assets/icons/MenuIcons/BuildingIcon';
import {useEffect} from 'react';
import {getNotificationsCountTC} from '../../bll/reducers/notifications-Reducer';
import {Badge} from '@rneui/base';
import {TechnicianRoot} from './Technician/TechnicianRoot';

const MainStack = createDrawerNavigator<MainParamList>();

function CustomDrawerContent(props: any) {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {notificationsUnreadCount} = useAppSelector(
    state => state.notifications,
  );

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.container}
      contentContainerStyle={{flex: 1}}>
      <View style={styles.subContainer}>
        <View style={styles.buttons}>
          <Text style={styles.title}>Menu</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Main', {
                screen: UserRole.TECHNICIAN,
                params: {
                  screen: 'MenuTab',
                  params: {
                    screen: 'Dashboard',
                  },
                },
              });
            }}>
            <DashboardTabIcon fill={colors.textSecondColor} />
            <Text style={styles.itemText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Main', {
                screen: UserRole.TECHNICIAN,
                params: {
                  screen: 'MenuTab',
                  params: {
                    screen: 'RootAssets',
                    params: {
                      screen: 'Assets',
                    },
                  },
                },
              });
            }}>
            <AssetsIcon fill={colors.textSecondColor} />
            <Text style={styles.itemText}>Assets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Main', {
                screen: UserRole.TECHNICIAN,
                params: {
                  screen: 'MenuTab',
                  params: {
                    screen: 'Buildings',
                    params: {
                      screen: 'Buildings',
                    },
                  },
                },
              });
            }}>
            <BuildingIcon fill={colors.textSecondColor} />
            <Text style={styles.itemText}>Buildings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Main', {
                screen: UserRole.TECHNICIAN,
                params: {
                  screen: 'MenuTab',
                  params: {
                    screen: 'Notifications',
                  },
                },
              });
            }}>
            <NotificationsIcon fill={colors.textSecondColor} />
            {notificationsUnreadCount > 0 && (
              <Badge
                badgeStyle={{backgroundColor: colors.deleteColor}}
                value={notificationsUnreadCount}
                containerStyle={{position: 'absolute', top: -5, left: 15}}
              />
            )}
            <Text style={styles.itemText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Main', {
                screen: UserRole.TECHNICIAN,
                params: {
                  screen: 'MenuTab',
                  params: {
                    screen: 'Settings',
                    params: {screen: 'ProfileInfo'},
                  },
                },
              });
            }}>
            <ProfileIcon fill={colors.textSecondColor} />
            <Text style={styles.itemText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Main', {
                screen: UserRole.TECHNICIAN,
                params: {
                  screen: 'MenuTab',
                  params: {
                    screen: 'ContactsScreen',
                    params: {screen: 'Contacts'},
                  },
                },
              });
            }}>
            <ContactsTabIcon fill={colors.textSecondColor} />
            <Text style={styles.itemText}>Contacts</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={[styles.menuItem, styles.menuQuit]}
            onPress={() => {
              dispatch(logoutTC({}));
            }}>
            <QuitIcon />
            <Text style={[styles.itemText, styles.quitText]}>Sign Out</Text>
          </TouchableOpacity>
          {__DEV__ ? <OfflineMode /> : <View style={{height: 50}} />}
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export const Main = () => {
  const dispatch = useAppDispatch();
  const {isNotificationsChange} = useAppSelector(state => state.notifications);

  useEffect(() => {
    dispatch(getNotificationsCountTC());
  }, [isNotificationsChange]);

  return (
    <MainStack.Navigator
      initialRouteName={UserRole.TECHNICIAN}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.headerColor,
        },
        drawerPosition: 'right',
        drawerType: 'front',
        freezeOnBlur: true,
        // swipeEnabled: role === UserRole.TECHNICIAN,
      }}
      drawerContent={CustomDrawerContent}>
      <MainStack.Screen
        name={UserRole.TECHNICIAN}
        component={TechnicianRoot}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttons: {
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
    color: colors.textColor,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondColor,
  },
  quitText: {
    color: colors.deleteColor,
  },
  menuQuit: {
    // alignSelf: 'flex-end',
    // marginLeft: 10,
    // marginBottom: 0,
  },
});
