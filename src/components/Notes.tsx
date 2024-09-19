import {FC, memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {NoteType} from '../types/StateType';
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import {createNoteTC} from '../bll/reducers/notes-Reducer';
import {stylesModal} from '../styles/styles';
import {InputItem} from './InputItam';
import {AddFile} from './AddFile';
import {colors} from '../styles/colors';
import FastImage from 'react-native-fast-image';
import {notesAPI} from '../api/notesApi';
import {handleServerNetworkError} from '../utils/handleServerNetworkUtils';
import {filesIcons} from '../bll/icons';
import {DocumentDirectoryPath} from 'react-native-fs';
import {NotFound} from './NotFound';
import {PenLeaveIcon} from '../assets/icons/PenLeaveIcon';
import {ModalLayout} from './Layouts/ModalLayout';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../hooks/useLocalStateSelector';
import uuid from 'react-native-uuid';
import {setNewModuleItem} from '../bll/reducers/local-reducer';
import {setRequest} from '../bll/reducers/offline-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../enums/offline';
import WebView from 'react-native-webview';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {MyButton} from './MyButton';
import {validationsNoteSchema} from '../utils/validationSchemes';
import Video, {VideoRef} from 'react-native-video';
import {Preloader} from './Preloader';

const limit = 30;
const {height} = Dimensions.get('window');

type WorckOrderNotesProps = {
  entity: string;
  id: string;
};

type NoteProps = {
  note: NoteType;
};

const NoteFile = ({file}: any) => {
  const videoRef = useRef<VideoRef>(null);

  const {isConnected} = useNetInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const [url, setUrl] = useState(file.url);

  useEffect(() => {
    isConnected
      ? setUrl(file.url)
      : setUrl(
          'file://' +
            DocumentDirectoryPath +
            '/file/' +
            file.url.split('/')[file.url.split('/').length - 1],
        );
  }, [isConnected]);

  const yourPdfURL = [
    'jpg',
    'png',
    'mp4',
    'mov',
    'wmv',
    'avi',
    'm3u',
    'mpd',
  ].includes(url.split('.').at(-1).toLowerCase())
    ? url
    : `https://docs.google.com/gview?embedded=true&url=${url}`;

  return (
    <>
      <View key={file.id} style={noteStyles.file}>
        <TouchableOpacity
          hitSlop={15}
          onPress={
            toggleOpen
            // () => openFile(file.url)
          }
          key={file.id}
          style={noteStyles.file}>
          <FastImage
            source={
              file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
                ? {uri: url}
                : filesIcons[file.mimetype]
            }
            style={noteStyles.fileImage}
          />
          <Text
            style={noteStyles.fileName}
            numberOfLines={2}
            ellipsizeMode="tail">
            {file.fileName || file.name}
          </Text>
        </TouchableOpacity>
      </View>
      {isOpen && (
        <ModalLayout
          title={file.fileName || file.name}
          isModalVisible={isOpen}
          toggleModal={toggleOpen}>
          <View
            style={{
              width: '100%',
              height: height * 0.65,
            }}>
            {file.mimetype.includes('video') ? (
              <Video
                ref={videoRef}
                source={{uri: yourPdfURL}}
                controls={true}
                onLoadStart={() => {
                  setIsLoading(true);
                }}
                onLoad={() => {
                  setIsLoading(false);
                }}
                style={noteStyles.video}
              />
            ) : (
              <WebView
                source={{
                  uri: yourPdfURL,
                }}
                onLoadProgress={({nativeEvent}) => {
                  console.log(nativeEvent.progress);
                }}
                style={{
                  flex: 1,
                }}
              />
            )}
            {isLoading && <Preloader />}
          </View>
        </ModalLayout>
      )}
    </>
  );
};

const Note: FC<NoteProps> = memo(({note}) => {
  return (
    <View style={noteStyles.container} key={note.id}>
      <View style={noteStyles.row}>
        <Text style={noteStyles.user}>
          {note.creator?.firstName} {note.creator?.lastName}
        </Text>
        <Text style={noteStyles.date}>
          {moment(note.creationDate).fromNow()}
        </Text>
      </View>
      {note.text && note.text !== '' && (
        <Text style={noteStyles.text}>{note.text}</Text>
      )}
      {note.noteFiles && note.noteFiles.length > 0 && (
        <View style={noteStyles.files}>
          {note.noteFiles?.map(file => (
            <NoteFile key={file.id} file={file} />
          ))}
        </View>
      )}
    </View>
  );
});

type UINotesProps = {
  notes: NoteType[];
  isHeaderLoading: boolean;
  getNotes: () => void;
  loadNotes: () => void;
};

const UINotes: FC<UINotesProps> = memo(
  ({notes, isHeaderLoading, getNotes, loadNotes}) => {
    return (
      <FlatList
        data={notes}
        refreshControl={
          <RefreshControl
            refreshing={isHeaderLoading}
            onRefresh={getNotes}
            colors={[colors.mainActiveColor]} // for android
            tintColor={colors.mainActiveColor} // for ios
          />
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return <Note key={item.id} note={item} />;
        }}
        onEndReached={loadNotes}
        onEndReachedThreshold={0.1}
        contentContainerStyle={[styles.flatList]}
        ListEmptyComponent={() => {
          return <NotFound title="No One Has Left a Single Note Here Yet." />;
        }}
      />
    );
  },
);

