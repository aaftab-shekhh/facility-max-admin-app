import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {styleButtomBotton} from '../styles/styles';
import {FC} from 'react';
import {colors} from '../styles/colors';

type MyButtonProps = {
  action: () => void;
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: JSX.Element;
  style?:
    | 'primary'
    | 'main'
    | 'mainBorder'
    | 'disabled'
    | 'remove'
    | 'primaryRemove';
};

const buttonStyle: {[key: string]: StyleProp<ViewStyle>} = {
  primary: {
    backgroundColor: colors.secondButtonColor,
    borderColor: colors.secondButtonColor,
  },
  main: {
    backgroundColor: colors.mainActiveColor,
    borderColor: colors.mainActiveColor,
  },
  mainBorder: {
    backgroundColor: colors.backgroundMainColor,
    borderColor: colors.mainActiveColor,
  },
  disabled: {
    backgroundColor: colors.textSecondColor,
    borderColor: colors.textSecondColor,
  },
  remove: {
    backgroundColor: colors.deleteColor,
    borderColor: colors.deleteColor,
  },
  primaryRemove: {
    backgroundColor: colors.deleteButtonBackground,
    borderColor: colors.deleteButtonBackground,
  },
};

const textStyle: {[key: string]: StyleProp<TextStyle>} = {
  primary: {
    color: colors.mainActiveColor,
  },
  main: {
    color: colors.bottomActiveTextColor,
  },
  mainBorder: {
    color: colors.mainActiveColor,
  },
  disabled: {
    color: colors.bottomActiveTextColor,
  },
  remove: {
    color: colors.bottomActiveTextColor,
  },
  primaryRemove: {
    color: colors.deleteColor,
  },
};

export const MyButton: FC<MyButtonProps> = ({
  action,
  text,
  style,
  leftIcon,
  disabled,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={action}
      style={[styleButtomBotton.button, style && buttonStyle[style]]}>
      {isLoading ? (
        <ActivityIndicator color={style && textStyle[style].color} />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Text
            style={[styleButtomBotton.buttonText, style && textStyle[style]]}>
            {text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
