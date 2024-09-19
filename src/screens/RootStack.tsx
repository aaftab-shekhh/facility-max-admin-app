import {createStackNavigator} from '@react-navigation/stack';
import {useAppDispatch, useAppNavigation, useAppSelector} from '../hooks/hooks';
import {Main} from './Main/Main';
import {AuthStack} from './Auth/AuthStack';
import {RootStackParamList} from '../types/NavTypes/NavigationTypes';
import {QRRoot} from './QR/QRRoot';
import {NotificationsScreen} from './Notifications/NotificationsScreen';
import {ArrowBackIcon} from '../assets/icons/ArrowBackIcon';
import React, {useEffect, useState} from 'react';
import {getMeTC, getUserByIdTC} from '../bll/reducers/user-reducer';
import {PlanRoot} from './Plan/PlanRoot';
import {ITokens, getTokens} from '../api/storage';
import {logoutTC} from '../bll/reducers/app-reducer';
import {Platform, StyleSheet, View} from 'react-native';
import {colors} from '../styles/colors';
import {useNetInfo} from '@react-native-community/netinfo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FocusAwareStatusBar} from '../components/FocusAwareStatusBar';
import {handleServerNetworkError} from '../utils/handleServerNetworkUtils';
import {UserRole} from '../enums/user';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../utils/toastConfig';
import {PERMISSIONS, request} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import {notificationUtil} from '../utils/notificationsUtils';
import {requestPushPermission} from '../utils/requestPushPermission';
import {useNavFromNotification} from '../hooks/useNavFromNotification';

const Stack = createStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const dispatch = useAppDispatch();
  const {isLoggedIn} = useAppSelector(state => state.app);
  const {role, id} = useAppSelector(state => state.user.user);
  const {isConnected} = useNetInfo();
  const {navTo} = useNavFromNotification();
  const insets = useSafeAreaInsets();

  const [tokens, setTokens] = useState<ITokens>();

  useEffect(() => {
    if (!tokens?.accessToken) {
      (async () => {
        const res = await getTokens();
        setTokens(res);
        !res?.accessToken && dispatch(logoutTC({}));
      })();
    }
    isConnected && tokens?.accessToken && dispatch(getMeTC({}));
    id && dispatch(getUserByIdTC({id}));
  }, [id, tokens, isConnected]);

  useEffect(() => {
    if (role && role !== UserRole.ADMIN && role !== UserRole.SUPERVISOR) {
      dispatch(logoutTC({}));
      handleServerNetworkError({
        message: 'You need to log in as a administrator or supervisor.',
        description: '',
      });
    }
  }, [role]);

  useEffect(() => {
    (async () => {
      Platform.OS === 'ios'
        ? requestPushPermission()
        : await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    })();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification) {
        notificationUtil(remoteMessage.notification);
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      navTo(remoteMessage?.data?.data);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          navTo(remoteMessage?.data?.data);
        }
      });

    return unsubscribe;
  }, []);

  return (
    <>
      {Platform.OS === 'ios' && !isConnected && (
        <View style={[styles.offlineContainer, {height: insets.top}]} />
      )}
      <FocusAwareStatusBar barStyle="dark-content" />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.backgroundMainColor,
          },
          headerShadowVisible: false,
        }}>
        {isLoggedIn && role ? (
          // Screens for logged in users
          <Stack.Group>
            <Stack.Screen
              name="Main"
              component={Main}
              options={{
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              options={{
                headerStyle: {
                  backgroundColor: colors.backgroundMainColor,
                },
                headerShown: false,
              }}
              name="QR"
              component={QRRoot}
            />
            <Stack.Screen
              options={{
                headerShown: false,
                headerBackTitleVisible: false,
                headerBackImage: () => <ArrowBackIcon />,
              }}
              name="Plan"
              component={PlanRoot}
            />
            <Stack.Screen
              options={{
                headerShown: true,
                headerBackTitleVisible: false,
                headerBackImage: () => <ArrowBackIcon />,
              }}
              name="Notifications"
              component={NotificationsScreen}
            />
          </Stack.Group>
        ) : (
          // Auth screens
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen
              name="Auth"
              component={AuthStack}
              options={{
                gestureEnabled: false,
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
      <Toast
        topOffset={insets.top}
        config={toastConfig}
        visibilityTime={4000}
        onPress={() => {
          Toast.hide();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  offlineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.deleteColor,
  },
});
