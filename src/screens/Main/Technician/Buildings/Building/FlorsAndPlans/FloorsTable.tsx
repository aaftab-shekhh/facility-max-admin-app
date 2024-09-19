import {FlatList, StyleSheet, View} from 'react-native';
import {Floor} from './Floor';
import {FC, memo, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {NotFound} from '../../../../../../components/NotFound';
import {
  getFloorsTC,
  setFloors,
} from '../../../../../../bll/reducers/buildings-reducer';
import {sortedBy} from '../../../../../../utils/sorted';
import {useNetInfo} from '@react-native-community/netinfo';

type FloorsTableUIProps = {
  floors: any;
  onChangeEdit?: () => void;
};

const FloorsTableUI: FC<FloorsTableUIProps> = memo(({floors, onChangeEdit}) => {
  return (
    <FlatList
      contentContainerStyle={styles.flatList}
      data={sortedBy('name', floors)}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => (
        <Floor
          floor={item}
          onChangeEdit={() => onChangeEdit && onChangeEdit()}
        />
      )}
    />
  );
});

export const FloorsTable = memo(() => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();

  const {building, floors} = useAppSelector(state => state.buildings);
  const {floor} = useAppSelector(state => state.local.db);

  const getFloors = async () => {
    !isConnected && floor
      ? dispatch(
          setFloors(
            Object.values(floor).filter(el => el.buildingId === building.id),
          ),
        )
      : dispatch(
          getFloorsTC({
            buildingId: building.id,
            sortField: 'id',
            sortDirection: 'ASC',
            size: 100,
            page: 1,
            value: '',
          }),
        );
  };

  useEffect(() => {
    getFloors();
  }, [isConnected, floor]);

  return (
    <View style={styles.container}>
      {floors?.length > 0 ? (
        <>
          <FloorsTableUI
            floors={sortedBy('name', floors)}
            onChangeEdit={getFloors}
          />
        </>
      ) : (
        <NotFound title="Floors not found" />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatList: {
    gap: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
  },

  separator: {
    height: 10,
  },
});
