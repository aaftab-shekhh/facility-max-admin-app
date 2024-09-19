import {StyleSheet, View} from 'react-native';
import {FocusAwareStatusBar} from '../../../../../components/FocusAwareStatusBar';
import {HeaderTabNavigation} from '../../../../../components/HeaderTabNavigation';
import {useEffect, useState} from 'react';
import {EmergencyPlanDetails} from './EmergencyPlanDetails';
import {EmergencyPlanContacts} from './EmergencyPlanContacts';
import {EmergencyPlanProcedures} from './EmergencyPlanProcedures';
import {EmergencyPlanAffectedAreas} from './EmergencyPlanAffectedAreas';
import {EmergencyPlanIncidents} from './EmergencyPlanIncidents';
import {useAppDispatch} from '../../../../../hooks/hooks';
import {getEmergencyPlanTC} from '../../../../../bll/reducers/emergency-Reducer';

const nav = [
  {id: 1, mode: 'details', label: 'Details'},
  {id: 2, mode: 'affectedAreas', label: 'Affected Areas'},
  {id: 3, mode: 'contacts', label: 'Emergency Contacts'},
  {id: 4, mode: 'procedures', label: 'Procedures'},
  // {id: 5, mode: 'incidentHistory', label: 'Incident History'},
];

export const EmergencyPlan = ({route}: any) => {
  const {id} = route.params;
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState('details');

  const renderMode = () => {
    switch (mode) {
      case 'details':
        return <EmergencyPlanDetails planId={id} />;
      case 'affectedAreas':
        return <EmergencyPlanAffectedAreas planId={id} />;
      case 'contacts':
        return <EmergencyPlanContacts planId={id} />;
      case 'procedures':
        return <EmergencyPlanProcedures planId={id} />;
      case 'incidentHistory':
        return <EmergencyPlanIncidents planId={id} />;
    }
  };

  useEffect(() => {
    dispatch(getEmergencyPlanTC({id}));
  }, [id]);

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
