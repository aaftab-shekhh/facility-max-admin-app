import {FC, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {styleInput} from '../styles/styles';
import moment from 'moment';
import {colors} from '../styles/colors';
import {CalendarIcon} from '../assets/icons/CalendarIcon';
import DatePicker from 'react-native-date-picker';

type DateInputProps = {
  onChange: (value: Date) => void;
  startValue?: string;
  labelDate: string;
  error?: string;
  touched?: boolean;
  maxDate?: Date;
  minDate?: Date;
};

export const DateInput: FC<DateInputProps> = ({
  onChange,
  startValue,
  labelDate,
  touched,
  error,
  maxDate,
  minDate,
}) => {
  const [showData, setShowData] = useState(false);

  const [date, setDate] = useState(startValue ? new Date(startValue) : null);

  const setNewDate = (newDate: Date) => {
    setDate(newDate);
    setShowData(false);
  };

  const dismissedDate = () => {
    setShowData(false);
  };

  useEffect(() => {
    if (date) {
      onChange(date);
    }
  }, [date]);

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          {labelDate && <Text style={styleInput.label}>{labelDate}</Text>}
          <TouchableOpacity
            style={[styles.subContainer, error && styles.inputError]}
            onPress={() => {
              // console.log('press');
              setShowData(true);
            }}>
            <CalendarIcon stroke={touched && error && colors.deleteColor} />
            <Text style={[styles.text]}>
              {date ? moment(date).format('l') : 'Select a date'}
            </Text>
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          mode="date"
          title={labelDate}
          open={showData}
          date={date ? date : new Date()}
          onConfirm={setNewDate}
          theme="light"
          maximumDate={maxDate}
          minimumDate={minDate}
          onCancel={dismissedDate}
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
});
