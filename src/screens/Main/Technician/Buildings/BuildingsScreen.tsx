import {useNetInfo} from '@react-native-community/netinfo';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {useAppSelector} from '../../../../hooks/hooks';
import {useCallback, useEffect, useState} from 'react';
import {useDebounce} from '../../../../hooks/useDebounce';
import {BuildingCard} from './Building/BuildingCard/BuildingCard';
import {BuildingType} from '../../../../types/StateType';
import {buildingsAPI} from '../../../../api/buildingsApi';
import {colors} from '../../../../styles/colors';
import {sortedBy} from '../../../../utils/sorted';
import {useOrientation} from '../../../../hooks/useOrientation';

type ParamsType = {
  keySearchValue?: string;
  customerId: string;
  size: number;
  page: number;
  sortField: string;
  sortDirection: string;
};
const size = 40;

export const BuildingsScreen = () => {
  const {isConnected} = useNetInfo();
  const {customerId} = useAppSelector(state => state.user.user);

  const localbuildings = useAppSelector(state => state.local.db.building);

  const netBuildings = useAppSelector(state => state.buildings.buildings);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);

  const {numColumn, onLayout} = useOrientation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  isConnected ? netBuildings : Object.values(localbuildings || {});

  const [keyWord, setKeyWord] = useState<string>('');

  const debouncedKeyWord = useDebounce(keyWord, 400);

  const renderBuilding: ListRenderItem<BuildingType> = useCallback(
    ({item}) => {
      return (
        <View style={{flex: 1 / numColumn}}>
          <BuildingCard building={item} numColumn={numColumn} />
        </View>
      );
    },
    [numColumn],
  );

  const getBuildings = async () => {
    if (isLoading || !isConnected) {
      return;
    }

    setIsLoading(true);

    const params: ParamsType = {
      customerId,
      size,
      page: 1,
      sortField: 'name',
      sortDirection: 'ASC',
    };

    if (debouncedKeyWord && debouncedKeyWord !== '') {
      params.keySearchValue = debouncedKeyWord;
    }

    const res = await buildingsAPI.getBuildingsList(params);
    setBuildings(res.data.rows);
    setCount(res.data.count);
    setPage(prev => (prev += 1));
    setIsLoading(false);
  };

  const loadBuildings = async () => {
    if (isLoading || !isConnected) {
      return;
    }

    if (buildings.length < count) {
      setIsLoading(true);

      const params: ParamsType = {
        customerId,
        size,
        page,
        sortField: 'name',
        sortDirection: 'ASC',
      };

      if (debouncedKeyWord && debouncedKeyWord !== '') {
        params.keySearchValue = debouncedKeyWord;
      }

      const res = await buildingsAPI.getBuildingsList(params);
      setBuildings(prev => [...prev, ...res.data.rows]);
      setPage(prev => (prev += 1));
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    setIsRefresh(true);
    setPage(1);
    await getBuildings();
    setIsRefresh(false);
  };

  useEffect(() => {
    if (isConnected) {
      getBuildings();
    } else {
      setBuildings(sortedBy('name', Object.values(localbuildings || {})));
    }
  }, [debouncedKeyWord, isConnected]);

  return (
    <>
      <FlatList
        key={numColumn}
        onLayout={event => {
          onLayout(event.nativeEvent.layout.width);
        }}
        horizontal={false}
        numColumns={numColumn}
        columnWrapperStyle={
          numColumn !== 1 && {
            gap: 10,
          }
        }
        data={buildings}
        contentContainerStyle={styles.flatList}
        keyExtractor={item => item.id}
        renderItem={renderBuilding}
        onEndReached={loadBuildings}
        onEndReachedThreshold={0}
        refreshControl={
          <RefreshControl
            refreshing={isRefresh}
            onRefresh={refresh}
            colors={[colors.mainActiveColor]} // for android
            tintColor={colors.mainActiveColor} // for ios
          />
        }
        ListFooterComponent={() =>
          isLoading && <ActivityIndicator color={colors.mainActiveColor} />
        }
      />
    </>
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
