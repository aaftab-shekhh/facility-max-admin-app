import {View, Text, StyleSheet, TextInput} from 'react-native';
import {useAppDispatch, useAppNavigation} from '../../hooks/hooks';
import {loginTC} from '../../bll/reducers/app-reducer';
import {useState} from 'react';
import {styleInput} from '../../styles/styles';
import {AuthLayout} from './AuthLayout';

export const LoginScreen = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logIn = () => {
    dispatch(
      loginTC({navigation, body: {email: email.toLowerCase(), password}}),
    );
  };

  return (
    <AuthLayout
      title="Sign In"
      subTitle="Please login to access your management portal"
      buttonText="Sign In"
      onChange={logIn}
      isForgot>
      <>
        <View style={[styleInput.inputItem, {flex: undefined}]}>
          <Text style={[styleInput.label, styles.label]}>Email</Text>
          <TextInput
            keyboardType="email-address"
            style={[styleInput.input, styles.input]}
            onChangeText={setEmail}
          />
        </View>
        <View style={[styleInput.inputItem, {flex: undefined}]}>
          <Text style={[styleInput.label, styles.label]}>Password</Text>
          <TextInput
            style={[styleInput.input, styles.input]}
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>
      </>
    </AuthLayout>
  );
};

export const styles = StyleSheet.create({
  label: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#5B5B70',
    color: '#FFF',
  },
});
