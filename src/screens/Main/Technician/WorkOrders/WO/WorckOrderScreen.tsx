import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WorckOrderProgress} from './WorckOrderProgress';
import {WorckOrderFiles} from './WorckOrderFiles';
import {WorkOrderAssigments} from './AssignnmentsWO/WorkOrderAssigments';
import {HeaderTabNavigation} from '../../../../../components/HeaderTabNavigation';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {
  getWObyIdTC,
  setWorkOrder,
} from '../../../../../bll/reducers/wo-Reducer';
import {Notes} from '../../../../../components/Notes';
import {WorkOrderProps} from '../../../../../types/NavTypes/NavigationTypes';
import {FocusAwareStatusBar} from '../../../../../components/FocusAwareStatusBar';
import {WorkOrderInfo} from './InfoWO/WorkOrderInfo';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';
import {AssetsHistory} from './AssetsHistory';
import {ReplacementParts} from './ReplacementParts/ReplacementParts';
import {enumTypeWO} from '../../../../../enums/workOrders';

const nav = [
  {id: 1, mode: 'info', label: 'Details'},
  {id: 2, mode: 'progress', label: 'Progress'},
  {id: 3, mode: 'notes', label: 'Notes'},
  {id: 4, mode: 'files', label: 'WO Files'},
  {id: 5, mode: 'assetHistory', label: 'Assets History'},
  {id: 6, mode: 'assignments', label: 'Assignments'},
  {id: 7, mode: 'replacementParts', label: 'Replacement Parts'},
];

export const WorkOrderScreen = ({route}: WorkOrderProps) => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const {getLocalWOById} = useLocalStateSelector();

  const {id} = route.params;
  const {workOrder} = useAppSelector(state => state.wo);

  const [mode, setMode] = useState('info');

  const getWO = () => {
    isConnected
      ? dispatch(
          getWObyIdTC({
            workOrderId: id,
          }),
        )
      : dispatch(setWorkOrder(getLocalWOById(id)));
  };

  useEffect(() => {
    getWO();
  }, [id, isConnected]);

  const renderMode = () => {
    switch (mode) {
      case 'info':
        return <WorkOrderInfo order={workOrder} getWO={getWO} />;
      case 'progress':
        return <WorckOrderProgress />;
      case 'notes':
        return <Notes entity={'workOrderId'} id={id} />;
      case 'files':
        return <WorckOrderFiles workOrderId={id} />;
      case 'assetHistory':
        return <AssetsHistory assets={workOrder.assets} />;
      case 'assignments':
        return <WorkOrderAssigments />;
      case 'replacementParts':
        return <ReplacementParts />;
    }
  };

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />
      <HeaderTabNavigation
        data={
          workOrder.type === enumTypeWO.AMENITY_SPACE_BOOKING
            ? nav.filter(
                el =>
                  el.mode !== 'assetHistory' && el.mode !== 'replacementParts',
              )
            : workOrder?.assets && workOrder.assets.length > 0
            ? nav
            : nav.filter(el => el.mode !== 'assetHistory')
        }
        mode={mode}
        onChange={setMode}
      />
      {renderMode()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
