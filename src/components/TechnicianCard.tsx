import {FC, useMemo, useState} from 'react';
import {UserType} from '../types/StateType';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors} from '../styles/colors';
import {useAppDispatch, useAppNavigation, useAppSelector} from '../hooks/hooks';
import {getTab} from '../utils/getTab';
import {UserRole} from '../enums/user';
import {DeleteIcon} from '../assets/icons/DeleteIcon';
import {InfoItem} from './InfoItem';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {DotsIcon} from '../assets/icons/DotsIcon';
import {ClockIcon} from '../assets/icons/ClockIcon';
import {EditIcon} from '../assets/icons/EditIcon';
import {stylesModal} from '../styles/styles';
import {ModalLayout} from './Layouts/ModalLayout';
import {MyButton} from './MyButton';
import {woAPI} from '../api/woApi';
import {getWObyIdTC} from '../bll/reducers/wo-Reducer';
import {handleServerNetworkError} from '../utils/handleServerNetworkUtils';
import {LogTime} from '../screens/Main/Technician/WorkOrders/WO/InfoWO/LogTime';

type TechnicianCardProps = {
  technician: UserType;
};

export const TechnicianCard: FC<TechnicianCardProps> = ({technician}) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {id} = useAppSelector(stata => stata.wo.workOrder);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOpenLogModal, setIsOpenLogModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleLogModal = () => {
    setIsOpenLogModal(!isOpenLogModal);
  };

  const removeTechnician = async () => {
    try {
      await woAPI.deleteTechnicianFromWO({
        workOrderId: id,
        technicianId: technician.id,
      });
      dispatch(
        getWObyIdTC({
          workOrderId: id,
        }),
      );
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    }
  };

  const loggedTime = useMemo(
    () => technician.WorkOrderTechnician.hoursSpentTech,
    [technician],
  );

  const ButtonActionText = useMemo(
    () =>
      technician?.WorkOrderTechnician?.endDateTech ? 'Edit Time' : 'Log Time',
    [technician],
  );

  return (
    <TouchableOpacity
      style={[
        styles.backing,
        !loggedTime && {
          backgroundColor: colors.deleteColor,
        },
      ]}
      onPress={() => {
        navigation.navigate('Main', {
          screen: UserRole.TECHNICIAN,
          params: {
            screen: getTab(navigation.getState().routeNames[0]),
            params: {
              screen: 'ContactInfo',
              params: {userId: technician.id},
            },
          },
        });
      }}>
      <View
        style={[
          styles.container,
          !loggedTime && {
            backgroundColor: colors.deleteButtonBackground,
          },
        ]}>
        <View style={styles.head}>
          <View style={[styles.row]}>
            <FastImage
              style={styles.photo}
              source={
                technician.avatar?.url
                  ? {
                      uri: technician.avatar?.url,
                    }
                  : require('../assets/img/technical_photo.png')
              }
              defaultSource={require('../assets/img/technical_photo.png')}
            />
            <View style={[styles.row, {alignItems: 'center'}]}>
              <Text style={styles.name}>
                {technician.firstName} {technician.lastName}
              </Text>
              <Text style={styles.headText}>{technician.role}</Text>
            </View>
            <Menu>
              <MenuTrigger>
                <DotsIcon
                  color={
                    !loggedTime
                      ? colors.deleteButtonBackground
                      : colors.backgroundLightColor
                  }
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{optionsContainer: styles.menuOptions}}>
                <MenuOption
                  customStyles={{optionWrapper: styles.button}}
                  onSelect={toggleModal}>
                  <DeleteIcon />
                  <Text style={styles.buttonText}>Remove from WO</Text>
                </MenuOption>
                <MenuOption
                  customStyles={{optionWrapper: styles.button}}
                  onSelect={toggleLogModal}>
                  {loggedTime ? <EditIcon /> : <ClockIcon />}
                  <Text style={styles.buttonText}>
                    {loggedTime ? 'Edit Time' : 'Log Time'}
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.item}>
            <InfoItem
              title="Email:"
              text={technician.email}
              hiddeBorder
              column
            />
          </View>
          <View style={styles.item}>
            <InfoItem
              title="Phone:"
              text={technician.phone}
              hiddeBorder
              column
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.item}>
            <InfoItem
              title="Logged time:"
              text={`${loggedTime} h`}
              customText={
                !loggedTime ? (
                  <Text style={styles.redText}>No logged time</Text>
                ) : undefined
              }
              hiddeBorder
              column
            />
          </View>
          <View style={styles.item}>
            <InfoItem
              title="Hourly rate:"
              text={`$${
                technician.WorkOrderTechnician.additionalExpensesTech || 0
              }`}
              hiddeBorder
              column
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.item}>
            <InfoItem
              title="Estimated labor hours:"
              text={`${technician.WorkOrderTechnician.estimatedLaborHoursTech} h`}
              hiddeBorder
              column
            />
          </View>
        </View>
      </View>
      <ModalLayout
        toggleModal={toggleModal}
        isModalVisible={isModalVisible}
        title="Remove from WO">
        <View>
          {loggedTime ? (
            <Text style={styles.modalText}>
              <Text style={styles.modalTextType}>
                {technician?.firstName} {technician?.lastName}
              </Text>{' '}
              has logged{' '}
              <Text style={styles.modalTextType}>{loggedTime} hrs</Text> to this
              work order. This time will be deleted.
            </Text>
          ) : (
            <Text style={styles.modalText}>
              Are you sure you want to remove{' '}
              <Text
                style={
                  styles.modalTextType
                }>{`${technician?.firstName} ${technician?.lastName}`}</Text>{' '}
              from this Work Order?
            </Text>
          )}

          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <MyButton
              text="Remove"
              style="remove"
              action={removeTechnician}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        </View>
      </ModalLayout>
      <ModalLayout
        isModalVisible={isOpenLogModal}
        title={ButtonActionText}
        toggleModal={toggleLogModal}>
        <LogTime
          techInWO={technician}
          buttonActionText={ButtonActionText}
          isLoadingButtons={isLoading}
          toggleLogModal={toggleLogModal}
        />
      </ModalLayout>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backing: {
    flex: 1,
    backgroundColor: colors.textSecondColor,
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
    flex: 1,
    marginLeft: 4,
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 15,
    gap: 10,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopStartRadius: 4,
    borderBottomStartRadius: 4,
  },
  head: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headText: {
    flex: 1,
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  name: {
    flex: 1,
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
  },
  menuOptions: {
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  button: {
    // minWidth: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textColor,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  photo: {
    height: 45,
    width: 45,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  item: {
    flex: 1,
    marginVertical: -10,
  },
  redText: {
    color: colors.deleteColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  modalText: {
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 20,
  },
  modalButtons: {
    position: 'relative',
  },
  modalTextType: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
});
