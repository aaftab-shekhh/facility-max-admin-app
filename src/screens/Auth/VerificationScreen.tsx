import {Platform, Text, TextInput, View} from 'react-native';
import {useAppDispatch} from '../../hooks/hooks';
import {styles} from './LoginScreen';
import {styleInput} from '../../styles/styles';
import {VerificationProps} from '../../types/NavTypes/NavigationTypes';
import {Formik} from 'formik';
import * as yup from 'yup';
import {authAPI} from '../../api/authApi';
import {getMeTC} from '../../bll/reducers/user-reducer';
import {setIsLoading, setIsLoggedIn} from '../../bll/reducers/app-reducer';
import {AuthLayout} from './AuthLayout';
import {setTokens} from '../../api/storage';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import messaging from '@react-native-firebase/messaging';
import {notificationsAPI} from '../../api/notificationsApi';
import {UserRole} from '../../enums/user';

export const VerificationScreen = ({navigation, route}: VerificationProps) => {
  const dispatch = useAppDispatch();
  const {email, password, type} = route.params;

  const validationsSchema = yup.object().shape({
    userCode: yup
      .number()
      .required('Please enter code')
      .min(6, 'Please use at least 6 characters'),
  });

  const checkCode = async (userCode: string) => {
    dispatch(setIsLoading(true));

    try {
      const res = await authAPI.checkVerificationCode({
        email,
        verificationCode: +userCode,
      });

      if (res.status === 201) {
        if (type !== 2) {
          const resLogIn = await authAPI.logIn({
            email,
            password,
            verificationCode: +userCode,
          });

          const role = resLogIn.data.user.role;
          if (role === UserRole.ADMIN || role === UserRole.SUPERVISOR) {
            await setTokens({
              accessToken: resLogIn.data.accessToken,
              refreshToken: resLogIn.data.refreshToken,
            });
            const token = await messaging().getToken();
            await notificationsAPI.enable({deviceType: Platform.OS, token});
            dispatch(getMeTC({}));
            dispatch(setIsLoggedIn(true));
          } else {
            navigation.goBack();
            handleServerNetworkError({
              message: 'You need to log in as a administrator or supervisor.',
              description: '',
            });
          }
        } else {
          navigation.navigate('Password', {email, verificationCode: +userCode});
        }
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <Formik
      initialValues={{
        userCode: '',
      }}
      validateOnBlur
      onSubmit={values => checkCode(values.userCode)}
      validationSchema={validationsSchema}>
      {({errors, touched, handleChange, handleBlur, handleSubmit}) => (
        <AuthLayout
          title="Verification Code Sent"
          subTitle="Please enter the verification code that was sent to you email"
          buttonText="Next"
          onChange={handleSubmit}>
          <View style={styleInput.inputItem}>
            <Text style={[styleInput.label, styles.label]}>
              Verification code
            </Text>
            <TextInput
              keyboardType="numeric"
              style={[styleInput.input, styles.input]}
              onChangeText={handleChange('userCode')}
              onBlur={handleBlur('userCode')}
            />
            {touched.userCode && errors.userCode && (
              <Text style={[styleInput.label, styleInput.labelError]}>
                {errors.userCode}
              </Text>
            )}
          </View>
        </AuthLayout>
      )}
    </Formik>
  );
};
