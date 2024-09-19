import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {FC, memo, useCallback, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {
  deleteAffectedAreaTC,
  getAffectedAreasTC,
} from '../../../../../bll/reducers/createNewEmergencyPlan';
import {AffectedAreaType} from '../../../../../types/EmergencyTypes';
import {ActionsButtons} from './ActionsButtons';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import {AddAffectedArea} from './AddAffectedArea';
import {CrossIcon} from '../../../../../assets/icons/CrossIcon';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {InfoItem} from '../../../../../components/InfoItem';
import {arrayToString} from '../../../../../utils/arrayToString';
import Toast from 'react-native-toast-message';

type BuildingItemProps = {
  emergencyPlanId: string;
  affectedArea: AffectedAreaType;
};

const BuildingItem: FC<BuildingItemProps> = memo(
  ({affectedArea, emergencyPlanId}) => {
    const dispatch = useAppDispatch();
    const [affectedFloors, setAffectedFloors] = useState<any>([]);
    const [affectedRooms, setAffectedRoom] = useState<any>([]);
    const [affectedAssets, setAffectedAssets] = useState<any>([]);

    // const {buildings} = useAppSelector(state => state.buildings);
    // const {customerId} = useAppSelector(state => state.user.user);

    useEffect(() => {
      (async () => {
        const res = await emergencyAPI.getAffectedArea({id: affectedArea.id});
        setAffectedFloors(res.data.floors);
        setAffectedRoom(res.data.rooms);
        setAffectedAssets(res.data.assets);
      })();
    }, []);
    // const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>(
    //   affectedArea.building?.id,
    // );

    // const [selectedFloors, setSelectedFloors] = useState<string[] | undefined>(
    //   affectedArea.floors?.length !== 0
    //     ? affectedArea.floors?.map(floor => floor.floor.id)
    //     : undefined,
    // );

    // const [selectedRooms, setSelectedRooms] = useState<string[] | undefined>(
    //   affectedArea.rooms?.length !== 0
    //     ? affectedArea.rooms?.map(room => room.room.id)
    //     : undefined,
    // );

    // const building = buildings.find(build => build.id === selectedBuilding);
    // const floors = building?.floors;
    // const rooms = getRoomsByFloorsId(building, selectedFloors);
    // const selectedFloorsById = getselectedFloorsById(building, selectedFloors);

    // const onChangeBuilding = (item: BuildingType) => {
    //   setSelectedBuilding(item.id);
    //   dispatch(
    //     createOrUpdateAffectedAreaTC({
    //       id: affectedArea.id,
    //       buildingId: item.id,
    //       emergencyPlanId,
    //     }),
    //   );
    // };

    // const onChangeFloors = (items: string[]) => {
    //   setSelectedFloors(items);

    //   const floorsForCreate = items.filter(
    //     id => !affectedArea.floors?.some(f => id === f.floor.id),
    //   );

    //   const floorsForDelete = affectedArea.floors
    //     ?.filter(floor => !items.some(i => i === floor.floor.id))
    //     .map(floor => floor.floor.id);

    //   floorsForCreate?.forEach(floorId => {
    //     dispatch(
    //       affectedAreaAddFloorTC({
    //         affectedAreaId: affectedArea.id,
    //         floorId,
    //       }),
    //     );
    //   });

    //   floorsForDelete?.forEach(floorId => {
    //     dispatch(
    //       affectedAreaDetachFloorTC({
    //         affectedAreaId: affectedArea.id,
    //         floorId,
    //       }),
    //     );
    //   });
    // };

    // const onChangeRooms = (items: string[]) => {
    //   setSelectedRooms(items);

    //   const roomsForCreate = items.filter(
    //     id => !affectedArea.rooms?.some(r => id === r.room.id),
    //   );

    //   const roomsForDelete = affectedArea.rooms
    //     ?.filter(room => !items.some(i => i === room.room.id))
    //     .map(room => room.room.id);

    //   roomsForCreate?.forEach(roomId => {
    //     dispatch(
    //       affectedAreaAddRoomTC({
    //         affectedAreaId: affectedArea.id,
    //         roomId,
    //       }),
    //     );
    //   });

    //   roomsForDelete?.forEach(roomId => {
    //     dispatch(
    //       affectedAreaDetachRoomTC({
    //         affectedAreaId: affectedArea.id,
    //         roomId,
    //       }),
    //     );
    //   });
    // };

    // useEffect(() => {
    //   if (selectedRooms) {
    //     setSelectedRooms(prev => {
    //       let roomArr: string[] = [];

    //       for (let el of prev) {
    //         selectedFloorsById?.forEach(floor => {
    //           if (floor.rooms.some(room => room.id === el)) {
    //             roomArr.push(el);
    //           }
    //         });
    //       }
    //       return roomArr;
    //     });
    //   }
    // }, [selectedFloors]);

    // useEffect(() => {
    //   dispatch(
    //     getBuildingsListTC({
    //       customerId,
    //       page: 1,
    //       size: 10,
    //       sortField: 'id',
    //       sortDirection: 'ASC',
    //       value: '',
    //     }),
    //   );
    // }, []);
    const deleteAffectedArea = () => {
      dispatch(deleteAffectedAreaTC({id: affectedArea.id, emergencyPlanId}));
    };
    return (
      <View style={stylesItem.container}>
        <View
          style={[
            stylesItem.head,
            !!affectedFloors.length && stylesItem.openedHeader,
          ]}>
          <Text style={stylesItem.headText}>{affectedArea.building.name}</Text>
          <Pressable
            style={stylesItem.headCross}
            hitSlop={15}
            onPress={deleteAffectedArea}>
            <CrossIcon color={colors.textSecondColor} />
          </Pressable>
        </View>
        <View style={{paddingHorizontal: 16}}>
          {!!affectedFloors.length && (
            <InfoItem
              title="Floor"
              text={arrayToString(affectedFloors.map(el => el.floor.name))}
              hiddeBorder={!affectedRooms.length && !affectedAssets.length}
            />
          )}
          {!!affectedRooms.length && (
            <InfoItem
              title="Office"
              text={arrayToString(affectedRooms.map(el => el.room.name))}
              hiddeBorder={!affectedAssets.length}
            />
          )}
          {!!affectedAssets.length && (
            <InfoItem
              title="Asset"
              text={arrayToString(affectedAssets.map(el => el.asset.name))}
              hiddeBorder
            />
          )}
        </View>
      </View>
    );
  },
);

const stylesItem = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.backgroundLightColor,
  },

  head: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundGreyColor,
  },

  openedHeader: {
    borderBottomStartRadius: 0,
    borderBottomRightRadius: 0,
  },

  headText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17,
  },
  headCross: {
    // marginHorizontal: 5,
  },
});

