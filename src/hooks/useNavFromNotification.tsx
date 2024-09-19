import {NotificationGroup} from '../enums/notifications';
import {UserRole} from '../enums/user';
import {useAppNavigation} from './hooks';

const screensConfig: {[key: string]: string} = {
  [NotificationGroup.WORK_ORDERS]: 'WorkOrder',
  [NotificationGroup.ASSET]: 'Asset',
  [NotificationGroup.BUILDINGS]: 'Building',
  [NotificationGroup.EMERGENCY]: 'WorkOrder',
};

export const useNavFromNotification = () => {
  const navigation = useAppNavigation();

  const navTo = (data: any) => {
    screensConfig[data.group]
      ? navigation.navigate('Main', {
          screen: UserRole.TECHNICIAN,
          params: {
            screen: 'MenuTab',
            params: {
              screen: screensConfig[data.group],
              params: {id: data?.objectLink || data?.link},
            },
          },
        })
      : navigation.navigate('Main', {
          screen: UserRole.TECHNICIAN,
          params: {
            screen: 'MenuTab',
            params: {
              screen: 'Notifications',
            },
          },
        });
  };

  return {navTo};
};
