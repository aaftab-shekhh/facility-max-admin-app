import {StyleSheet, Text, TextInput, View} from 'react-native';
import {useAppNavigation, useAppSelector} from '../../../../hooks/hooks';
import {styleInput, stylesModal} from '../../../../styles/styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useState} from 'react';
import {MyButton} from '../../../../components/MyButton';
import {UserRole} from '../../../../enums/user';

export const UpdatePasswordScreen = () => {
  const navigation = useAppNavigation();
  const {email} = useAppSelector(state => state.user.user);

  const [newEmail, setNewEmail] = useState(email);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={styles.mainBlock}>
        <Text style={styles.text}>
          Update password instructions will be sent to the email address listed
          below.
        </Text>
        <Text style={styles.text}>
          If you do not receive it, please check your junk/spam folder
        </Text>
        <View style={styleInput.inputItem}>
          <Text style={styleInput.label}>Email address</Text>
          <TextInput
            style={styleInput.input}
            defaultValue={newEmail}
            onChangeText={setNewEmail}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={stylesModal.modalButtons}>
        <MyButton
          text={'Send'}
          action={() => {
            navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: 'MenuTab',
                params: {
                  screen: 'Settings',
                  params: {
                    screen: 'CreateNewPassword',
                    params: {email: newEmail},
                  },
                },
              },
            });
          }}
          style="main"
        />
      </View>
    </View>
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
  buttom: {
    marginBottom: 30,
  },
});
