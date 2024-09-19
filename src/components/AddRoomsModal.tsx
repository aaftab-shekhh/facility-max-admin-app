import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ListRenderItem,
  Pressable,
} from 'react-native';
import {FC, memo, useEffect, useState} from 'react';
import {colors} from '../styles/colors';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../hooks/useLocalStateSelector';
import {BuildingType, FloorType, RoomType} from '../types/StateType';
import {ArrowUpIcon} from '../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../assets/icons/ArrowDownIcon';
import {sortedBy} from '../utils/sorted';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {stylesModal} from '../styles/styles';
import {buildingsAPI} from '../api/buildingsApi';

type AddRoomsModalProps = {
  buildingId: string;
  values: RoomType[];
  onChange: (assets: RoomType[]) => void;
  toggleModal: () => void;
  maxCount?: number;
  currentCount: number;
};

type BuildingProps = {
  assetId?: string;
  building: BuildingType;
  selectedRooms: RoomType[];
  addRoom: (room: RoomType) => void;
  deleteRoom: (id: string) => void;
  maxCount?: number;
  currentCount: number;
};

type FloorProps = {
  floor: FloorType;
  selectedRooms: RoomType[];
  addRoom: (asset: RoomType) => void;
  deleteRoom: (id: string) => void;
  maxCount?: number;
  currentCount: number;
};

