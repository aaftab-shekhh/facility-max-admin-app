import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {useCallback, useState} from 'react';
import {OrderType} from '../../../../../types/StateType';
import {WorkOrderCard} from '../../WorkOrders/WO/WorkOrderCard/WorcOrderCard';
import {PMCard} from '../../WorkOrders/WO/PMCard/PMCard';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {colors} from '../../../../../styles/colors';
import {useAppSelector} from '../../../../../hooks/hooks';
import {NotFound} from '../../../../../components/NotFound';
import {woAPI} from '../../../../../api/woApi';

const limit = 10;

export const BuildingWO = () => {
  const {id} = useAppSelector(state => state.buildings.building);

  const [isHeaderLoading, setIsHeaderLoading] = useState(false);

  const [data, setData] = useState<OrderType[]>([]);

  const renderItem: ListRenderItem<OrderType> = useCallback(({item}) => {
    return item.type === 'Preventive Maintenance' ? (
      <PMCard order={item} />
    ) : (
      <WorkOrderCard order={item} />
    );
  }, []);

  const getData = useCallback(async () => {
    setIsHeaderLoading(true);
    try {
      const res = await woAPI.getWorkOrders({buildingId: id, offset: 0, limit});
      setData(res.data.rows);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsHeaderLoading(false);
    }
  }, [data]);

  const loadData = useCallback(async () => {
    try {
      const res = await woAPI.getWorkOrders({
        buildingId: id,
        offset: data.length,
        limit,
      });
      setData(prev => [...prev, ...res.data.rows]);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
    }
  }, [data]);

  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl
          refreshing={isHeaderLoading}
          onRefresh={getData}
          colors={[colors.mainActiveColor]} // for android
          tintColor={colors.mainActiveColor} // for ios
        />
      }
      renderItem={renderItem}
      onEndReached={loadData}
      onEndReachedThreshold={0}
      style={styles.flatListContainer}
      contentContainerStyle={styles.flatList}
      ListEmptyComponent={() => {
        return <NotFound title="There are currently no work orders." />;
      }}
    />
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
  },
  flatList: {
    flexGrow: 1,
    gap: 10,
    paddingVertical: 10,
  },
});
