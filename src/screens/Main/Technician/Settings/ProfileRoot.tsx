import {createStackNavigator} from '@react-navigation/stack';
import {ProfileScreen} from './ProfileScreen';
import {UpdatePasswordScreen} from './UpdatePasswordScreen';
import {ArrowBackIcon} from '../../../../assets/icons/ArrowBackIcon';
import {NotificationSettings} from './NotificationSettings';
import {CreateNewPasswordScreen} from './CreateNewPasswordScreen';
import {PrivacySetting} from './PrivacySetting';
import {HeaderButtons} from '../../../../components/HeaderButtons';
import {useAppDispatch, useAppSelector} from '../../../../hooks/hooks';
import {useEffect} from 'react';
import {getUserByIdTC} from '../../../../bll/reducers/user-reducer';
import {colors} from '../../../../styles/colors';
import {SettingsParamList} from '../../../../types/NavTypes/TechnicianNavTypes';

const ProfileStack = createStackNavigator<SettingsParamList>();

export const ProfileRoot = () => {
  const dispatch = useAppDispatch();
  const {id} = useAppSelector(state => state.user.user);

  useEffect(() => {
    dispatch(getUserByIdTC({id}));
  }, []);

  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileInfo"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundMainColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        // headerShown: false,
      }}>
      <ProfileStack.Screen
        name="ProfileInfo"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerLeft: () => null,
          headerRight: () => <HeaderButtons />,
        }}
      />
      <ProfileStack.Screen
        name="PrivacySetting"
        component={PrivacySetting}
        options={{
          title: 'Edit Account Info',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <ProfileStack.Screen
        name="UpdatePassword"
        component={UpdatePasswordScreen}
        options={{
          title: 'Change Password',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <ProfileStack.Screen
        name="CreateNewPassword"
        component={CreateNewPasswordScreen}
        options={{
          title: 'Create New Password',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
      <ProfileStack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{
          title: 'Notifications',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </ProfileStack.Navigator>
  );
};
