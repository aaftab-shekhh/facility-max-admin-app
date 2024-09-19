import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RoomDetailsScreenProps} from '../../../../../../types/NavTypes/TechnicianNavTypes';
import {ScrollView} from 'react-native-gesture-handler';
import {colors} from '../../../../../../styles/colors';
import {useEffect, useMemo, useState} from 'react';

import {getRoomByIdTC} from '../../../../../../bll/reducers/rooms-reducer';
import {InfoItem} from '../../../../../../components/InfoItem';
import CheckIcon from '../../../../../../assets/icons/CheckIcon';
import {FileItem} from '../../../../../../components/FileItem';
import {MyButton} from '../../../../../../components/MyButton';
import {EditIcon} from '../../../../../../assets/icons/EditIcon';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {FileType} from '../../../../../../types/StateType';
import * as yup from 'yup';
import {buildingsAPI} from '../../../../../../api/buildingsApi';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {convertToBlob} from '../../../../../../utils/convertToBlob';
import {useFormik} from 'formik';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {stylesModal} from '../../../../../../styles/styles';
import {AddFile} from '../../../../../../components/AddFile';
import FastImage from 'react-native-fast-image';
import {CrossIconWhite} from '../../../../../../assets/icons/CrossIconWhite';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {InputItem} from '../../../../../../components/InputItam';
import {filesIcons} from '../../../../../../bll/icons';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../../hooks/hooks';

