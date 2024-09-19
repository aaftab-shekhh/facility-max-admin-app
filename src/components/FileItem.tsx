import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ModalLayout} from './Layouts/ModalLayout';
import {SCREEN_HEIGHT, stylesModal} from '../styles/styles';
import {InputItem} from './InputItam';
import FastImage from 'react-native-fast-image';
import {filesIcons} from '../bll/icons';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {FileType} from '../types/StateType';
import {FC, useState} from 'react';
import {fileAPI} from '../api/fileApi';
import {EditIcon} from '../assets/icons/EditIcon';
import {DotsIcon} from '../assets/icons/DotsIcon';
import {colors} from '../styles/colors';
import {DeleteIcon} from '../assets/icons/DeleteIcon';
import {ActionsMenu} from './ActionsMenu';
import WebView from 'react-native-webview';

type FileItemProps = {
  file: FileType;
  refresh?: () => void;
  small?: boolean;
  hideActions?: boolean;
};

export const FileItem: FC<FileItemProps> = ({
  file,
  refresh,
  small,
  hideActions,
}) => {
  const [isModalRename, setIsModalRename] = useState<boolean>(false);
  const [isModalDelete, setIsModalDelete] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModalRename = () => {
    setIsModalRename(!isModalRename);
  };
  const toggleModalDelete = () => {
    setIsModalDelete(!isModalDelete);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const renameFile = async (val: {id: string; name: string}) => {
    await fileAPI.renameFile(val);
    toggleModalRename();
  };

  const deleteFile = async () => {
    await fileAPI.deleteFile(file.id);
    refresh && refresh();
  };

  const initialValues = {name: file.name, id: file.id} as {
    name: string;
    id: string;
  };

  const {
    errors,
    handleChange,
    setValues,
    handleBlur,
    handleSubmit,
    values,
    submitCount,
  } = useFormik({
    initialValues,
    validationSchema: yup.object().shape({
      name: yup.string().required('This value can not be blank'),
      descriptions: yup.string(),
    }),
    onSubmit: val => renameFile(val),
    validateOnBlur: true,
  });

  const menuConfig = {
    menuButton: (
      <DotsIcon color={colors.backgroundLightColor} fill={colors.textColor} />
    ),
    items: [
      {
        icon: <EditIcon />,
        text: 'Rename',
        action: toggleModalRename,
      },
      {
        icon: <DeleteIcon />,
        text: 'Delete',
        action: toggleModalDelete,
      },
    ],
  };

  const isImage = file.mimetype?.split('/')[0] === 'image';

  const yourPdfURL = ['jpg', 'png'].includes(
    file?.url?.split('.').at(-1).toLowerCase(),
  )
    ? file.url
    : `https://docs.google.com/gview?embedded=true&url=${file.url}`;

  return (
    <View style={styles.fileCintainer}>
      <Pressable onPress={toggleOpen} style={styles.file}>
        <View style={styles.gap}>
          <FastImage
            source={isImage ? {uri: file.url} : filesIcons[file.mimetype]}
            style={isImage ? styles.fileImage : styles.fileOther}
            resizeMode="cover"
          />
          {!small && (
            <View style={styles.smallContainer}>
              <Text
                style={styles.fileName}
                numberOfLines={2}
                ellipsizeMode="tail">
                {values.name}
              </Text>
              {!hideActions && <ActionsMenu menuConfig={menuConfig} />}
            </View>
          )}
        </View>
      </Pressable>
      <ModalLayout
        toggleModal={toggleModalRename}
        isModalVisible={isModalRename}
        title="Rename File">
        <ScrollView contentContainerStyle={styles.gap}>
          <InputItem
            label="Name"
            defaultValue={values.name}
            handleChange={handleChange('name')}
            error={errors.name}
            touched={submitCount > 0}
            handleBlur={handleBlur('name')}
          />
          <View style={[stylesModal.modalButtons, styles.buttons]}>
            <TouchableOpacity
              onPress={() => {
                setValues(initialValues);
                toggleModalRename();
              }}
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
        toggleModal={toggleModalDelete}
        isModalVisible={isModalDelete}
        title="Delete File">
        <View>
          <Text style={styles.modalText}>
            Are you sure you want delete file{' '}
            <Text style={styles.modalTextName}>{`${file?.name}`}</Text>?
          </Text>

          <View style={[stylesModal.modalButtons, styles.buttons]}>
            <TouchableOpacity
              onPress={deleteFile}
              style={[stylesModal.modalButton, styles.buttonDelete]}>
              <Text style={stylesModal.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalLayout>
      <ModalLayout
        title={file.fileName || file.name}
        isModalVisible={isOpen}
        toggleModal={toggleOpen}>
        <View style={styles.webViewContainer}>
          {isLoading && (
            <ActivityIndicator
              style={styles.loader}
              size={'large'}
              color={colors.mainActiveColor}
            />
          )}
          <WebView
            source={{
              uri: yourPdfURL,
            }}
            onLoadStart={() => {
              setIsLoading(true);
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
            style={styles.webView}
          />
        </View>
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  fileCintainer: {
    width: 110,
    minHeight: 120,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundLightColor,
  },

  file: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  gap: {gap: 10},

  fileImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  fileOther: {
    width: 42,
    height: 42,
    margin: 29,
  },
  fileName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
    color: colors.textSecondColor,
  },

  buttons: {
    position: 'relative',
    marginTop: 20,
    marginHorizontal: 0,
  },

  buttonDelete: {
    marginTop: -20,
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

  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  webViewContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.65,
  },

  webView: {flex: 1},

  loader: {
    position: 'absolute',
    height: SCREEN_HEIGHT * 0.65,
    alignSelf: 'center',
    zIndex: 100,
  },
});
