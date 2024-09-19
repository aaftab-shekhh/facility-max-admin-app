import React, {FC, memo, useCallback, useEffect, useState} from 'react';
import {
  CalendarProvider,
  DateData,
  ExpandableCalendar,
  LocaleConfig,
} from 'react-native-calendars/src';
import moment, {Moment} from 'moment-timezone';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {colors} from '../styles/colors';
import {useCalendar} from '../hooks/useCalendar';

type MyCalendarProps = {
  startDate: Moment | Moment[];
  onChangeDates?: (date: Moment | Moment[]) => void;
  setDate?: (date: Moment | Moment[]) => void;
  hideHeaderDate?: boolean;
  isDateRange?: boolean;
  children?: JSX.Element;
  status?: string;
  searchParams?: any;
  byBucket?: boolean;
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
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};
LocaleConfig.defaultLocale = 'en';

const getIsDateRange = (a, b) => {
  if (!a || !b) {
    return false;
  }
  return (
    new Date(a).getDate().toString() + new Date(a).getMonth().toString() !==
    new Date(b.replace('Z', '')).getDate().toString() +
      new Date(b.replace('Z', '')).getMonth().toString()
  );
};

const getMarked = (startDay: DateData, endDay: DateData) => {
  let marked = {};
  for (let i = startDay.day; i <= endDay.day; i++) {
    let day = i.toString().padStart(2, '0');
    let startMonth = (startDay.month + 1).toString().padStart(2, '0');
    let endMonth = (endDay.month + 1).toString().padStart(2, '0');
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

export const MyWeekCalendar: FC<MyCalendarProps> = memo(
  ({
    startDate,
    onChangeDates,
    setDate,
    hideHeaderDate,
    status,
    searchParams,
    byBucket,
  }) => {
    const [isDateRange, setIsDateRange] = useState(
      getIsDateRange(searchParams.startDate, searchParams.endDate),
    );

    const [currentMonth, setCurrentMonth] = useState<{
      startMonthDate: string | undefined;
      endMonthDate: string | undefined;
    }>({startMonthDate: undefined, endMonthDate: undefined});

    const formatDate = (date: number) => moment(date).format('YYYY-MM-DD');

    const [selectedDate, setSelectedDate] = useState<Moment | Moment[]>(
      searchParams.startDate,
    );

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
              selectedTextColor: colors.bottomActiveTextColor,
            },
          },
    );

    const {markers} = useCalendar({
      byBucket,
      currentMonth,
      status,
      searchParams,
    });

    const onDayPress = useCallback(
      (day: DateData) => {
        setSelectedDateInCalendar({
          [day.dateString]: {
            ...markers[day.dateString],
            selected: true,
            selectedColor: colors.mainActiveColor,
            startingDay: true,
            endingDay: true,
            selectedTextColor: colors.bottomActiveTextColor,
          },
        });
        setDate && setDate(moment(day.timestamp));
        setSelectedDate(moment(day.timestamp));
      },
      [markers],
    );

    const [firstSelectedDate, setFirstSelectedDate] = useState<DateData | null>(
      {
        timestamp: new Date(searchParams.startDate).valueOf(),
        dateString: formatDate(new Date(searchParams.startDate).valueOf()),
        day: new Date(searchParams.startDate).getDate(),
        month: new Date(searchParams.startDate).getMonth(),
        year: new Date(searchParams.startDate).getFullYear(),
      },
    );

    const [secondSelectedDate, setSecondSelectedDate] =
      useState<DateData | null>({
        timestamp: new Date(searchParams.endDate).valueOf(),
        dateString: formatDate(new Date(searchParams.endDate).valueOf()),
        day: new Date(searchParams.endDate).getDate(),
        month: new Date(searchParams.endDate).getMonth(),
        year: new Date(searchParams.endDate).getFullYear(),
      });

    const getMonth = useCallback((date: string) => {
      const currentDate = new Date(date);

      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );

      setCurrentMonth({
        startMonthDate: startOfMonth.toISOString(),
        endMonthDate: endOfMonth.toISOString(),
      });
    }, []);

    useEffect(() => {
      Array.isArray(startDate)
        ? getMonth(new Date(startDate[0]).toISOString())
        : getMonth(new Date(startDate).toISOString());
    }, []);

    useEffect(() => {
      if (isDateRange) {
        setFirstSelectedDate({
          timestamp: new Date(searchParams.startDate).valueOf(),
          dateString: formatDate(new Date(searchParams.startDate).valueOf()),
          day: new Date(searchParams.startDate).getDate(),
          month: new Date(searchParams.startDate).getMonth(),
          year: new Date(searchParams.startDate).getFullYear(),
        });
        setSecondSelectedDate({
          timestamp: new Date(searchParams.endDate).valueOf(),
          dateString: formatDate(new Date(searchParams.endDate).valueOf()),
          day: new Date(searchParams.endDate).getDate(),
          month: new Date(searchParams.endDate).getMonth(),
          year: new Date(searchParams.endDate).getFullYear(),
        });
      } else {
        setFirstSelectedDate(null);
        setSecondSelectedDate(null);
        setSelectedDate(searchParams.startDate);
      }
    }, [isDateRange]);

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
      } else {
        setSelectedDate(searchParams.startDate);
      }
    }, [firstSelectedDate, secondSelectedDate]);

    const head = hideHeaderDate && 'stylesheet.calendar.header';
    const main = hideHeaderDate && 'stylesheet.calendar.main';
    const {width: screenWidth} = useWindowDimensions();

    useEffect(() => {
      !getIsDateRange(searchParams.startDate, searchParams.endDate) &&
        setSelectedDateInCalendar({
          [formatDate(searchParams.startDate)]: {
            selected: true,
            selectedColor: colors.mainActiveColor,
            color: colors.mainActiveColor,
            startingDay: true,
            endingDay: true,
            selectedTextColor: colors.bottomActiveTextColor,
          },
        });
      setIsDateRange(
        getIsDateRange(searchParams.startDate, searchParams.endDate),
      );
    }, [searchParams.startDate, searchParams.endDate]);

    return (
      <>
        <CalendarProvider
          key={screenWidth}
          date={
            new Date()
              // Array.isArray(selectedDate) ? selectedDate[0] : selectedDate,
              .toISOString()
              .split('T')[0]
          }
          style={styles.container}>
          <ExpandableCalendar
            calendarWidth={screenWidth}
            onDayPress={onDayPress}
            monthFormat={'MMM, yyyy'}
            enableSwipeMonths={true}
            onMonthChange={date => getMonth(moment(date.dateString).format())}
            arrowsHitSlop={{top: 0, bottom: 0}}
            disableWeekScroll
            markingType={isDateRange ? 'period' : 'multi-dot'}
            theme={{
              arrowHeight: 20,
              backgroundColor: colors.calendarBsckGround,
              calendarBackground: colors.calendarBsckGround,
              textSectionTitleColor: '#6C757D',
              selectedDayBackgroundColor: '#1b6bc000',
              selectedDayTextColor: '#555555',
              todayTextColor: colors.mainActiveColor,
              dayTextColor: '#555555',
              textDisabledColor: 'rgba(108,117,125,0.3)',
              arrowColor: '#87939E',
              textDayHeaderFontSize: 14,
              textDayFontWeight: '500',
              expandableKnobColor: colors.textSecondColor,
              // [head as any]: {
              //   header: {
              //     flexDirection: 'row',
              //     justifyContent: 'space-between',
              //     paddingLeft: 10,
              //     paddingRight: 10,
              //     // marginTop: 10,
              //     alignItems: 'center',
              //   },
              //   arrow: {
              //     padding: 0,
              //   },
              //   monthText: {
              //     fontSize: 18,
              //     fontWeight: '600',
              //     color: colors.textColor,
              //     margin: 5,
              //     marginBottom: 5,
              //     textAlignVertical: 'center',
              //   },
              // },
              // [main as any]: {
              //   container: {
              //     merginTop: 80,
              //   },
              // },
            }}
            firstDay={1}
            allowShadow={false}
            markedDates={
              isDateRange
                ? selectedDateInCalendar
                : {...markers, ...selectedDateInCalendar}
            }
            // refreshing={false}
          />
        </CalendarProvider>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 15,
    backgroundColor: colors.calendarBsckGround,
  },
  header: {
    textAlign: 'center',
    paddingBottom: 5,
    color: colors.textSecondColor,
  },

  checkbox: {
    marginVertical: 5,
    marginHorizontal: 15,
  },

  borderRadius: {
    borderRadius: 4,
  },

  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },
});
