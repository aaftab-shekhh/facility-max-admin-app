import {FC, useEffect, useState} from 'react';
import {RoomType} from '../types/StateType';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CrossSmallIcon} from '../assets/icons/CrossSmallIcon';
import {ModalLayout} from './Layouts/ModalLayout';
import {colors} from '../styles/colors';
import {AddRoomsModal} from './AddRoomsModal';
import {MyButton} from './MyButton';
import RoomIcon from '../assets/icons/RoomIcon';

type AddRoomsProps = {
  buildingId: string;
  values: RoomType[];
  onChange: (assets: RoomType[]) => void;
  maxCount?: number;
  currentCount: number;
};

export const AddRooms: FC<AddRoomsProps> = ({
  buildingId,
  values,
  onChange,
  maxCount,
  currentCount,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [viewRooms, setViewRooms] = useState<RoomType[]>(values ? values : []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const deleteRoom = (id: string) => {
    setViewRooms(prev => prev.filter(el => el.id !== id));
  };

  useEffect(() => {
    setViewRooms(values ? values : []);
  }, [values]);

  useEffect(() => {
    onChange(viewRooms);
  }, [viewRooms]);

  return (
    <View style={{gap: 10}}>
      {viewRooms.length > 0 && (
        <>
          <Text style={styles.label}>Rooms</Text>
          <View style={styles.selectedAssetsContainer}>
            {viewRooms.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    deleteRoom(item.id);
                  }}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.textSelectedStyle}>{item.name}</Text>
                    <CrossSmallIcon />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      <MyButton
        style="primary"
        text="Add Room"
        action={toggleModal}
        leftIcon={<RoomIcon />}
      />
      <ModalLayout
        title={'Add Rooms'}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <AddRoomsModal
          buildingId={buildingId}
          values={values}
          onChange={(rooms: RoomType[]) => {
            setViewRooms(rooms);
          }}
          toggleModal={toggleModal}
          maxCount={maxCount}
          currentCount={currentCount}
        />
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: -10,
  },
  selectedAssetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.backgroundLightColor,
    padding: 10,
    borderRadius: 8,
    rowGap: 10,
    columnGap: 7,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    gap: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.mainActiveColor,
    backgroundColor: '#009ef72c',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 14,
    color: colors.mainActiveColor,
  },
  button: {
    backgroundColor: '#44B8FF1A',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.mainActiveColor,
  },
});
