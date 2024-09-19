import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../styles/colors';
import {getTab} from '../../../utils/getTab';
import {UserRole} from '../../../enums/user';
import {useAppNavigation} from '../../../hooks/hooks';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {InfoIcon} from '../../../assets/icons/InfoIcon';
import {DeleteIcon} from '../../../assets/icons/DeleteIcon';
import {ModalLayout} from '../../../components/Layouts/ModalLayout';
import {stylesModal} from '../../../styles/styles';
import {MyButton} from '../../../components/MyButton';
import {FC, useCallback, useState} from 'react';
import {plansAPI} from '../../../api/plansApi';
import {
  handleServerNetworkError,
  handleServerNetworkSuccessful,
} from '../../../utils/handleServerNetworkUtils';

type RoomButtonProps = {
  room: any;
  pageId: string;
  getRooms: () => void;
};

export const RoomButton: FC<RoomButtonProps> = ({room, pageId, getRooms}) => {
  const navigation = useAppNavigation();
  const left =
    room.points.reduce((acc: number, el) => acc + el.x, 0) /
      room.points.length -
    50;
  const top =
    room.points.reduce((acc: number, el) => acc + el.y, 0) /
      room.points.length -
    7;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isModalDeleteRoom, setIsModalDeleteRoom] = useState<boolean>(false);

  const toggleDeleteRoom = () => {
    setIsModalDeleteRoom(!isModalDeleteRoom);
  };

  const deleteRoomFromPage = useCallback(async () => {
    try {
      setIsLoading(true);
      await plansAPI.deleteRoomsFromPage(pageId, room.id);
      handleServerNetworkSuccessful({
        message: 'The room details have been successfully changed',
      });
      getRooms();
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [room.id, pageId]);

  return (
    <View style={[styles.container, {left, top}]}>
      <Menu>
        <MenuTrigger>
          <View style={[styles.button]}>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              {room.name}
            </Text>
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={{optionsContainer: styles.menuOptions}}>
          <MenuOption
            customStyles={{optionWrapper: styles.optionButton}}
            onSelect={() => {
              navigation.getState().routeNames[0] === 'PDFPlan'
                ? navigation.navigate('Plan', {
                    screen: 'RoomDetailsScreen',
                    params: {roomId: room.id},
                  })
                : navigation.getState().routeNames[0] === 'Scaner'
                ? navigation.navigate('QR', {
                    screen: 'RoomDetailsScreen',
                    params: {roomId: room.id},
                  })
                : navigation.navigate('Main', {
                    screen: UserRole.TECHNICIAN,
                    params: {
                      screen: getTab(navigation.getState().routeNames[0]),
                      params: {
                        screen: 'RoomDetailsScreen',
                        params: {roomId: room.id},
                      },
                    },
                  });
            }}>
            <InfoIcon />
            <Text style={styles.buttonText}>View Room Info</Text>
          </MenuOption>
          <MenuOption
            customStyles={{optionWrapper: styles.optionButton}}
            onSelect={toggleDeleteRoom}>
            <DeleteIcon />
            <Text style={styles.buttonText}>Delete from floor plan </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
      <ModalLayout
        toggleModal={toggleDeleteRoom}
        isModalVisible={isModalDeleteRoom}
        title="Delete Room from Floor Plan">
        <View>
          <Text style={styles.modalText}>
            You are removing a room{' '}
            <Text style={styles.modalTextName}>{`${room.name}`}</Text> from the
            plan - are you sure? Its coordinates cannot be restored
          </Text>

          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <MyButton
              text="Cancel"
              action={toggleDeleteRoom}
              style="mainBorder"
            />
            <MyButton
              text="Delete"
              action={deleteRoomFromPage}
              style="remove"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        </View>
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 100,
  },
  button: {
    borderRadius: 6,
    alignItems: 'center',
    maxWidth: 100,
    padding: 5,
    backgroundColor: colors.mainActiveColor,
  },
  text: {
    color: colors.bottomActiveTextColor,
    fontWeight: '500',
    fontSize: 10,
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
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textColor,
  },
  modalContainer: {
    marginBottom: 10,
    gap: 15,
  },
  buttons: {
    position: 'relative',
    marginHorizontal: 0,
  },
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
    backgroundColor: colors.calendarBsckGround,
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
  addButton: {
    color: colors.bottomActiveTextColor,
    fontSize: 20,
    fontWeight: '600',
  },
  modalButtons: {
    position: 'relative',
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
