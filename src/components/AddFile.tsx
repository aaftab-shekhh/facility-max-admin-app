import {FC, useCallback, useEffect, useState} from 'react';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {AddFileIcon} from '../assets/icons/AddFileIcon';
import {CrossIconWhite} from '../assets/icons/CrossIconWhite';
import FastImage from 'react-native-fast-image';
import {filesIcons} from '../bll/icons';
import {colors} from '../styles/colors';
import {ModalLayout} from './Layouts/ModalLayout';
import {Asset, launchCamera, MediaType} from 'react-native-image-picker';
import {AddDocument} from '../assets/icons/files/AddDocument';
import {AddPhoto} from '../assets/icons/files/AddPhoto';
import {MakePhoto} from '../assets/icons/files/MakePhoto';
import {usePermissions} from '../hooks/usePermissions';
import ImagePicker from 'react-native-image-crop-picker';

type AddFileProps = {
  allowMultiSelection?: boolean;
  onChange?: (files: DocumentPickerResponse[]) => void;
  startFile?: string;
  files?: DocumentPickerResponse[];
};

type ActionCardType = {
  text: string;
  action: () => void;
  img: JSX.Element;
};

const ActionCard: FC<ActionCardType> = ({text, action, img}) => {
  return (
    <TouchableOpacity onPress={action} style={actionCardStyles.container}>
      {img}
      <Text style={actionCardStyles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const actionCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundGreyColor,
    marginBottom: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 10,
  },
  text: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
});

export const AddFile: FC<AddFileProps> = ({
  allowMultiSelection,
  onChange,
  startFile,
  files,
}) => {
  const {getCameraPermissions, cameraPermissions} = usePermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileResponse, setFileResponse] = useState<
    DocumentPickerResponse[] | {uri: string}[] | Asset
  >(startFile ? [{uri: startFile}] : files ? files : []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection:
          allowMultiSelection !== undefined ? allowMultiSelection : true,
      });
      response.map(el => {
        if (allowMultiSelection !== undefined && !allowMultiSelection) {
          setFileResponse([el]);
        } else {
          setFileResponse(prevState => [...prevState, el]);
        }
      });
      toggleModal();
    } catch (err) {
      // console.warn(err);
    }
  }, []);

  const handleGallerySelection = useCallback(async () => {
    try {
      const response = await ImagePicker.openPicker({
        multiple: true,
      });

      response &&
        response.map(el => {
          setFileResponse(prevState => [
            ...prevState,
            {
              ...el,
              uri: el.path,
              type: el.mime,
              name: el.path.split('/').pop(),
            },
          ]);
        });
      toggleModal();
    } catch (err) {
      // console.warn(err);
    }
  }, []);

  const makePhoto = useCallback(
    async (mediaType: MediaType) => {
      if (cameraPermissions) {
        try {
          const res = await launchCamera({
            mediaType,
            includeExtra: true,
            saveToPhotos: true,
            presentationStyle: 'fullScreen',
            durationLimit: 30,
            maxWidth: 720,
            maxHeight: 720,
          });

          if (res?.assets[0].type?.includes('video')) {
            setFileResponse(prevState => [
              ...prevState,
              {
                ...res.assets[0],
                uri: res.assets[0].uri,
                type: res.assets[0].type,
                name: res.assets[0].fileName,
              },
            ]);
          } else {
            const response = await ImagePicker.openCropper({
              width: 300,
              height: 400,
              path: res.assets[0].uri,
              freeStyleCropEnabled: true,
            });

            setFileResponse(prevState => [
              ...prevState,
              {
                ...response,
                uri: response.path,
                type: response.mime,
                name: response.path.split('/').pop(),
              },
            ]);
          }

          toggleModal();
        } catch (err) {
          // console.warn(err);
        }
      }
    },
    [cameraPermissions],
  );

  useEffect(() => {
    onChange && onChange(fileResponse);
  }, [fileResponse]);

  useEffect(() => {
    (async () => await getCameraPermissions())();
  }, []);

  const deleteFile = (index: number) => {
    setFileResponse(prevState => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
  };

  return (
    <View style={styles.files}>
      {fileResponse.map((file, index) => (
        <View key={index + 1}>
          <TouchableOpacity
            style={styles.cross}
            onPress={() => deleteFile(index)}>
            <CrossIconWhite />
          </TouchableOpacity>
          <ImageBackground
            source={{uri: file?.uri}}
            style={styles.file}
            borderRadius={8}
            resizeMode="cover">
            {file.type?.split('/')[0] !== 'image' ? (
              <View style={{justifyContent: 'space-around', flex: 1}}>
                <FastImage
                  source={filesIcons[file.type]}
                  style={styles.fileImage}
                />
              </View>
            ) : (
              <View style={styles.view} />
            )}
          </ImageBackground>
          <Text style={styles.fileText} numberOfLines={2} ellipsizeMode="tail">
            {file.name || file.fileName}
          </Text>
        </View>
      ))}
      <TouchableOpacity style={styles.addFile} onPress={toggleModal}>
        <AddFileIcon />
      </TouchableOpacity>
      <ModalLayout
        title="Add file"
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <>
          <ActionCard
            img={<AddDocument />}
            text="Document"
            action={handleDocumentSelection}
          />
          <ActionCard
            img={<AddPhoto />}
            text="Photo/Video from gallery"
            action={handleGallerySelection}
          />
          {Platform.OS === 'ios' ? (
            <ActionCard
              img={<MakePhoto />}
              text="Take a Photo/Video"
              action={() => {
                makePhoto('mixed');
              }}
            />
          ) : (
            <>
              <ActionCard
                img={<MakePhoto />}
                text="Take a Photo"
                action={() => {
                  makePhoto('photo');
                }}
              />
              <ActionCard
                img={<MakePhoto />}
                text="Take a Video"
                action={() => {
                  makePhoto('video');
                }}
              />
            </>
          )}
        </>
      </ModalLayout>
    </View>
  );
};
const styles = StyleSheet.create({
  files: {
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
  addFile: {
    width: 100,
    height: 100,
    backgroundColor: colors.textSecondColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