export const Notes: FC<WorckOrderNotesProps> = memo(({entity, id}) => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const {id: userId, customerId} = useAppSelector(state => state.user.user);
  const {note: localNotes} = useAppSelector(state => state.local.db);

  const {getLocalNotes} = useLocalStateSelector();
  const [isModalVisible, setModalVisible] = useState(false);
  const [noteFiles, setFiles] = useState<DocumentPickerResponse[]>([]);

  const [isHeaderLoading, setIsHeaderLoading] = useState(false);
  const [isButtonSaveLoading, setButtonSaveLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [notes, setNotes] = useState<any[]>([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const closeModal = (): void => {
    toggleModal();
  };

  const getNotes = useCallback(async () => {
    setIsHeaderLoading(true);
    try {
      const res = await notesAPI.getNotes({searchId: id, offset: 0, limit});
      setNotes(res.data.notes);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsHeaderLoading(false);
    }
  }, [notes, isConnected]);

  const loadNotes = useCallback(async () => {
    try {
      const res = await notesAPI.getNotes({
        searchId: id,
        offset: notes.length,
        limit,
      });
      setNotes(prev => [...prev, ...res.data.notes]);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  }, [notes, isConnected]);

  const addLocalNote = (values: any) => {
    const noteId = uuid.v4().toString();
    const model = 'note';
    let note = new FormData();

    for (let i = 0; i < noteFiles.length; i += 1) {
      note.append('noteFiles[]', {
        name: noteFiles[i].name || noteFiles[i].fileName,
        type: noteFiles[i].type,
        uri:
          Platform.OS === 'ios'
            ? noteFiles[i].uri?.replace('file://', '')
            : noteFiles[i].uri,
      });
      const noteFileId = uuid.v4().toString();
      dispatch(
        setNewModuleItem({
          model: 'file',
          id: noteFileId,
          body: {
            createdAt: new Date(),
            createdById: null,
            customerAvatarId: null,
            id: noteFileId,
            key: noteFiles[i].name || noteFiles[i].fileName,
            mimetype: noteFiles[i].type,
            name: noteFiles[i].name || noteFiles[i].fileName,
            noteId,
            updatedAt: new Date(),
            url:
              Platform.OS === 'ios'
                ? noteFiles[i].uri?.replace('file://', '')
                : noteFiles[i].uri,
          },
        }),
      );
    }
    note.append('text', values.description);
    note.append(`${entity}`, id);
    if (isVisible) {
      note.append('isVisible', isVisible);
    }
    dispatch(
      setRequest({
        action: OFFLINE_ACTIONS.CREATE_NOTE,
        method: OFFLINE_METHOD.POST,
        model,
        id: noteId,
        body: note,
      }),
    );
    dispatch(
      setNewModuleItem({
        model,
        id: noteId,
        body: {
          [entity]: id,
          creationDate: new Date(),
          creatorId: userId,
          customerId: customerId,
          id: noteId,
          isVisible: true,
          lastUpdateDate: new Date(),
          text: values.description,
        },
      }),
    );

    closeModal();
  };

  const addNote = async (values: {description: string}) => {
    setButtonSaveLoading(true);
    let note = new FormData();

    for (let i = 0; i < noteFiles.length; i += 1) {
      note.append('noteFiles[]', {
        name: noteFiles[i].name || noteFiles[i].fileName,
        type: noteFiles[i].type,
        uri:
          Platform.OS === 'ios'
            ? noteFiles[i].uri?.replace('file://', '')
            : noteFiles[i].uri,
      });
    }
    note.append('text', values.description);
    note.append(`${entity}`, id);
    try {
      await dispatch(createNoteTC(note));
      await getNotes();
      closeModal();
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setButtonSaveLoading(false);
    }
  };

  useEffect(() => {
    if (notes.length === 0) {
      (async () => {
        isConnected ? await getNotes() : setNotes(getLocalNotes(id));
      })();
    }
  }, [isConnected, localNotes]);

  return (
    <View style={styles.container}>
      {notes.length > 0 ? (
        <UINotes
          notes={notes}
          isHeaderLoading={isHeaderLoading}
          getNotes={
            isConnected
              ? getNotes
              : () => {
                  setNotes(getLocalNotes(id));
                }
          }
          loadNotes={isConnected ? loadNotes : () => {}}
        />
      ) : (
        <NotFound title="No One Has Left a Single Note Here Yet." />
      )}

      <View style={stylesModal.modalButtons}>
        <MyButton
          text="Leave a Note"
          action={toggleModal}
          style="main"
          leftIcon={<PenLeaveIcon />}
        />
      </View>

      <ModalLayout
        isModalVisible={isModalVisible}
        title="Leave Note"
        toggleModal={toggleModal}>
        <Formik
          initialValues={{
            description: '',
          }}
          validateOnBlur
          onSubmit={isConnected ? addNote : addLocalNote}
          validationSchema={validationsNoteSchema}>
          {({errors, handleChange, values, handleSubmit}) => {
            const disabled = !values.description.length;
            return (
              <View>
                <KeyboardAwareScrollView
                  contentContainerStyle={{paddingBottom: 70, gap: 10}}>
                  <InputItem
                    label="Description"
                    handleChange={handleChange('description')}
                    multiline
                    placeholder="Enter your note..."
                    error={errors.description}
                  />
                  <AddFile onChange={setFiles} allowMultiSelection={true} />
                  {entity === 'workOrderId' && (
                    <BouncyCheckbox
                      size={20}
                      style={styles.checkbox}
                      fillColor={colors.borderAssetColor}
                      innerIconStyle={styles.borderRadius}
                      iconStyle={styles.borderRadius}
                      textStyle={styles.checkboxText}
                      isChecked={isVisible}
                      text={'Allow requestors to see notes'}
                      onPress={(isChecked: boolean) => {
                        setIsVisible(isChecked);
                      }}
                    />
                  )}
                </KeyboardAwareScrollView>
                <View style={[stylesModal.modalButtons, {marginHorizontal: 0}]}>
                  <MyButton
                    text="Cancel"
                    action={closeModal}
                    style="mainBorder"
                  />
                  <MyButton
                    text="Save Notes"
                    disabled={disabled}
                    action={() => handleSubmit()}
                    style={disabled ? 'disabled' : 'main'}
                    isLoading={isButtonSaveLoading}
                  />
                </View>
              </View>
            );
          }}
        </Formik>
      </ModalLayout>
    </View>
  );
});

const styles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 10,
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
  container: {
    flex: 1,
    gap: 10,
  },

  flatList: {
    flexGrow: 1,
    paddingBottom: 55,
    paddingTop: 10,
  },

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notFoundText: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    textAlignVertical: 'center',
  },

  leaveButton: {
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    bottom: 0,
    height: 42,
    backgroundColor: colors.mainActiveColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 2.62,
    elevation: 4,
  },
  leaveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  modalContainer: {
    maxHeight: 489,
    marginBottom: 55,
  },
});

const noteStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    gap: 12,
    marginBottom: 10,
    marginHorizontal: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  user: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#202534',
  },
  text: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: '#202534',
  },
  date: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#848A9B',
  },
  files: {
    gap: 25,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },

  fileText: {
    color: colors.bottomActiveTextColor,
    borderRadius: 8,
    paddingHorizontal: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  view: {flex: 1},

  file: {
    gap: 10,
    alignItems: 'center',
  },

  fileImageContainer: {
    width: 105,
    height: 105,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fileImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },

  fileName: {
    maxWidth: 64,
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
