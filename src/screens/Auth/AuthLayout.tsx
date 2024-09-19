import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {LogoSVG} from '../../assets/img/LogoSVG';
import background from '../../assets/img/background.png';
import {Logo2SVG} from '../../assets/img/Logo2SVG';
import {FC} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppNavigation, useAppSelector} from '../../hooks/hooks';
import {colors} from '../../styles/colors';
import {SCREEN_HEIGHT} from '../../styles/styles';

type AuthLayoutProps = {
  children?: JSX.Element;
  title?: string;
  subTitle: string;
  buttonText: string;
  onChange: () => void;
  isForgot?: boolean;
  subTitleLeft?: boolean;
};

export const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  title,
  subTitle,
  buttonText,
  onChange,
  isForgot,
  subTitleLeft,
}) => {
  const navigation = useAppNavigation();
  const {isLoading} = useAppSelector(state => state.app);

  return (
    <ImageBackground
      source={background}
      resizeMode="stretch"
      style={styles.background}>
      <Logo2SVG />
      <KeyboardAwareScrollView style={styles.keyboard}>
        <View style={styles.container}>
          <LogoSVG />

          <View style={styles.inputs}>
            {title && <Text style={styles.title}>{title}</Text>}
            <Text
              style={[styles.subTitle, subTitleLeft && styles.subTitleLeft]}>
              {subTitle}
            </Text>

            {children && children}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={onChange}
              hitSlop={10}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={colors.textColor} />
              ) : (
                <Text style={styles.textButton}>{buttonText}</Text>
              )}
            </TouchableOpacity>
            {isForgot && (
              <TouchableOpacity
                disabled={isLoading}
                onPress={() =>
                  navigation.navigate('Auth', {
                    screen: 'Forgot',
                  })
                }>
                <Text style={styles.password}>Forgot password?</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  inputs: {
    maxWidth: 500,
    width: '90%',
    alignItems: 'center',
    marginTop: -100,
    gap: 10,
  },
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
    textAlign: 'center',
    width: '80%',
  },
  subTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19,
    width: '80%',
    textAlign: 'center',
  },
  subTitleLeft: {
    width: '100%',
    textAlign: 'left',
  },
  buttons: {
    width: '60%',
    gap: 10,
    maxWidth: 400,
  },
  button: {
    backgroundColor: '#FFC107',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  textButton: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  password: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
