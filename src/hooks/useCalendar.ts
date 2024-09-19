import {useCallback, useEffect, useState} from 'react';
import {OrderType} from '../types/StateType';
import {handleServerNetworkError} from '../utils/handleServerNetworkUtils';
import {colors} from '../styles/colors';
import {woAPI} from '../api/woApi';
import moment from 'moment';
import {DateData} from 'react-native-calendars';
import {useAppSelector} from './hooks';
import {UserRole} from '../enums/user';
import {enumTypeWO, enumPriority, enumStatuses} from '../enums/workOrders';

const blue = {key: 'blue', color: 'blue'};
const red = {key: 'red', color: 'red'};
const yellow = {key: 'yellow', color: colors.mediumPriority};
const grey = {key: 'grey', color: 'grey'};
const green = {key: 'green', color: 'green'};
const turquoise = {key: 'turquoise', color: 'turquoise'};

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

export const useCalendar: ({}: {
  currentMonth: {
    startMonthDate: string | undefined;
    endMonthDate: string | undefined;
  };
  selectedDate?: number | number[];
  status?: string;
  searchParams?: any;
  byBucket?: boolean;
}) => {
  markers: any;
  selectedDateInCalendar: any;
  onDayPress: (day: DateData) => void;
  onDaysPress: (day: DateData) => void;
  isDateRange: boolean;
} = ({currentMonth, selectedDate, status, searchParams, byBucket}) => {
  const {assignedBuckets} = useAppSelector(state => state.user);

  const getIsDateRange = (a, b) => {
    return (
      new Date(a).getDate().toString() + new Date(a).getMonth().toString() !==
      new Date(b).getDate().toString() + new Date(b).getMonth().toString()
    );
  };

  const formatDate = (date: number) => moment(date).format('YYYY-MM-DD');
  const [isDateRange, setIsDateRange] = useState(
    getIsDateRange(searchParams.startDate, searchParams.endDate),
  );

  useEffect(() => {
    setIsDateRange(
      getIsDateRange(searchParams.startDate, searchParams.endDate),
    );
  }, [searchParams.startDate, searchParams.endDate]);

  const [workOrders, setWorkOrders] = useState<OrderType[]>([]);
  const [firstSelectedDate, setFirstSelectedDate] = useState<DateData | null>(
    null,
  );
  const [secondSelectedDate, setSecondSelectedDate] = useState<DateData | null>(
    null,
  );

  const [markers, setMarkers] = useState({});
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

  const getPeriod = (startDay: string, endDay: string) => {
    var dates = [];
    var currentDate = new Date(startDay);

    while (+new Date(currentDate) <= +new Date(endDay)) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const getMarkers = () => {
    let markersData = {};

    if (workOrders?.length) {
      for (let i = 0; i <= workOrders.length - 1; i += 1) {
        if (workOrders[i].creationDate) {
          const dateI = workOrders[i].creationDate.split('T')[0];
          const datesRange = getPeriod(
            workOrders[i].startDate
              ? workOrders[i].startDate
              : workOrders[i].creationDate,
            workOrders[i].expectedCompletionDate,
          ).map(el => el.toISOString().split('T')[0]);

          if (datesRange.length === 0) {
            let dot: {};

            if (
              workOrders[i].priority === enumPriority.CRITICAL ||
              (workOrders[i].expectedCompletionDate &&
                workOrders[i].expectedCompletionDate < new Date().toISOString())
            ) {
              dot = red;
            } else if (
              workOrders[i].type === enumTypeWO.PREVENTATIVE_MAINTENANCE
            ) {
              dot = blue;
            } else if (workOrders[i].status === enumStatuses.NEW) {
              dot = yellow;
            } else if (workOrders[i].status === enumStatuses.ON_HOLD) {
              dot = grey;
            } else if (workOrders[i].status === enumStatuses.COMPLETED) {
              dot = green;
            } else {
              dot = turquoise;
            }

            markersData[dateI] = {
              dots: markersData[dateI]?.dots
                ? !markersData[dateI].dots.some(el => el?.key === dot?.key)
                  ? [...markersData[dateI].dots, dot]
                  : markersData[dateI].dots
                : [dot],
            };
          } else {
            for (let a = 0; a <= datesRange.length - 1; a += 1) {
              let dot: {};
              if (
                workOrders[i].priority === enumPriority.CRITICAL ||
                (workOrders[i].expectedCompletionDate &&
                  workOrders[i].expectedCompletionDate <
                    new Date().toISOString())
              ) {
                dot = red;
              } else if (
                workOrders[i].type === enumTypeWO.PREVENTATIVE_MAINTENANCE
              ) {
                dot = blue;
              } else if (workOrders[i].status === enumStatuses.NEW) {
                dot = yellow;
              } else if (workOrders[i].status === enumStatuses.ON_HOLD) {
                dot = grey;
              } else if (workOrders[i].status === enumStatuses.COMPLETED) {
                dot = green;
              } else {
                dot = turquoise;
              }

              markersData[datesRange[a]] = {
                dots: markersData[datesRange[a]]?.dots
                  ? !markersData[datesRange[a]].dots.some(
                      el => el?.key === dot?.key,
                    )
                    ? [...markersData[datesRange[a]].dots, dot]
                    : markersData[datesRange[a]].dots
                  : [dot],
              };
            }
          }
        }
      }
    }
    setMarkers(markersData);
  };

  const getWOs = async () => {
    try {
      const {startMonthDate, endMonthDate} = currentMonth;
      if (startMonthDate && endMonthDate) {
        let params: {
          statuses?: string[];
          bucketIdes?: string[];
          byCreator?: boolean;
          limit?: number;
        } = {};
        if (searchParams) {
          params = {...params, ...searchParams};
        }
        if (status) {
          params.statuses = [status];
        }
        if (byBucket) {
          if (assignedBuckets?.length) {
            params.bucketIdes = assignedBuckets.map(el => el.id);
          }
          params.byCreator = true;
        }

        const res = await woAPI.getWorkOrdersForCalendar({
          ...params,
          startDate: startMonthDate,
          endDate: endMonthDate,
        });

        setWorkOrders(res.data.payload);
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      // setIsLoading(false);
    }
  };

  const onDayPress = useCallback((day: DateData) => {
    setSelectedDateInCalendar({
      [day.dateString]: {
        selected: true,
        selectedColor: colors.mainActiveColor,
        startingDay: true,
        endingDay: true,
        selectedTextColor: colors.bottomActiveTextColor,
      },
    });
    // onChangeDates && onChangeDates(day.timestamp);
    // setDate && setDate(day.timestamp);
    // setSelectedDate(day.timestamp);
  }, []);

  useEffect(() => {
    getWOs();
  }, [currentMonth, status, searchParams, byBucket]);

  useEffect(() => {
    getMarkers();
  }, [workOrders]);

  const onDaysPress = useCallback(
    (day: DateData) => {
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
    },
    [firstSelectedDate],
  );

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
      // setSelectedDate([startDay.timestamp, endDay.timestamp]);
      // onChangeDates && onChangeDates([startDay.timestamp, endDay.timestamp]);
      // setDate && setDate([startDay.timestamp, endDay.timestamp]);
    }

    setFirstSelectedDate(null);
    setSecondSelectedDate(null);
  }, [secondSelectedDate]);

  useEffect(() => {
    if (isDateRange) {
      setFirstSelectedDate(searchParams.startDate);
      setSecondSelectedDate(searchParams.endDate);
    }
  }, [isDateRange]);

  return {
    markers,
    selectedDateInCalendar,
    onDayPress,
    onDaysPress,
    isDateRange,
  };
};
