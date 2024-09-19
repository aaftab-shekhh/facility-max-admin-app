import {useCallback, useEffect, useState} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import {NotFound} from '../../../../../components/NotFound';
import {WorkOrderCard} from '../../WorkOrders/WO/WorkOrderCard/WorcOrderCard';
import {PMCard} from '../../WorkOrders/WO/PMCard/PMCard';
import {enumTypeWO} from '../../../../../enums/workOrders';
import {OrderType} from '../../../../../types/StateType';
import {woAPI} from '../../../../../api/woApi';
import {useOrientation} from '../../../../../hooks/useOrientation';
import {useAppSelector} from '../../../../../hooks/hooks';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';

export const IncidentHistory = () => {
  const {regionId} = useAppSelector(state => state.user.user);
  const {numColumn, onLayout} = useOrientation();

  const [workOrders, setWorkOrders] = useState<OrderType[]>([]);
  const [count, setCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const getWOs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await woAPI.getWorkOrders({
        limit: 40,
        offset: 0,
        byBucket: false,
        regionId,
        types: [enumTypeWO.EMERGENCY],
      });
      setCount(res.data.count);
      setWorkOrders(res.data.rows);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadWOs = useCallback(async () => {
    if (count > workOrders.length) {
      try {
        const res = await woAPI.getWorkOrders({
          limit: 40,
          offset: workOrders.length,
          byBucket: false,
          regionId,
          types: [enumTypeWO.EMERGENCY],
        });
        setCount(res.data.count);
        setWorkOrders(prev => [...prev, ...res.data.rows]);
      } catch (err) {
        handleServerNetworkError(err.response.data);
      }
    }
  }, [workOrders]);

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
  }, []);

  return (
    <FlatList
      data={workOrders}
      key={numColumn}
      numColumns={numColumn}
      columnWrapperStyle={numColumn !== 1 && styles.gap}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      onEndReached={loadWOs}
      onEndReachedThreshold={0}
      style={styles.container}
      contentContainerStyle={styles.flatList}
      ListEmptyComponent={() => {
        return <NotFound title="There are currently no incidents" />;
      }}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  flatList: {
    flexGrow: 1,
    gap: 10,
    paddingVertical: 10,
  },
  gap: {gap: 10},
});

const incidentStyles = StyleSheet.create({
  backing: {
    backgroundColor: '#848A9B',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  container: {
    marginLeft: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    gap: 10,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#848A9B',
  },
  text: {
    flex: 1,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#202534',
  },
  incident: {
    flex: 1,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