export const CreateEmergencyStep3 = ({navigation}: any) => {
  const dispatch = useAppDispatch();

  const {id, currentLevel} = useAppSelector(
    state => state.createNewEmergencyPlan.newEmergencyPlan,
  );
  const {affectedAreas} = useAppSelector(state => state.createNewEmergencyPlan);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = useCallback(() => {
    setIsModalVisible(!isModalVisible);
  }, [isModalVisible]);

  useEffect(() => {
    dispatch(getAffectedAreasTC({emergencyPlanId: id}));
  }, []);

  useEffect(() => {
    if (!currentLevel) {
      navigation.navigate('CreateEmergencyStep1');
    }
    if (currentLevel === 1) {
      navigation.navigate('CreateEmergencyStep2');
    }
    if (currentLevel === 3) {
      navigation.navigate('CreateEmergencyStep4');
    }
  }, [currentLevel]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 3. Assign Affected Assets and Areas</Text>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Text style={styles.headTitle}>Affected area</Text>
          <Pressable hitSlop={15} onPress={toggleModal}>
            <Text style={styles.headButtonText}>+ Add Building</Text>
          </Pressable>
        </View>
        <View style={{gap: 10}}>
          {affectedAreas &&
            affectedAreas.map(affectedArea => {
              return (
                <BuildingItem
                  key={affectedArea.id}
                  emergencyPlanId={id}
                  affectedArea={affectedArea}
                />
              );
            })}
        </View>
        <ModalLayout
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          title="Add Affected Area">
          <AddAffectedArea emergencyPlanId={id} toggleModal={toggleModal} />
        </ModalLayout>
      </ScrollView>
      <ActionsButtons
        disabled={!affectedAreas.length}
        showMessage={() => {
          Toast.show({
            type: 'info',
            text1: 'Info!',
            text2: 'It is necessary to add at least one affected area',
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: colors.textColor,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    marginVertical: 10,
    paddingHorizontal: 15,
  },

  body: {
    paddingHorizontal: 15,
    paddingBottom: 60,
  },

  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },

  headTitle: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  headButtonText: {
    color: colors.mainActiveColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },

  previous: {
    backgroundColor: colors.textSecondColor,
    borderColor: colors.textSecondColor,
  },
});
