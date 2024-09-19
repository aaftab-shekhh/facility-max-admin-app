import {FC} from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {colors} from '../styles/colors';

type InputItemProps = {
  label?: string;
  defaultValue?: string | number;
  error?: string;
  touched?: boolean;
  handleChange?: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  handleBlur?: (e: any) => void;
  disabled?: boolean;
  numeric?: boolean;
  backgroundColor?: string;
} & {props?: TextInputProps};

export const InputItem: FC<InputItemProps> = ({
  label,
  defaultValue,
  error,
  handleChange,
  multiline,
  placeholder,
  touched,
  handleBlur,
  disabled,
  numeric,
  backgroundColor,
  ...props
}) => {
  const startValue = defaultValue ? String(defaultValue) : undefined;
  return (
    <View style={[styles.inputItem]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {disabled ? (
        <View style={styles.disabledInput}>
          <Text style={styles.itemText}>{defaultValue}</Text>
        </View>
      ) : (
        <TextInput
          style={[
            styles.input,
            backgroundColor && {backgroundColor},
            multiline && styles.multilineInput,
            touched && error && styles.inputError,
          ]}
          multiline={multiline}
          keyboardType={numeric ? 'numeric' : 'default'}
          placeholder={placeholder}
          defaultValue={startValue}
          onChangeText={value => handleChange && handleChange(value.trim())}
          onBlur={handleBlur}
          placeholderTextColor={colors.textSecondColor}
          {...props}
        />
      )}
      {touched && error && (
        <View style={[styles.subLabel]}>
          <View style={styles.mark}>
            <Text style={styles.markText}>!</Text>
          </View>
          <Text style={styles.labelErrorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  inputItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  label: {
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
  },
  subLabel: {
    flexDirection: 'row',
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 2,
  },
  labelError: {
    marginTop: 5,
  },
  labelErrorText: {
    flex: 1,
    color: colors.deleteColor,
    fontSize: 12,
    lineHeight: 18,
  },
  inputError: {
    borderColor: colors.deleteColor,
    borderWidth: 0.5,
    borderStyle: 'solid',
    // backgroundColor: colors.errorBackground,
  },
  mark: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: colors.deleteColor,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: 5,
  },
  markText: {
    color: colors.deleteColor,
    fontSize: 10,
  },
  input: {
    width: '100%',
    marginTop: 2,
    height: 42,
    paddingHorizontal: 10,
    color: colors.textColor,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
  },

  disabledInput: {
    width: '100%',
    marginTop: 2,
    height: 38,
    paddingHorizontal: 10,
    backgroundColor: colors.disabledInputBackground,
    borderRadius: 8,
    justifyContent: 'center',
  },
  itemText: {
    color: colors.textColor,
    borderRadius: 8,
  },
  multilineInput: {
    height: 130,
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingHorizontal: 10,
    // marginVertical: 20,
  },
});
