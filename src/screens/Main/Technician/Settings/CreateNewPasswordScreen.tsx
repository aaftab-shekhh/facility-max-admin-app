import {StyleSheet, Text, TextInput, View} from 'react-native';
import {styleInput, stylesModal} from '../../../../styles/styles';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../hooks/hooks';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import * as yup from 'yup';
import {changePasswordTC} from '../../../../bll/reducers/app-reducer';
import {MyButton} from '../../../../components/MyButton';
import {CreateNewPasswordProps} from '../../../../types/NavTypes/TechnicianNavTypes';

export const CreateNewPasswordScreen = ({route}: CreateNewPasswordProps) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const {email} = route.params;
  const {role} = useAppSelector(state => state.user.user);

  const validationsSchema = yup.object().shape({
    password: yup.string().required('Required'),
    newPassword: yup
      .string()
      .required('Please enter new password')
      .min(12, 'Please use at least 12 characters')
      .matches(/^(?=.*[A-Z])/, 'Must contain one capital letter')
      .matches(/^(?=.*[0-9])/, 'Must contain one number')
      .matches(/^(?=.*[!@#\$%\^&\*])/, 'Must contain one cpecial character'),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], "Passwords doesn't match")
      .required('Required'),
  });

  return (
    <Formik
      initialValues={{
        password: '',
        newPassword: '',
        confirmNewPassword: '',
      }}
      validateOnBlur
      onSubmit={values => {
        dispatch(
          changePasswordTC({
            navigation,
            role,
            body: {
              email,
              password: values.password,
              newPassword: values.newPassword,
            },
          }),
        );
      }}
      validationSchema={validationsSchema}>
      {({errors, touched, handleChange, handleBlur, handleSubmit}) => (
        <View style={styles.container}>
          <KeyboardAwareScrollView
            style={styles.mainBlock}
            contentContainerStyle={{gap: 10}}>
            <Text style={styles.text}>
              {`Your new password must be 12 or more characters and contain at least: \n1 Capital Letter\n1 Number\n1 Special Character`}
            </Text>
            <View style={styleInput.inputItem}>
              <Text style={styleInput.label}>Current Password</Text>
              <TextInput
                style={styleInput.input}
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              {touched.password && errors.password && (
                <Text style={[styleInput.label, styleInput.labelError]}>
                  {errors.password}
                </Text>
              )}
            </View>

            <View style={styleInput.inputItem}>
              <Text style={styleInput.label}>New Password</Text>
              <TextInput
                style={styleInput.input}
                secureTextEntry={true}
                onChangeText={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
              />
              {touched.newPassword && errors.newPassword && (
                <Text style={[styleInput.label, styleInput.labelError]}>
                  {errors.newPassword}
                </Text>
              )}
            </View>

            <View style={styleInput.inputItem}>
              <Text style={styleInput.label}>Confirm New Password</Text>
              <TextInput
                style={styleInput.input}
                secureTextEntry={true}
                onChangeText={handleChange('confirmNewPassword')}
                onBlur={handleBlur('confirmNewPassword')}
              />
              {touched.confirmNewPassword && errors.confirmNewPassword && (
                <Text style={[styleInput.label, styleInput.labelError]}>
                  {errors.confirmNewPassword}
                </Text>
              )}
            </View>
          </KeyboardAwareScrollView>
          <View style={stylesModal.modalButtons}>
            <MyButton
              text={'Save'}
              action={() => {
                handleSubmit();
              }}
              style="main"
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  mainBlock: {
    flex: 1,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: '#000000',
    marginBottom: 15,
  },
});
