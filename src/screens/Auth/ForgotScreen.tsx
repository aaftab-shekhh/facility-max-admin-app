import {Text, TextInput, View} from 'react-native';
import {useAppDispatch, useAppNavigation} from '../../hooks/hooks';
import {styles} from './LoginScreen';
import {styleInput} from '../../styles/styles';
import {useState} from 'react';
import {sendVerificationCodeTC} from '../../bll/reducers/app-reducer';
import {AuthLayout} from './AuthLayout';
import {colors} from '../../styles/colors';

export const ForgotScreen = () => {
  const navigation = useAppNavigation();
  const [email, setEmail] = useState<string>('');
  const dispatch = useAppDispatch();
  const sendVerificationCode = () => {
    dispatch(sendVerificationCodeTC({navigation, body: {email, type: 2}}));
  };
  return (
    <AuthLayout
      title="Forgot password?"
      subTitle="Please enter your email to reset your password"
      buttonText="Next"
      onChange={sendVerificationCode}>
      <View style={styleInput.inputItem}>
        <Text style={[styleInput.label, styles.label]}>Email</Text>
        <TextInput
          style={[styleInput.input, styles.input]}
          onChangeText={setEmail}
        />
      </View>
    </AuthLayout>
  );
};
