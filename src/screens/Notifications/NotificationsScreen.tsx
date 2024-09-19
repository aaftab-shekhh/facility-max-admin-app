import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import {Notification} from './Notification';
import {useEffect, useRef, useState} from 'react';
import {notificationsAPI} from '../../api/notificationsApi';
import {NotFound} from '../../components/NotFound';
import {OrderType} from '../../types/StateType';
import {colors} from '../../styles/colors';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {getNotificationsCountTC} from '../../bll/reducers/notifications-Reducer';

export type NotificationType = {
  id: string;
  title: string;
  body: string;
  isViewed: boolean;
  userId: string;
  supportStickerId: string;
  workOrderId: string;
  creationDate: string;
  lastUpdateDate: string;
  supportSticker: string;
  workOrder?: OrderType;
};

const limit = 20;

export const NotificationsScreen = () => {
  const dispatch = useAppDispatch();
  const {isNotificationsChange} = useAppSelector(state => state.notifications);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  const [notifications, setNotifications] = useState<any[]>([]);

  const toggleViewed = async (id: string) => {
    try {
      await notificationsAPI.toggleOne(id);
      dispatch(getNotificationsCountTC());
      setNotifications(prev =>
        prev.map(el => (el.id === id ? {...el, isViewed: !el.isViewed} : el)),
      );
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  };

  const renderItem = ({item}: {item: NotificationType}) => {
    return (
      <Notification
        notification={item}
        toggleViewed={toggleViewed}
        deleteNotification={id => {
          setNotifications(prevState =>
            prevState.filter(notif => notif.id !== id),
          );
        }}
      />
    );
  };

  const scrollRef = useRef(null);

  const getNotifications = async () => {
    if (!isLoading) {
      try {
        setIsLoading(true);
        const res = await notificationsAPI.getNotifications({
          offset: 0,
          limit,
        });
        setNotifications(res.data.payload);
        setCount(res.data.count);
        setIsLoading(false);
      } catch (err) {
        handleServerNetworkError(err.response.data);
      }
    }
  };

  const loadNotifications = async () => {
    if (count > notifications.length) {
      const res = await notificationsAPI.getNotifications({
        offset: notifications.length,
        limit,
      });
      setNotifications(prev => [...prev, ...res.data.payload]);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [isNotificationsChange]);

  return (
    <FlatList
      ref={scrollRef}
      data={notifications}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={getNotifications}
          colors={[colors.mainActiveColor]} // for android
          tintColor={colors.mainActiveColor} // for ios
        />
      }
      onEndReached={loadNotifications}
      onEndReachedThreshold={0}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.flatList}
      ListEmptyComponent={() => {
        return <NotFound title="There are currently no notifications." />;
      }}
    />
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flexGrow: 1,
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
