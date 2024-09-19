import {ScrollView, Text, TextInput, View} from 'react-native';
import {useAppDispatch, useAppNavigation} from '../../hooks/hooks';
import {styles} from './LoginScreen';
import {styleInput} from '../../styles/styles';
import {Formik} from 'formik';
import {setNewPasswordTC} from '../../bll/reducers/app-reducer';
import {PasswordProps} from '../../types/NavTypes/NavigationTypes';
import * as yup from 'yup';
import {AuthLayout} from './AuthLayout';

export const NewPasswordScreen = ({route}: PasswordProps) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {email, verificationCode} = route.params;

  const validationsSchema = yup.object().shape({
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
        newPassword: '',
        confirmNewPassword: '',
      }}
      validateOnBlur
      onSubmit={values => {
        dispatch(
          setNewPasswordTC({
            navigation,
            body: {
              email,
              password: values.newPassword,
              verificationCode,
            },
          }),
        );
      }}
      validationSchema={validationsSchema}>
      {({errors, touched, handleChange, handleBlur, handleSubmit}) => (
        <AuthLayout
          title="Create new password"
          subTitle={`Your new password must be 12 or more characters and contain at least: \n1 Capital Letter\n1 Number\n1 Special Character`}
          buttonText="Next"
          onChange={handleSubmit}
          subTitleLeft>
          <ScrollView style={{width: '100%'}}>
            <View style={styleInput.inputItem}>
              <Text style={[styleInput.label, styles.label]}>New Password</Text>
              <TextInput
                style={[styleInput.input, styles.input]}
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
              <Text style={[styleInput.label, styles.label]}>
                Confirm New Password
              </Text>
              <TextInput
                style={[styleInput.input, styles.input]}
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
          </ScrollView>
        </AuthLayout>
      )}
    </Formik>
  );
};
