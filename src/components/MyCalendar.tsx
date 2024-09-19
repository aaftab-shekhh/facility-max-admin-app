import React, {FC, useEffect, useState} from 'react';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars/src';
import moment from 'moment-timezone';
import {StyleSheet, Text} from 'react-native';
import {colors} from '../styles/colors';

type MyCalendarProps = {
  startDate: number | number[];
  onChangeDates?: (date: number | number[]) => void;
  setDate?: (date: number | number[]) => void;
  hideHeaderDate?: boolean;
  isDateRange?: boolean;
};

LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  today: 'Today',
};
LocaleConfig.defaultLocale = 'en';

export const MyCalendar: FC<MyCalendarProps> = ({
  startDate,
  onChangeDates,
  setDate,
  hideHeaderDate,
  isDateRange,
}) => {
  const formatDate = (date: number) => moment(date).format('YYYY-MM-DD');

  const [selectedDate, setSelectedDate] = useState<number | number[]>(
    startDate,
  );
  const [months, setMonth] = useState(new Date().toISOString());

  const getMarked = (startDay: DateData, endDay: DateData) => {
    let marked = {};
    for (let i = startDay.day; i <= endDay.day; i++) {
      let day = i.toString().padStart(2, '0');
      let startMonth = startDay.month.toString().padStart(2, '0');
      let endMonth = endDay.month.toString().padStart(2, '0');
      let year = startDay.year.toString();

      if (i === startDay.day) {
        marked[`${year}-${startMonth}-${day}`] = {
          startingDay: true,
          color: colors.mainActiveColor,
          textColor: '#FFFFFF',
        };
      } else if (i === endDay.day) {
        marked[`${year}-${endMonth}-${day}`] = {
          endingDay: true,
          color: colors.mainActiveColor,
          textColor: '#FFFFFF',
        };
      } else {
        marked[`${year}-${startMonth}-${day}`] = {
          color: colors.mainActiveColor,
          textColor: '#FFFFFF',
        };
      }
    }
    return marked;
  };

  const [selectedDateInCalendar, setSelectedDateInCalendar] = useState<any>(
    Array.isArray(selectedDate)
      ? null
      : {
          [formatDate(selectedDate)]: {
            selected: true,
            selectedColor: colors.mainActiveColor,
            color: colors.mainActiveColor,
            startingDay: true,
            endingDay: true,
          },
        },
  );

  const onDayPress = (day: DateData) => {
    setSelectedDateInCalendar({
      [day.dateString]: {
        selected: true,
        selectedColor: colors.mainActiveColor,
        startingDay: true,
        endingDay: true,
        color: colors.mainActiveColor,
      },
    });
    setSelectedDate(day.timestamp);
    onChangeDates && onChangeDates(day.timestamp);
    setDate && setDate(day.timestamp);
  };

  const [firstSelectedDate, setFirstSelectedDate] = useState<DateData | null>(
    null,
  );
  const [secondSelectedDate, setSecondSelectedDate] = useState<DateData | null>(
    null,
  );

  const onDaysPress = (day: DateData) => {
    if (!firstSelectedDate) {
      setFirstSelectedDate(day);
      setSelectedDateInCalendar({
        [day.dateString]: {
          selected: true,
          color: colors.mainActiveColor,
          startingDay: true,
          endingDay: true,
        },
      });
    } else {
      setSecondSelectedDate(day);
    }
  };

  useEffect(() => {
    if (firstSelectedDate && secondSelectedDate) {
      let startDay;
      let endDay;
      if (firstSelectedDate.timestamp > secondSelectedDate.timestamp) {
        startDay = secondSelectedDate;
        endDay = firstSelectedDate;
      } else {
        startDay = firstSelectedDate;
        endDay = secondSelectedDate;
      }
      setSelectedDateInCalendar(getMarked(startDay, endDay));
      setSelectedDate([startDay.timestamp, endDay.timestamp]);
      onChangeDates && onChangeDates([startDay.timestamp, endDay.timestamp]);
      setDate && setDate([startDay.timestamp, endDay.timestamp]);
    }

    setFirstSelectedDate(null);
    setSecondSelectedDate(null);
  }, [secondSelectedDate]);

  useEffect(() => {
    setFirstSelectedDate(null);
    setSecondSelectedDate(null);
  }, [isDateRange]);

  const head = hideHeaderDate && 'stylesheet.calendar.header';
  return (
    <>
      {hideHeaderDate && (
        <Text style={styles.header}>{moment(months).format('MMM YYYY')}</Text>
      )}
      <Calendar
        onDayPress={isDateRange ? onDaysPress : onDayPress}
        monthFormat={'MMM, yyyy'}
        hideArrows={hideHeaderDate}
        disableMonthChange={true}
        enableSwipeMonths={true}
        onMonthChange={date => {
          setMonth(date.dateString);
        }}
        markingType={isDateRange ? 'period' : undefined}
        theme={{
          backgroundColor: '#F4F5F7',
          calendarBackground: '#F4F5F7',
          textSectionTitleColor: '#6C757D',
          selectedDayBackgroundColor: colors.mainActiveColor,
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#1B6BC0',
          dayTextColor: '#555555',
          textDisabledColor: 'rgba(108,117,125,0.3)',
          arrowColor: '#87939E',
          textDayHeaderFontSize: 16,
          [head]: {
            header: {
              height: 0,
            },
          },
        }}
        markedDates={selectedDateInCalendar}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    paddingBottom: 5,
    color: colors.textSecondColor,
  },
});
