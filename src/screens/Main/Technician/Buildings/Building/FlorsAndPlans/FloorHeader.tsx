import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActionsMenu} from '../../../../../../components/ActionsMenu';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {DotsIcon} from '../../../../../../assets/icons/DotsIcon';
import {EditIcon} from '../../../../../../assets/icons/EditIcon';
import {DeleteIcon} from '../../../../../../assets/icons/DeleteIcon';
import {colors} from '../../../../../../styles/colors';
import {FC, useState} from 'react';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {InputItem} from '../../../../../../components/InputItam';
import {stylesModal} from '../../../../../../styles/styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {buildingsAPI} from '../../../../../../api/buildingsApi';
import {getFloorsTC} from '../../../../../../bll/reducers/buildings-reducer';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';

type FloorHeaderProps = {
  floorName: string;
  discriptions: string;
  floorId: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const FloorHeader: FC<FloorHeaderProps> = ({
  isOpen,
  setIsOpen,
  floorName,
  discriptions,
  floorId,
}) => {
  const dispatch = useAppDispatch();
  const {id: buildingId} = useAppSelector(state => state.buildings.building);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalEditFloor, setIsModalEditFloor] = useState<boolean>(false);
  const [isModalDeleteFloor, setIsModalDeleteFloor] = useState<boolean>(false);

  const toggleEditFloor = () => setIsModalEditFloor(!isModalEditFloor);
  const toggleDeleteFloor = () => setIsModalDeleteFloor(!isModalDeleteFloor);

  const editFloor = async (val: any) => {
    setIsLoading(true);
    try {
      await buildingsAPI.editFloor(val);
      toggleEditFloor();
      dispatch(
        getFloorsTC({
          buildingId,
          sortField: 'id',
          sortDirection: 'ASC',
          size: 1000,
          page: 1,
        }),
      );
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFloor = async () => {
    setIsLoading(true);
    try {
      await buildingsAPI.deleteFloor({floorId});
      toggleEditFloor();
      dispatch(
        getFloorsTC({
          buildingId,
          sortField: 'id',
          sortDirection: 'ASC',
          size: 1000,
          page: 1,
        }),
      );
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {name: floorName, discriptions, floorId} as {
    name: string;
    descriptions?: string;
    floorId: string;
  };

  const {errors, handleChange, handleBlur, handleSubmit, values, submitCount} =
    useFormik({
      initialValues,
      validationSchema: yup.object().shape({
        name: yup.string().required('This value can not be blank'),
        descriptions: yup.string(),
      }),
      onSubmit: val => editFloor(val),
      validateOnBlur: true,
    });

  const menuConfig = {
    menuButton: (
      <DotsIcon color={colors.calendarBsckGround} fill={colors.textColor} />
    ),
    items: [
      {
        icon: <EditIcon />,
        text: 'Edit',
        action: toggleEditFloor,
      },
      {
        icon: <DeleteIcon />,
        text: 'Delete',
        action: toggleDeleteFloor,
      },
    ],
  };
  return (
    <>
      <Pressable
        onPress={() => {
          setIsOpen(!isOpen);
        }}
        style={[styles.header, isOpen && styles.openHeader]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{floorName}</Text>
          <ActionsMenu menuConfig={menuConfig} />
        </View>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </Pressable>
      <ModalLayout
        toggleModal={toggleEditFloor}
        isModalVisible={isModalEditFloor}
        title="Floor Details">
        <ScrollView style={styles.gap}>
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
          <View style={[stylesModal.modalButtons, styles.buttons]}>
            <TouchableOpacity
              onPress={toggleEditFloor}
              style={[stylesModal.modalButton, stylesModal.modalButtonReset]}>
              <Text
                style={[
                  stylesModal.modalButtonText,
                  stylesModal.modalButtonTextReset,
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={stylesModal.modalButton}>
              <Text style={stylesModal.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ModalLayout>
      <ModalLayout
        toggleModal={toggleDeleteFloor}
        isModalVisible={isModalDeleteFloor}
        title="Delete Floor">
        <View>
          <Text style={styles.modalText}>
            Are you sure you want to delete floor{' '}
            <Text style={styles.modalTextName}>{`${floorName}`}</Text>?
          </Text>

          <View style={[stylesModal.modalButtons, styles.buttons]}>
            <TouchableOpacity
              onPress={deleteFloor}
              disabled={isLoading}
              style={[stylesModal.modalButton, styles.buttonDelete]}>
              {isLoading ? (
                <ActivityIndicator color={colors.bottomActiveTextColor} />
              ) : (
                <Text style={stylesModal.modalButtonText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ModalLayout>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.calendarBsckGround,
  },

  openHeader: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },

  headerContainer: {
    flexDirection: 'row',
    gap: 10,
    flex: 0.9,
  },

  headerText: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },

  gap: {gap: 10},

  buttons: {
    position: 'relative',
    marginTop: 20,
    marginHorizontal: 0,
  },

  buttonDelete: {
    backgroundColor: colors.deleteColor,
    borderColor: colors.deleteColor,
  },

  modalText: {
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 20,
  },

  modalTextName: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
});