export const RoomDetailsScreen = ({route}: RoomDetailsScreenProps) => {
  const {roomId, getRooms} = route.params;
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  const {room} = useAppSelector(state => state.rooms);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalEditRoom, setIsModalEditRoom] = useState<boolean>(false);
  const [isModalDeleteRoom, setIsModalDeleteRoom] = useState<boolean>(false);
  const [files, setFiles] = useState<FileType[]>(room.roomFiles || []);
  const [newFiles, setNewFiles] = useState<DocumentPickerResponse[]>([]);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  const toggleEditRoom = () => setIsModalEditRoom(!isModalEditRoom);
  const toggleDeleteRoom = () => setIsModalDeleteRoom(!isModalDeleteRoom);

  const initialValues = useMemo(
    () =>
      ({
        name: room.name,
        description: room.description,
        roomId: room.id,
        isAmenity: room.isAmenity,
      } as {
        name: string;
        description: string;
        roomId: string;
        isAmenity: boolean;
      }),
    [room],
  );

  const deleteRoom = async () => {
    setIsLoading(true);
    try {
      await buildingsAPI.deleteRoom({roomId: room.id});
      toggleEditRoom();
      getRooms();
      navigation.goBack();
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const editRoom = async (val: any) => {
    setIsLoading(true);
    try {
      await buildingsAPI.editRoom(val);

      deletedFiles.forEach(
        async el => await buildingsAPI.deleteRoomFile({id: el}),
      );

      if (newFiles.length) {
        const fd = new FormData();
        fd.append('roomId', room.id);
        newFiles.forEach(file => {
          fd.append('files[]', convertToBlob(file));
        });

        await buildingsAPI.addRoomFile(fd);
      }
      toggleEditRoom();
      getRooms();
      dispatch(getRoomByIdTC({roomId}));
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(el => el.id !== id));
    setDeletedFiles(prev => [...prev, id]);
  };

  const {
    errors,
    handleChange,
    setFieldValue,
    handleBlur,
    setValues,
    handleSubmit,
    values,
    submitCount,
  } = useFormik({
    initialValues,
    validationSchema: yup.object().shape({
      name: yup.string().required('This value can not be blank'),
      description: yup.string(),
      isAmenity: yup.boolean(),
    }),
    onSubmit: val => editRoom(val),
    validateOnBlur: true,
  });

  useEffect(() => {
    dispatch(getRoomByIdTC({roomId}));
  }, [roomId]);

  useEffect(() => {
    setValues(initialValues);
  }, [room]);

  return (
    <>
      <ScrollView style={{flex: 1}} contentContainerStyle={styles.content}>
        <View style={styles.container}>
          <InfoItem title="Room Name" text={room.name} />
          <InfoItem
            title="Is Amenity"
            customRightItem={
              <View
                style={[
                  styles.check,
                  room.isAmenity && {
                    backgroundColor: colors.borderAssetColor,
                    borderColor: colors.borderAssetColor,
                  },
                ]}>
                {room.isAmenity && <CheckIcon />}
              </View>
            }
          />
          <InfoItem title="Area (sq.ft)" text={room.area} />
          <InfoItem
            title="Description"
            text={room.description}
            column
            hiddeBorder
          />
          {room.roomFiles?.length > 0 && (
            <InfoItem
              title="Files"
              customRightItem={
                <View style={styles.files}>
                  {room.roomFiles.map(el => (
                    <FileItem key={el.id} file={el} small />
                  ))}
                </View>
              }
              column
              hiddeBorder
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.buttons}>
        <MyButton style="remove" text="Delete Room" action={toggleDeleteRoom} />
        <MyButton
          style="main"
          text="Edit"
          leftIcon={<EditIcon stroke={colors.bottomActiveTextColor} />}
          action={toggleEditRoom}
        />
      </View>
      <ModalLayout
        toggleModal={toggleEditRoom}
        isModalVisible={isModalEditRoom}
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
              defaultValue={values.description}
              handleChange={handleChange('description')}
              error={errors.description}
              touched={submitCount > 0}
              handleBlur={handleBlur('description')}
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
            <View style={styles.modalFiles}>
              {files.map(file => (
                <View key={file.id}>
                  <TouchableOpacity
                    style={styles.cross}
                    onPress={() => {
                      deleteFile(file.id);
                    }}>
                    <CrossIconWhite />
                  </TouchableOpacity>
                  <ImageBackground
                    source={{uri: file?.url}}
                    style={styles.file}
                    borderRadius={8}
                    resizeMode="cover">
                    {file.mimetype?.split('/')[0] !== 'image' ? (
                      <View style={{justifyContent: 'space-around', flex: 1}}>
                        <FastImage
                          source={filesIcons[file.mimetype]}
                          style={styles.fileImage}
                        />
                      </View>
                    ) : (
                      <View style={styles.view} />
                    )}
                  </ImageBackground>
                  <Text
                    style={styles.fileText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {file.name || file.fileName}
                  </Text>
                </View>
              ))}
            </View>
            <AddFile onChange={setNewFiles} />
          </ScrollView>
          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <MyButton
              text="Cancel"
              action={toggleEditRoom}
              style="mainBorder"
            />
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
      <ModalLayout
        toggleModal={toggleDeleteRoom}
        isModalVisible={isModalDeleteRoom}
        title="Delete Room">
        <View>
          <Text style={styles.modalText}>
            Are you sure you want to delete room{' '}
            <Text style={styles.modalTextName}>{`${room.name}`}</Text>?
          </Text>

          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <TouchableOpacity
              onPress={deleteRoom}
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
  content: {paddingHorizontal: 15, paddingBottom: 60},
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 10,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderColor: colors.textSecondColor,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  files: {flexDirection: 'row', flexWrap: 'wrap'},
  buttons: {
    position: 'absolute',
    bottom: 10,
    gap: 10,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  gap: {gap: 10, paddingBottom: 20},

  checkbox: {
    marginVertical: 20,
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

  modalFiles: {
    gap: 15,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },

  file: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: colors.textSecondColor,
  },

  fileText: {
    width: 100,
    color: colors.textSecondColor,
    fontSize: 12,
    paddingHorizontal: 2,
    paddingTop: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  view: {flex: 1},

  cross: {
    position: 'absolute',
    width: 26,
    height: 26,
    backgroundColor: '#1B5BFF',
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
    right: -10,
    borderRadius: 13,
    zIndex: 1,
  },

  fileImage: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
});
