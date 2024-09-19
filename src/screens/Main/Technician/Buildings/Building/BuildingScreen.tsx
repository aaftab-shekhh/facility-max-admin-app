import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BuildingInfo} from './BuildingInfo';
import {BuildingFiles} from './BuildingFiles';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {
  getBuildingByIdTC,
  setBuilding,
} from '../../../../../bll/reducers/buildings-reducer';
import {BuildingInventory} from './BuildingInventory';
import {BuildingFlorsAndPlans} from './BuildingFlorsAndPlans';
import {BuildingTenants} from './BuildingTenants';
import {HeaderTabNavigation} from '../../../../../components/HeaderTabNavigation';
import {Notes} from '../../../../../components/Notes';
import {NotFound} from '../../../../../components/NotFound';
import {BuildingWO} from './BuildingWO';
import {useNetInfo} from '@react-native-community/netinfo';
import {FocusAwareStatusBar} from '../../../../../components/FocusAwareStatusBar';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';
import {BuildingInfoProps} from '../../../../../types/NavTypes/TechnicianNavTypes';

const nav = [
  {id: 1, mode: 'info', label: 'Info'},
  {id: 2, mode: 'tenants', label: 'Tenants'},
  {id: 3, mode: 'floors&plans', label: 'Floors & Plans'},
  // {id: 4, mode: 'calendar', label: 'Calendar'},
  // {id: 5, mode: 'workOrders', label: 'Work Orders'},
  // {id: 6, mode: 'inventory', label: 'Inventory'},
  {id: 7, mode: 'files', label: 'Images & Docs'},
  {id: 8, mode: 'notes', label: 'Notes'},
  // {id: 9, mode: 'history', label: 'History'},
];
const offlineNav = [
  {id: 1, mode: 'info', label: 'Info'},
  {id: 3, mode: 'floors&plans', label: 'Floors & Plans'},
  {id: 8, mode: 'notes', label: 'Notes'},
];

export const BuildingScreen = ({route}: BuildingInfoProps) => {
  const dispatch = useAppDispatch();

  const {isConnected} = useNetInfo();
  const {id} = route.params;

  const [mode, setMode] = useState('info');

  const {building} = useAppSelector(state => state.buildings);
  const {getLocalBuilding} = useLocalStateSelector();
  const {building: localBuilding} = useAppSelector(state => state.local.db);

  const renderMode = () => {
    switch (mode) {
      case 'info':
        return <BuildingInfo />;
      case 'floors&plans':
        return <BuildingFlorsAndPlans />;
      case 'files':
        return <BuildingFiles />;
      case 'tenants':
        return <BuildingTenants />;
      case 'notes':
        return <Notes entity={'buildingId'} id={id} />;
      case 'inventory':
        return <BuildingInventory />;
      case 'workOrders':
        return <BuildingWO />;
    }
  };

  useEffect(() => {
    !isConnected && localBuilding && localBuilding[id]
      ? dispatch(setBuilding(getLocalBuilding(id)))
      : dispatch(getBuildingByIdTC({buildingId: id}));
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />

      {building?.id ? (
        <>
          <HeaderTabNavigation
            data={isConnected ? nav : offlineNav}
            mode={mode}
            onChange={setMode}
          />
          {renderMode()}
        </>
      ) : (
        <NotFound title="Building not found" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
