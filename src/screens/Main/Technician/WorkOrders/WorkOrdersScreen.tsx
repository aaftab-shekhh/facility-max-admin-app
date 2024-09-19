import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Search} from '../../../../components/Search';
import {useAppDispatch, useAppSelector} from '../../../../hooks/hooks';
import React, {useCallback, useState} from 'react';
import {colors} from '../../../../styles/colors';
import {setParamsState} from '../../../../bll/reducers/filters-Reducer';
import {MyWeekCalendar} from '../../../../components/MyWeekCalendar';
import {WorkOrdersList} from './WorkOrdersList';
import {FocusAwareStatusBar} from '../../../../components/FocusAwareStatusBar';
import {MyButton} from '../../../../components/MyButton';
import {stylesModal} from '../../../../styles/styles';
import {UserRole} from '../../../../enums/user';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';

export const WorkOrdersScreen = ({navigation}: any) => {
  const isFocus = useIsFocused();

  const dispatch = useAppDispatch();
  const {paramsState} = useAppSelector(state => state.filters);
  const {role} = useAppSelector(state => state.user.user);

  const [mode, setMode] = useState('my');

  const [previousDate, setPreviousDate] = useState<string>(
    moment(paramsState.startDate).toISOString(),
  );

  const setDate = useCallback((date: string) => {
    setPreviousDate(moment(date).toISOString());

    dispatch(
      setParamsState({
        startDate: moment(date).format('YYYY-MM-DDT00:00:00.000Z'),
      }),
    );
    dispatch(
      setParamsState({
        endDate: moment(date).format('YYYY-MM-DDT23:59:00.000Z'),
      }),
    );
    Array.isArray(date)
      ? dispatch(
          setParamsState({
            startDate: new Date(date[0]).toISOString(),
            endDate: new Date(date[date.length - 1])
              .toISOString()
              .replace('00:00', '23:59'),
          }),
        )
      : dispatch(
          setParamsState({
            startDate: new Date(date).toISOString(),
            endDate: new Date(date).toISOString().replace('00:00', '23:59'),
          }),
        );
  }, []);

  return (
    <>
      {isFocus && (
        <View style={styles.container}>
          <FocusAwareStatusBar barStyle="light-content" />
          <View style={styles.searchContainer}>
            <Search
              placeholder="Search for work orders"
              backgroundColor={colors.headerColor}
              // onChangeKey={setSearchKeyWord}
            />
          </View>
          {role === UserRole.SUPERVISOR && (
            <View style={styles.row}>
              <Pressable
                onPress={() => {
                  setMode('all');
                }}
                style={
                  mode === 'all' ? styles.navActiveButton : styles.navButton
                }>
                <Text
                  style={
                    mode === 'all'
                      ? styles.navActiveButtonText
                      : styles.navButtonText
                  }>
                  All Work Orders
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setMode('my');
                }}
                style={
                  mode === 'my' ? styles.navActiveButton : styles.navButton
                }>
                <Text
                  style={
                    mode === 'my'
                      ? styles.navActiveButtonText
                      : styles.navButtonText
                  }>
                  My Work Orders
                </Text>
              </Pressable>
            </View>
          )}

          <MyWeekCalendar
            setDate={setDate}
            startDate={previousDate}
            hideHeaderDate
            byBucket={role === UserRole.SUPERVISOR}
            searchParams={paramsState}
          />

          <WorkOrdersList
            mode={mode}
            previousDate={previousDate}
            paramsState={paramsState}
          />
          <View style={stylesModal.modalButtons}>
            <MyButton
              text={'Create Work Order'}
              action={() => {
                navigation.navigate('CreateWorkOrder');
              }}
              style="main"
            />
          </View>
        </View>
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchContainer: {
    width: '100%',
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.headerColor,
    borderBottomWidth: 0.5,
    borderStyle: 'solid',
    borderColor: colors.textSecondColor,
  },

  navButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  navButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    opacity: 0.5,
  },

  navActiveButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderColor: colors.bottomActiveTextColor,
    borderBottomWidth: 3,
    borderStyle: 'solid',
  },

  navActiveButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
});
