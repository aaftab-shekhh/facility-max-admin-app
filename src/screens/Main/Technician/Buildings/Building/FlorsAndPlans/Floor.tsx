import {FC, memo, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {Room} from './Room';
import {FloorType, PlanType, RoomType} from '../../../../../../types/StateType';
import {PlanInTable} from './PlanInTable';
import {buildingsAPI} from '../../../../../../api/buildingsApi';
import {sortedBy} from '../../../../../../utils/sorted';
import {useNetInfo} from '@react-native-community/netinfo';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {stylesModal} from '../../../../../../styles/styles';
import {InputItem} from '../../../../../../components/InputItam';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {FloorHeader} from './FloorHeader';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {AddFile} from '../../../../../../components/AddFile';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {convertToBlob} from '../../../../../../utils/convertToBlob';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {MyButton} from '../../../../../../components/MyButton';

type FloorProps = {
  floor: FloorType;
  onChangeEdit: () => void;
};

type RoomsUIProps = {
  rooms: RoomType[];
  getRooms: () => void;
};

type PlansUIProps = {
  plans: PlanType[];
  onChangeEdit: () => void;
};

const RoomsUI: FC<RoomsUIProps> = memo(({rooms, getRooms}) => {
  return (
    <>
      <Text style={[styles.subTitle]}>Rooms ({rooms.length})</Text>
      <FlatList
        style={[styles.flatListContainer]}
        contentContainerStyle={[styles.flatList]}
        data={rooms}
        // ListHeaderComponent={() => <Text style={styles.subTitle}>Rooms</Text>}
        renderItem={({item}) => (
          <Room key={item.id} room={item} getRooms={getRooms} />
        )}
      />
    </>
  );
});

const PlansUI: FC<PlansUIProps> = memo(({plans, onChangeEdit}) => {
  return (
    <>
      <Text style={styles.subTitle}>Plans ({plans.length})</Text>
      <FlatList
        data={plans}
        style={[styles.flatListContainer]}
        contentContainerStyle={[styles.flatList]}
        renderItem={({item}) => (
          <PlanInTable plan={item} onChangeEdit={onChangeEdit} />
        )}
      />
    </>
  );
});

export const Floor: FC<FloorProps> = memo(({floor, onChangeEdit}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {isConnected} = useNetInfo();
  const {plan, room} = useAppSelector(state => state.local.db);

  const [rooms, setRooms] = useState<any>([]);
  const [isModalAddRoom, setIsModalAddRoom] = useState<boolean>(false);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAddRoom = () => {
    setIsModalAddRoom(!isModalAddRoom);
  };

  const getRooms = useCallback(async () => {
    const res = await buildingsAPI.getRoomsByEntity({
      floorIdes: [floor.id],
      sortField: 'name',
      sortDirection: 'ASC',
      size: 1000,
      page: 1,
    });
    setRooms(res.data.rows);
  }, [floor.id]);

  const initialValues = {name: '', floorId: floor.id, isAmenity: false} as {
    name: string;
    descriptions: string;
    floorId: string;
    isAmenity: boolean;
  };

  const addRoom = useCallback(
    async (val: any) => {
      try {
        setIsLoading(true);
        const res = await buildingsAPI.addRoom(val);

        if (files.length) {
          const fd = new FormData();
          fd.append('roomId', res.data.id);
          files.forEach(file => {
            fd.append('files[]', convertToBlob(file));
          });

          await buildingsAPI.addRoomFile(fd);
        }
        toggleAddRoom();
        getRooms();
        setValues(initialValues);
        setFiles([]);
      } catch (err) {
        handleServerNetworkError(err?.response?.data);
      } finally {
        setIsLoading(false);
      }
    },
    [files],
  );

  const {
    errors,
    handleChange,
    handleBlur,
    setValues,
    setFieldValue,
    handleSubmit,
    values,
    submitCount,
  } = useFormik({
    initialValues,
    validationSchema: yup.object().shape({
      name: yup.string().required('This value can not be blank'),
      descriptions: yup.string(),
      isAmenity: yup.boolean(),
    }),
    onSubmit: val => addRoom(val),
    validateOnBlur: true,
  });

  const plans =
    !isConnected && plan
      ? Object.values(plan).filter(el => el.floorId === floor.id)
      : floor.floorPlans;

  useEffect(() => {
    if (isOpen) {
      !isConnected && room
        ? setRooms(Object.values(room).filter(el => el.floorId === floor.id))
        : getRooms();
    }
  }, [isOpen]);

  return (
    <View style={[styles.section, isOpen && {paddingBottom: 10}]}>
      <FloorHeader
        discriptions={floor.descriptions}
        floorId={floor.id}
        floorName={floor.name}
        isOpen={isOpen}
        setIsOpen={value => setIsOpen(value)}
      />

      {isOpen ? (
        <>
          {rooms?.length > 0 && (
            <RoomsUI rooms={sortedBy('name', rooms)} getRooms={getRooms} />
          )}
          <TouchableOpacity onPress={toggleAddRoom} style={styles.addButton}>
            <Text style={styles.buttonText}>+ Add Room</Text>
          </TouchableOpacity>
          {plans?.length > 0 && (
            <PlansUI
              plans={sortedBy('name', plans)}
              onChangeEdit={onChangeEdit}
            />
          )}
        </>
      ) : null}
      <ModalLayout
        toggleModal={toggleAddRoom}
        isModalVisible={isModalAddRoom}
        title="Room/Office Details">
        <>
          <ScrollView contentContainerStyle={styles.gap}>
            <InputItem
              label="Name"
              defaultValue={values.name}
              handleChange={handleChange('name')}
              error={errors.name}
              touched={submitCount > 0}
              handleBlur={handleBlur('name')}
            />
            <InputItem
              multiline
              label="Descriptions"
              defaultValue={values.descriptions}
              handleChange={handleChange('descriptions')}
              error={errors.descriptions}
              touched={submitCount > 0}
              handleBlur={handleBlur('descriptions')}
            />
            <BouncyCheckbox
              size={20}
              style={styles.checkbox}
              fillColor={colors.mainActiveColor}
              innerIconStyle={styles.borderRadius}
              iconStyle={styles.borderRadius}
              textStyle={styles.checkboxText}
              text="Is Amenity"
              isChecked={values.isAmenity}
              onPress={(isChecked: boolean) => {
                setFieldValue('isAmenity', isChecked);
              }}
            />
            <AddFile onChange={setFiles} />
          </ScrollView>
          <View style={[stylesModal.modalButtons, styles.buttons]}>
            <MyButton text="Cancel" action={toggleAddRoom} style="mainBorder" />
            <MyButton
              text="Save"
              action={() => handleSubmit()}
              style="main"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        </>
      </ModalLayout>
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    gap: 10,
  },

  flatListContainer: {
    backgroundColor: '#F7F7F7',
    paddingVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    gap: 8,
  },

  flatList: {
    marginBottom: 10,
  },

  gap: {
    gap: 10,
    paddingBottom: 20,
  },

  subTitle: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginHorizontal: 20,
  },

  checkbox: {
    marginTop: 20,
  },

  borderRadius: {
    borderRadius: 3,
  },

  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },

  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.secondButtonColor,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  buttonText: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.mainActiveColor,
  },

  buttons: {
    position: 'relative',
    marginHorizontal: 0,
  },
});
