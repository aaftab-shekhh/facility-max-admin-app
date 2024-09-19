import {instance} from './instances';

export const notificationsAPI = {
  getNotifications(params: any) {
    return instance.get('notifications/my', {params});
  },
  getNotificationsCount() {
    return instance.get('notifications/count');
  },
  readAll() {
    return instance.patch('/notifications/read-all');
  },
  toggleOne(id: string) {
    return instance.patch(`/notifications/toggle-viewed/${id}`);
  },
  deleteNotification(id: string) {
    return instance.delete(`notifications/${id}`);
  },
  enable(body: {deviceType: string; token: string}) {
    return instance.post('notifications/enable', body);
  },
  disable(params: {deviceType: string}) {
    return instance.delete('notifications/disable/', {params});
  },
};
