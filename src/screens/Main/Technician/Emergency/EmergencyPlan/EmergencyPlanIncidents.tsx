import {FC} from 'react';
import {useAppSelector} from '../../../../../hooks/hooks';

type EmergencyPlanIncidentsProps = {
  planId: string;
};

export const EmergencyPlanIncidents: FC<EmergencyPlanIncidentsProps> = ({
  planId,
}) => {
  const {workOrder} = useAppSelector(state => state.emergency.emergencyPlan);

  return <></>;
};
