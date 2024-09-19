import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {FC, memo, useCallback, useEffect, useState} from 'react';
import {colors} from '../../../../styles/colors';
import {NotFound} from '../../../../components/NotFound';
import {OrderType} from '../../../../types/StateType';
import {woAPI} from '../../../../api/woApi';
import {handleServerNetworkError} from '../../../../utils/handleServerNetworkUtils';
import {useAppSelector} from '../../../../hooks/hooks';
import {PMCard} from './WO/PMCard/PMCard';
import {WorkOrderCard} from './WO/WorkOrderCard/WorcOrderCard';
import {enumTypeWO} from '../../../../enums/workOrders';
import {useOrientation} from '../../../../hooks/useOrientation';
import {UserRole} from '../../../../enums/user';

type WorkOrdersListProps = {
  mode: string;
  previousDate: number | number[];
  paramsState?: any;
};
const limit = 10;

export const WorkOrdersList: FC<WorkOrdersListProps> = memo(
  ({mode, previousDate, paramsState}) => {
    const {role, customerId} = useAppSelector(state => state.user.user);
    const {numColumn, onLayout} = useOrientation();

    const [workOrders, setWorkOrders] = useState<OrderType[]>([]);
    const [count, setCount] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const getWOs = useCallback(async () => {
      setIsLoading(true);
      try {
        const res = await woAPI.getWorkOrdersForCalendar(
          role !== UserRole.SUPERVISOR
            ? {
                limit,
                offset: 0,
                customerId,
                isDayCalendar: true,
                ...paramsState,
              }
            : mode === 'my'
            ? {
                limit,
                offset: 0,
                byBucket: true,
                byCreator: true,
                isDayCalendar: true,
                ...paramsState,
              }
            : {
                limit,
                offset: 0,
                byBucket: true,
                isDayCalendar: true,
                ...paramsState,
              },
        );
        setCount(res.data.count);
        setWorkOrders(res.data.payload);
      } catch (err) {
        handleServerNetworkError(err.response.data);
      } finally {
        setIsLoading(false);
      }
    }, [mode, previousDate, paramsState]);

    const loadWOs = useCallback(async () => {
      if (count > workOrders.length) {
        try {
          const res = await woAPI.getWorkOrdersForCalendar(
            role === UserRole.ADMIN
              ? {
                  limit,
                  offset: workOrders.length,
                  customerId,
                  isDayCalendar: true,
                  ...paramsState,
                }
              : mode === 'my'
              ? {
                  limit,
                  offset: workOrders.length,
                  byBucket: true,
                  byCreator: true,
                  isDayCalendar: true,
                  ...paramsState,
                }
              : {
                  limit,
                  offset: workOrders.length,
                  byBucket: false,
                  isDayCalendar: true,
                  ...paramsState,
                },
          );
          setCount(res.data.count);
          setWorkOrders(prev => [...prev, ...res.data.payload]);
        } catch (err) {
          handleServerNetworkError(err.response.data);
        }
      }
    }, [mode, workOrders, paramsState]);

    const renderItem: ListRenderItem<OrderType> = useCallback(
      ({item}) => {
        return item.type === enumTypeWO.PREVENTATIVE_MAINTENANCE ? (
          <View style={{flex: 1 / numColumn}}>
            <PMCard order={item} numColumn={numColumn} />
          </View>
        ) : (
          <View style={{flex: 1 / numColumn}}>
            <WorkOrderCard
              order={item}
              refreshList={getWOs}
              numColumn={numColumn}
            />
          </View>
        );
      },
      [numColumn],
    );

    useEffect(() => {
      getWOs();
    }, [mode, paramsState]);

    return (
      <FlatList
        key={numColumn}
        numColumns={numColumn}
        columnWrapperStyle={numColumn !== 1 && styles.gap}
        onLayout={event => {
          onLayout(event.nativeEvent.layout.width);
        }}
        data={workOrders}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getWOs}
            colors={[colors.mainActiveColor]} // for android
            tintColor={colors.mainActiveColor} // for ios
          />
        }
        onEndReached={loadWOs}
        onEndReachedThreshold={0}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatList}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          return (
            <NotFound title="There are currently no work orders for the dates selected" />
          );
        }}
      />
    );
  },
);

export const styles = StyleSheet.create({
  flatList: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 60,
    paddingHorizontal: 15,
    gap: 10,
  },
  gap: {gap: 10},
});