const Floor: FC<FloorProps> = ({
  floor,
  selectedRooms,
  addRoom,
  deleteRoom,
  maxCount,
  currentCount,
}) => {
  const {isConnected} = useNetInfo();

  const {name} = floor;

  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderItem: ListRenderItem<RoomType> = ({item}) => {
    const itemIsChecked = selectedRooms.some(el => el?.id === item.id);

    return (
      <View key={item.id} style={[styles.item]}>
        <View style={[styles.item, {marginVertical: 0}]}>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
        <BouncyCheckbox
          size={20}
          style={styles.checkbox}
          fillColor={colors.borderAssetColor}
          innerIconStyle={styles.borderRadius}
          iconStyle={styles.borderRadius}
          textStyle={styles.checkboxText}
          text={''}
          disabled={
            !itemIsChecked &&
            !!maxCount &&
            maxCount <= currentCount + selectedRooms.length
          }
          isChecked={
            selectedRooms.length > 0 &&
            selectedRooms.some(el => el?.id === item.id)
          }
          onPress={(isChecked: boolean) => {
            isChecked ? addRoom(item) : deleteRoom(item.id);
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    if (isOpen) {
      isConnected &&
        (async () => {
          const res = await buildingsAPI.getRoomsByEntity({
            floorIdes: [floor.id],
            sortField: 'name',
            sortDirection: 'ASC',
            size: 1000,
            page: 1,
          });
          setRooms(res.data.rows);
        })();
    }
  }, [isOpen, isConnected]);

  return (
    <>
      <Pressable style={styles.item} onPress={toggleIsOpen}>
        <View style={styles.row}>
          <Text style={styles.itemText}>{name}</Text>
        </View>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </Pressable>
      {isOpen && (
        <FlatList
          data={sortedBy('name', rooms)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.flatList, {maxHeight: undefined}]}
        />
      )}
    </>
  );
};

const Building: FC<BuildingProps> = memo(
  ({building, addRoom, deleteRoom, selectedRooms, maxCount, currentCount}) => {
    const {isConnected} = useNetInfo();
    const {getLocalFloors} = useLocalStateSelector();
    const {id, name} = building;

    const [isOpen, setIsOpen] = useState(false);
    const [floors, setFloors] = useState<FloorType[]>([]);

    const toggleIsOpen = () => {
      setIsOpen(!isOpen);
    };

    const renderItem: ListRenderItem<FloorType> = ({item}) => {
      return (
        <Floor
          floor={item}
          addRoom={addRoom}
          selectedRooms={selectedRooms}
          deleteRoom={deleteRoom}
          maxCount={maxCount}
          currentCount={currentCount}
        />
      );
    };

    useEffect(() => {
      if (isOpen) {
        isConnected
          ? (async () => {
              const res = await buildingsAPI.getFloorsByBuildingId({
                sortField: 'name',
                sortDirection: 'ASC',
                size: 1000,
                page: 1,
                buildingId: id,
              });
              setFloors(res.data.rows);
            })()
          : setFloors(getLocalFloors({buildingId: id}).payload);
      }
    }, [isOpen]);

    return (
      <>
        <Pressable style={styles.item} onPress={toggleIsOpen}>
          <View style={[styles.row, {position: 'relative'}]}>
            {/* <FastImage
              source={file ? {uri: file.url} : dropdownIcons[name]}
              style={[styles.icon, color && {backgroundColor: color}]}
              defaultSource={dropdownIcons[name]}
            /> */}
            <Text style={styles.itemText}>{name}</Text>
          </View>
          {/* {assetsCount !== 0 && ( */}
          <>{isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</>
          {/* )} */}
        </Pressable>
        {isOpen && (
          <FlatList
            data={sortedBy('name', floors)}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            style={[styles.flatList, {maxHeight: undefined}]}
          />
        )}
      </>
    );
  },
);

export const AddRoomsModal: FC<AddRoomsModalProps> = ({
  buildingId,
  onChange,
  toggleModal,
  values,
  maxCount,
  currentCount,
}) => {
  const {isConnected} = useNetInfo();

  const {getLocalBuilding} = useLocalStateSelector();

  const [selectedRooms, setSelectedRooms] = useState<any[]>(
    values ? values : [],
  );

  const [building, setBuilding] = useState<BuildingType>();

  const addRoom = (room: RoomType) => {
    setSelectedRooms(prev => [...prev, room]);
  };

  const deleteRoom = (id: string) => {
    setSelectedRooms(prev => prev.filter(el => el.id !== id));
  };

  useEffect(() => {
    isConnected
      ? (async () => {
          const res = await buildingsAPI.getBuildingById({
            buildingId,
          });

          setBuilding(res.data);
        })()
      : setBuilding(getLocalBuilding(buildingId));
  }, [buildingId, isConnected]);

  useEffect(() => {
    setSelectedRooms(values);
  }, [values]);

  return (
    <>
      {building && (
        <View style={styles.flatListContainer}>
          <Building
            addRoom={addRoom}
            building={building}
            deleteRoom={deleteRoom}
            selectedRooms={selectedRooms}
            maxCount={maxCount}
            currentCount={currentCount}
          />
        </View>
      )}
      {maxCount && currentCount + selectedRooms.length >= maxCount && (
        <View style={[styles.subLabel]}>
          <View style={styles.mark}>
            <Text style={styles.markText}>!</Text>
          </View>
          <Text style={styles.labelErrorText}>You have selected 5 items</Text>
        </View>
      )}

      <Pressable
        onPress={() => {
          onChange(selectedRooms);
          toggleModal();
        }}
        style={[stylesModal.modalButton, {flex: undefined, marginTop: 10}]}>
        <Text style={stylesModal.modalButtonText}>Add</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    maxHeight: Dimensions.get('screen').height * 0.65,
  },
  flatList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textColor,
    lineHeight: 20,
  },
  assetContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 10,
    gap: 10,
  },
  checkbox: {
    marginRight: -15,
  },
  borderRadius: {
    borderRadius: 5,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },

  subLabel: {
    flexDirection: 'row',
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
  },
  labelError: {
    marginTop: 5,
  },
  labelErrorText: {
    flex: 1,
    color: colors.heighPriority,
    fontSize: 12,
    lineHeight: 18,
  },
  mark: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: colors.heighPriority,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: 5,
  },
  markText: {
    color: colors.heighPriority,
    fontSize: 10,
  },
});
