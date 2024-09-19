import {FC, useCallback, useEffect} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {colors} from '../styles/colors';
import {ModalLayout} from './Layouts/ModalLayout';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import {AddDocument} from '../assets/icons/files/AddDocument';
import {AddPhoto} from '../assets/icons/files/AddPhoto';
import {MakePhoto} from '../assets/icons/files/MakePhoto';
import {usePermissions} from '../hooks/usePermissions';
import ImagePicker from 'react-native-image-crop-picker';

type AddFileProps = {
  onChange: (files: DocumentPickerResponse[] | Asset[]) => void;
  toggleModal: () => void;
  isModalVisible: boolean;
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

export const AddFileModal: FC<AddFileProps> = ({
  onChange,
  toggleModal,
  isModalVisible,
}) => {
  const {getCameraPermissions, cameraPermissions} = usePermissions();

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });
      toggleModal();

      onChange(response);
    } catch (err) {
      // console.warn(err);
    }
  }, []);

  const handleGallerySelection = useCallback(async () => {
    try {
      const response = await launchImageLibrary({
        selectionLimit: 0,
        mediaType: 'mixed',
        includeExtra: true,
      });
      toggleModal();
      response.assets && onChange(response.assets);
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
            onChange(prevState => [
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

            onChange(prevState => [
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
    (async () => await getCameraPermissions())();
  }, []);

  return (
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
  );
};
