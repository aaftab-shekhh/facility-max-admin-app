import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styleInput} from '../../../../styles/styles';
import MaskInput from 'react-native-mask-input';
import FastImage from 'react-native-fast-image';
import {ChangePhotoIcon} from '../../../../assets/icons/ChangePhotoIcon';
import {Formik} from 'formik';
import {
  updateAvatarTC,
  updateUserProfileInfoTC,
} from '../../../../bll/reducers/user-reducer';
import * as yup from 'yup';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../hooks/hooks';
import {useCallback, useState} from 'react';
import {Asset} from 'react-native-image-picker';
import {colors} from '../../../../styles/colors';
import {InputItem} from '../../../../components/InputItam';
import {handleServerNetworkError} from '../../../../utils/handleServerNetworkUtils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '@gorhom/bottom-sheet';

export const PrivacySetting = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [selectPhoto, setSelectedPhoto] = useState(false);

  const {firstName, lastName, email, phone, id, avatar} = useAppSelector(
    state => state.user.user,
  );

  const items = [
    {name: 'Via email', id: 'email'},
    {name: 'Via text message', id: 'message'},
  ];

  const [method, setMethod] = useState<string | undefined>(items[0].id);

  const [photo, setPhoto] = useState<Asset & {changed?: boolean}>({
    uri: avatar?.url,
    changed: false,
  });

  const handleImageCapture = useCallback(async () => {
    try {
      const response = await ImagePicker.openCamera({
        width: 720,
        height: 720,
        mediaType: 'photo',
        cropping: true,
        cropperCircleOverlay: true,
      });

      response && setSelectedPhoto(false);

      response &&
        setPhoto({
          ...response,
          uri: response.path,
          type: response.mime,
          fileName: response.path.split('/').pop(),
          changed: true,
        });
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const handleImageSelection = useCallback(async () => {
    try {
      const response = await ImagePicker.openPicker({
        width: 720,
        height: 720,
        mediaType: 'photo',
        cropping: true,
        cropperCircleOverlay: true,
      });

      response &&
        setPhoto({
          ...response,
          uri: response.path,
          type: response.mime,
          fileName: response.path.split('/').pop(),
          changed: true,
        });
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const validationsSchema = yup.object().shape({
    email: yup.string().email(),
    phone: yup.string().min(12, 'Please use at least 11 characters'),
  });

  return (
    <SafeAreaView>
      <Formik
        initialValues={{
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
        }}
        validateOnBlur
        onSubmit={async values => {
          setIsLoadingSave(true);
          try {
            await dispatch(
              updateUserProfileInfoTC({
                firstName: values?.firstName,
                lastName: values?.lastName,
                phone: values.phone,
                email: values.email,
                userId: id,
              }),
            );
            if (photo.changed) {
              setIsLoading(true);
              let data = new FormData();
              const uriParts = photo.uri?.split('.');
              const fileType = uriParts![uriParts!.length - 1];

              data.append('avatar', {
                name: photo.fileName,
                type: `image/${fileType}`,
                uri:
                  Platform.OS === 'ios'
                    ? photo.uri?.replace('file://', '')
                    : photo.uri,
              });
              await dispatch(updateAvatarTC(data));
              setIsLoading(false);
            }
            navigation.goBack();
          } catch (err: any) {
            handleServerNetworkError(err.response.data);
          } finally {
            setIsLoadingSave(false);
          }
        }}
        validationSchema={validationsSchema}>
        {({
          errors,
          values,
          handleChange,
          setFieldValue,
          handleSubmit,
          dirty,
        }) => {
          return (
            <>
              <View style={styles.info}>
                <View>
                  <FastImage
                    style={styles.photo}
                    source={
                      photo?.uri
                        ? {
                            uri: photo?.uri,
                          }
                        : require('../../../../assets/img/def_ava.png')
                    }
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    defaultSource={require('../../../../assets/img/def_ava.png')}
                  />
                  {isLoading && (
                    <View style={[styles.loadingSave, styles.loading]}>
                      <ActivityIndicator color={colors.mainActiveColor} />
                    </View>
                  )}
                  <Pressable
                    style={styles.changePhoto}
                    disabled={isLoading}
                    onPress={() => setSelectedPhoto(true)}>
                    <ChangePhotoIcon />
                  </Pressable>
                </View>
              </View>
              <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <InputItem
                  label="First Name"
                  defaultValue={values.firstName}
                  handleChange={handleChange('firstName')}
                  error={errors.firstName}
                />
                <InputItem
                  label="Last Name"
                  defaultValue={values.lastName}
                  handleChange={handleChange('lastName')}
                  error={errors.lastName}
                />

                <InputItem
                  label="Email address"
                  defaultValue={values.email}
                  handleChange={handleChange('email')}
                  error={errors.email}
                />

                <View style={styleInput.inputItem}>
                  <Text style={styleInput.label}>Mobile Phone</Text>
                  <MaskInput
                    style={styleInput.input}
                    value={values.phone}
                    keyboardType="phone-pad"
                    onChangeText={(_, unmasked) => {
                      setFieldValue('phone', '+' + unmasked);
                    }}
                    mask={[
                      '+',
                      /\d/,
                      ' (',
                      /\d/,
                      /\d/,
                      /\d/,
                      ')',
                      ' ',
                      /\d/,
                      /\d/,
                      /\d/,
                      '-',
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                  />
                  {errors.phone && (
                    <Text style={[styleInput.label, styleInput.labelError]}>
                      {errors.phone}
                    </Text>
                  )}
                </View>

                {/* <DropdownWithLeftIcon
                label="Choose 2FA method"
                data={items}
                onChange={item => setMethod(item.id)}
                startValue={method}
              /> */}
              </KeyboardAwareScrollView>
              <Pressable
                onPress={() => handleSubmit()}
                disabled={!photo.changed && !dirty}
                style={[
                  styles.save,
                  !photo.changed &&
                    !dirty && {
                      backgroundColor: colors.textSecondColor,
                    },
                ]}>
                {isLoadingSave ? (
                  <View style={styles.loadingSave}>
                    <ActivityIndicator color={colors.bottomActiveTextColor} />
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </Pressable>
            </>
          );
        }}
      </Formik>
      {selectPhoto && (
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.close}></View>
            <Text style={styles.title}>Select a Photo</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleImageCapture()}>
              <View style={styles.buttonText2}>
                {/* <TakePhoto /> */}
                <Text style={{color: 'white', fontWeight: '800'}}>
                  Take a Photo
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleImageSelection()}>
              <View style={styles.buttonText2}>
                {/* <UploadPhoto /> */}
                <Text style={{color: 'white', fontWeight: '800'}}>
                  Choose from Gallery
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setSelectedPhoto(false)}>
              <Text style={{color: 'grey', fontWeight: 'bold', fontSize: 18}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  save: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    paddingHorizontal: 15,
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
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  infoItemContainer: {
    marginBottom: 5,
    // marginHorizontal: -10,
  },

  container: {
    paddingHorizontal: 15,
    paddingBottom: 60,
    gap: 10,
  },

  info: {
    marginTop: 10,
    alignItems: 'center',
  },

  photo: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    marginBottom: 10,
    position: 'relative',
  },

  changePhoto: {
    position: 'absolute',
    bottom: 10,
    right: 0,
  },

  loading: {
    backgroundColor: colors.loadBackground,
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  loadingSave: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: colors.mainActiveColor,
    borderRadius: 8,
  },
  modal: {
    justifyContent: 'center',
    margin: 0,
  },
  modalContent: {
    position: 'absolute',
    bottom: 100,
    right: 0,
    left: 0,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: colors.mainActiveColor,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText2: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    padding: 15,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
    height: WINDOW_HEIGHT,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  close: {
    width: WINDOW_WIDTH,
    backgroundColor: 'black',
    color: 'white',
    position: 'relative',
  },
  closeText: {
    position: 'absolute',
    right: 20,
  },
});
