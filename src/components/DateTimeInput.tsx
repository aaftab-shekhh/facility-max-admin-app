import {FC, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../styles/colors';
import {CalendarIcon} from '../assets/icons/CalendarIcon';
import {styleInput} from '../styles/styles';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {ClockIcon} from '../assets/icons/ClockIcon';

type DateTimeInputProps = {
  onChange: (value: Date) => void;
  startValue?: string;
  labelDate: string;
  labelTime: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
};

export const DateTimeInput: FC<DateTimeInputProps> = ({
  onChange,
  startValue,
  labelDate,
  labelTime,
  touched,
  error,
  disabled,
}) => {
  const [showData, setShowData] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const setDate = (date: Date) => {
    onChange(date);
    setShowData(false);
  };

  const dismissedDate = () => {
    setShowData(false);
  };

  const setTime = (date: Date) => {
    onChange(date);
    setShowTime(false);
  };

  const dismissedTime = () => {
    setShowTime(false);
  };

  useEffect(() => {
    !startValue ? onChange(new Date()) : onChange(new Date(startValue));
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{flex: 1.4, gap: 2}}>
          {labelDate && <Text style={styleInput.label}>{labelDate}</Text>}
          <TouchableOpacity
            style={[
              styles.subContainer,
              error && styles.inputError,
              disabled && styles.disabled,
            ]}
            disabled={disabled}
            onPress={() => {
              !disabled && setShowData(true);
            }}>
            <CalendarIcon stroke={touched && error && colors.deleteColor} />
            <Text style={[styles.text]}>
              {startValue
                ? moment(startValue).format('l')
                : moment().format('l')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, gap: 2}}>
          {labelTime && <Text style={styleInput.label}>{labelTime}</Text>}
          <TouchableOpacity
            style={[
              styles.subContainer,
              error && styles.inputError,
              disabled && styles.disabled,
            ]}
            disabled={disabled}
            onPress={() => {
              !disabled && setShowTime(true);
            }}>
            <ClockIcon stroke={touched && error && colors.deleteColor} />
            <Text style={[styles.text]}>
              {startValue
                ? moment(startValue).format('LT')
                : moment().format('LT')}
            </Text>
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          mode="date"
          title={labelDate}
          open={showData}
          date={startValue ? new Date(startValue) : new Date()}
          onConfirm={setDate}
          theme="light"
          onCancel={dismissedDate}
        />
        <DatePicker
          modal
          mode="time"
          title={labelTime}
          theme="light"
          open={showTime}
          date={startValue ? new Date(startValue) : new Date()}
          onConfirm={date => {
            setTime(date);
          }}
          onCancel={dismissedTime}
        />
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // width: '100%',
    flexDirection: 'row',
    color: colors.textColor,
    alignItems: 'flex-start',
    borderRadius: 8,
    gap: 10,
  },
  subContainer: {
    width: '100%',
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: colors.backgroundLightColor,
  },
  inputError: {
    borderColor: colors.deleteColor,
    borderWidth: 0.5,
    borderStyle: 'solid',
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
  labelErrorText: {
    color: colors.deleteColor,
    fontSize: 12,
    lineHeight: 18,
  },
  text: {
    color: colors.textColor,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
  },
  disabled: {
    backgroundColor: colors.disabledInputBackground,
  },
});
