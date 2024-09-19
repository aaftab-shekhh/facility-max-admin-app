import {UserRoleType} from './../types/StateType';
import {UpdateUserType} from './ApiTypes';
import {instance, instanceFile} from './instances';

export const userAPI = {
  getMe() {
    return instance.get('user/me-partial');
  },

  getUserById(params: {id: string}) {
    return instance.get('user/get-user-by-id', {params});
  },

  updateSettingNotification(body: any) {
    return instance.patch('user/notification-settings', body);
  },

  getAssignedTeams() {
    return instance.get('bucket/assigned');
  },

  getUsers(params: {
    userRole: UserRoleType;
    sortField: string;
    sortDirection: string;
    page: number;
    size: number;
    keySearchValue?: string;
    customerId: string;
  }) {
    return instance.get('user/get-users-list', {params});
  },

  updateUser(body: UpdateUserType) {
    return instance.patch('user/update-user', body);
  },

  updateAvatar(body: any) {
    return instanceFile.patch('user/upload-avatar', body);
  },
};
