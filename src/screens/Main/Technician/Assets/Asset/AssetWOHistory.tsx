import {useCallback, useEffect, useState} from 'react';
import {OrderType} from '../../../../../types/StateType';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {useAppSelector} from '../../../../../hooks/hooks';
import {PMCard} from '../../WorkOrders/WO/PMCard/PMCard';
import {WorkOrderCard} from '../../WorkOrders/WO/WorkOrderCard/WorcOrderCard';
import {NotFound} from '../../../../../components/NotFound';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {woAPI} from '../../../../../api/woApi';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';
import {useOrientation} from '../../../../../hooks/useOrientation';

const limit = 10;

export const AssetWOHistory = () => {
  const {isConnected} = useNetInfo();
  const {getLocalWOByAssetId} = useLocalStateSelector();
  const {numColumn, onLayout} = useOrientation();

  const {id} = useAppSelector(state => state.assets.asset);

  const [isHeaderLoading, setIsHeaderLoading] = useState(false);

  const [data, setData] = useState<OrderType[]>([]);

  const renderItem: ListRenderItem<OrderType> = useCallback(({item}) => {
    return item.type === 'Preventive Maintenance' ? (
      <View style={{flex: 1 / numColumn}}>
        <PMCard order={item} numColumn={numColumn} />
      </View>
    ) : (
      <View style={{flex: 1 / numColumn}}>
        <WorkOrderCard order={item} numColumn={numColumn} />
      </View>
    );
  }, []);

  const getData = async () => {
    if (isHeaderLoading) {
      return;
    }
    setIsHeaderLoading(true);
    try {
      isConnected
        ? (async () =>
            setData(
              (await woAPI.getWorkOrders({assetId: [id], offset: 0, limit}))
                .data.rows,
            ))()
        : (() => {
            setData(getLocalWOByAssetId(id));
          })();
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsHeaderLoading(false);
    }
  };

  const loadData = useCallback(async () => {
    if (isHeaderLoading) {
      return;
    }
    try {
      const res = await woAPI.getWorkOrders({
        assetId: [id],
        offset: data.length,
        limit,
      });
      setData(prev => [...prev, ...res.data.rows]);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
    }
  }, [data]);

  useEffect(() => {
    if (!isConnected) {
      getData();
    }
  }, [isConnected]);

  return (
    <FlatList
      key={numColumn}
      numColumns={numColumn}
      columnWrapperStyle={numColumn !== 1 && {gap: 10}}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}
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
      onEndReachedThreshold={10}
      contentContainerStyle={styles.flatList}
      ListEmptyComponent={() => {
        return <NotFound title="There are currently no work orders." />;
      }}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 1,
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
