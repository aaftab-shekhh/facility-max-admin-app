import {StyleSheet, View} from 'react-native';
import {HeaderTabNavigation} from '../../../../components/HeaderTabNavigation';
import React, {useState} from 'react';
import {CurrentWOs} from './CurrentWOs';
import {UpcomingPMs} from './UpcomingPMs';
import {LatestActivity} from './LatestActivity';
import {FocusAwareStatusBar} from '../../../../components/FocusAwareStatusBar';

export const DashboardTab = () => {
  const [mode, setMode] = useState('currentWOs');

  const renderMode = () => {
    switch (mode) {
      case 'currentWOs':
        return <CurrentWOs />;
      case 'upcomingPMs':
        return <UpcomingPMs />;
      case 'latestActivity':
        return <LatestActivity />;
    }
  };

  const nav = [
    {id: 1, mode: 'currentWOs', label: 'Current WOs'},
    {id: 2, mode: 'upcomingPMs', label: 'Upcoming PMs'},
    // {id: 3, mode: 'latestActivity', label: 'Latest Activity'},
  ];

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />
      <HeaderTabNavigation data={nav} mode={mode} onChange={setMode} />
      {renderMode()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
