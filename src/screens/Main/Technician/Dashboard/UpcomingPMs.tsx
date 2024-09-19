import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {PMCard} from '../WorkOrders/WO/PMCard/PMCard';
import {NotFound} from '../../../../components/NotFound';
import {handleServerNetworkError} from '../../../../utils/handleServerNetworkUtils';
import {colors} from '../../../../styles/colors';
import {OrderType} from '../../../../types/StateType';
import {woAPI} from '../../../../api/woApi';
import {MyWeekCalendar} from '../../../../components/MyWeekCalendar';
import {enumTypeWO} from '../../../../enums/workOrders';
import {useOrientation} from '../../../../hooks/useOrientation';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';

const limit = 10;

export const UpcomingPMs = () => {
  const isFocus = useIsFocused();

  const {numColumn, onLayout} = useOrientation();

  const today = new Date().valueOf();

  const [previousDate, setPreviousDate] = useState<number | number[]>(today);

  const setDate = useCallback((date: number | number[]) => {
    setPreviousDate(date);
  }, []);

  const [workOrders, setWorkOrders] = useState<OrderType[]>([]);
  const [count, setCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const getWOs = useCallback(async () => {
    setIsLoading(true);
    try {
      let params;

      Array.isArray(previousDate)
        ? (params = {
            types: [enumTypeWO.PREVENTATIVE_MAINTENANCE],
            startDate: new Date(previousDate[0]).toISOString(),
            endDate: new Date(previousDate[previousDate.length - 1])
              .toISOString()
              .replace('00:00', '23:59'),
          })
        : (params = {
            types: [enumTypeWO.PREVENTATIVE_MAINTENANCE],
            startDate: new Date(previousDate).toISOString(),
            endDate: new Date(previousDate)
              .toISOString()
              .replace('00:00', '23:59'),
          });
      const res = await woAPI.getWorkOrdersForCalendar({
        limit,
        offset: 0,
        showPM: true,
        isDayCalendar: true,
        ...params,
      });
      setCount(res.data.count);
      setWorkOrders(res.data.payload);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [workOrders, previousDate]);

  const loadWOs = useCallback(async () => {
    if (count > workOrders.length) {
      try {
        let params;

        Array.isArray(previousDate)
          ? (params = {
              types: [enumTypeWO.PREVENTATIVE_MAINTENANCE],
              byBucket: true,
              startDate: new Date(previousDate[0]).toISOString(),
              endDate: new Date(previousDate[previousDate.length - 1])
                .toISOString()
                .replace('00:00', '23:59'),
            })
          : (params = {
              types: [enumTypeWO.PREVENTATIVE_MAINTENANCE],
              byBucket: true,
              startDate: new Date(previousDate).toISOString(),
              endDate: new Date(previousDate)
                .toISOString()
                .replace('00:00', '23:59'),
            });
        const res = await woAPI.getWorkOrders({
          limit,
          offset: workOrders.length,
          showPM: true,
          ...params,
        });
        setCount(res.data.count);
        setWorkOrders(prev => [...prev, ...res.data.rows]);
      } catch (err) {
        handleServerNetworkError(err.response.data);
      }
    }
  }, [workOrders, previousDate]);

  useEffect(() => {
    getWOs();
  }, [previousDate]);

  return (
    <>
      {isFocus && (
        <View style={styles.container}>
          <MyWeekCalendar
            setDate={setDate}
            startDate={previousDate}
            hideHeaderDate
            searchParams={{
              types: [enumTypeWO.PREVENTATIVE_MAINTENANCE],
              showPM: true,
              byBucket: true,
              startDate: moment().format('YYYY-MM-DDT00:00:00.000'),
              endDate: moment().format('YYYY-MM-DDT23:59:00.000'),
            }}
          />
          <FlatList
            key={numColumn}
            numColumns={numColumn}
            columnWrapperStyle={numColumn !== 1 && styles.gap}
            onLayout={event => {
              onLayout(event.nativeEvent.layout.width);
            }}
            data={workOrders}
            contentContainerStyle={styles.flatList}
            renderItem={({item}) => {
              return <PMCard order={item} numColumn={numColumn} />;
            }}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={getWOs}
                colors={[colors.mainActiveColor]} // for android
                tintColor={colors.mainActiveColor} // for ios
              />
            }
            onEndReached={loadWOs}
            onEndReachedThreshold={0}
            ListEmptyComponent={() => {
              return <NotFound title="Work orders not found" />;
            }}
          />
          {/* {woInList.length > 0 ? (
      <FlatList
        data={woInList}
        renderItem={({item}) => {
          return <PMCard order={item} />;
        }}
      />
    ) : (
      <NotFound title="Preventative maintenances not found" />
    )} */}
        </View>
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  calendarContainer: {
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 15,
  },

  buttomDate: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttomDateText: {
    color: '#202534',
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27,
  },

  checkbox: {
    marginVertical: 10,
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
  flatList: {
    flexGrow: 1,
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  gap: {gap: 10},
});
