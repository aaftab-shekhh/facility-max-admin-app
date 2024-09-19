import {FireEmergencyIcon} from '../assets/icons/Emergency/FireEmergencyIcon';
import {HazardousMaterialIcon} from '../assets/icons/Emergency/HazardousMaterialIcon';
import {HealthEmergenciesIcon} from '../assets/icons/Emergency/HealthEmergenciesIcon';
import {InfrastructureFailuresIcon} from '../assets/icons/Emergency/InfrastructureFailuresIcon';
import {NaturalDisasterIcon} from '../assets/icons/Emergency/NaturalDisasterIcon';
import {SecurityIncidentsIcon} from '../assets/icons/Emergency/SecurityIncidentsIcon';
import {CommunicationProceduresIcon} from '../assets/icons/Procedures/CommunicationProceduresIcon';
import {MonitoringProceduresIcon} from '../assets/icons/Procedures/MonitoringProceduresIcon';
import {RecoveryProceduresIcon} from '../assets/icons/Procedures/RecoveryProceduresIcon';
import {RegulationProceduresIcon} from '../assets/icons/Procedures/RegulationProceduresIcon';
import {ResponseProceduresIcon} from '../assets/icons/Procedures/ResponseProceduresIcon';
import {SafetyProcedureIcon} from '../assets/icons/Procedures/SafetyProcedureIcon';
import {enumBuildingTypes} from '../enums/building';
import {EmergencyPlanScenario, Procedures} from '../enums/emergency';
import {enumAvailabilities, enumContactTypes} from '../enums/subcontractor';
import {UserRole} from '../enums/user';
import {
  RecurringSubtype,
  TypeAccessControl,
  TypePM,
  enumTypeWO,
  enumFREQUENCY_WO,
  enumPriority,
  enumServices,
  enumStatuses,
} from '../enums/workOrders';
import {EmergencyType} from '../types/StateType';
import {sortedBy} from '../utils/sorted';

export const StatusesWorkOrders = Object.values(enumStatuses).map(
  (val: string) => {
    return {id: val, name: val};
  },
);

export const TypeWOConfig: {[key: string]: string} = {
  [enumTypeWO.PREVENTATIVE_MAINTENANCE]: 'Preventative Maintenance',
  [enumTypeWO.RECURRING_MAINTENANCE]: 'Recurring',
  [enumTypeWO.CORRECTIVE_MAINTENANCE]: 'Corrective Maintenance',
  [enumTypeWO.EMERGENCY]: 'Emergency',
  [enumTypeWO.PROJECT]: 'Project/Planning',
  [enumTypeWO.SERVICE_REQUEST]: 'Service Request',
  [enumTypeWO.ACCESS_CONTROL]: 'Access Control Request',
  [enumTypeWO.EVENT_SUPPORT]: 'Event Support',
  [enumTypeWO.AMENITY_SPACE_BOOKING]: 'Amenity Space Booking',
};

export const TypeWO = [
  {
    name: TypeWOConfig[enumTypeWO.PREVENTATIVE_MAINTENANCE],
    id: enumTypeWO.PREVENTATIVE_MAINTENANCE,
  },
  {
    name: TypeWOConfig[enumTypeWO.RECURRING_MAINTENANCE],
    id: enumTypeWO.RECURRING_MAINTENANCE,
  },
  {
    name: TypeWOConfig[enumTypeWO.CORRECTIVE_MAINTENANCE],
    id: enumTypeWO.CORRECTIVE_MAINTENANCE,
  },
  {name: TypeWOConfig[enumTypeWO.EMERGENCY], id: enumTypeWO.EMERGENCY},
  {name: TypeWOConfig[enumTypeWO.PROJECT], id: enumTypeWO.PROJECT},
  {
    name: TypeWOConfig[enumTypeWO.SERVICE_REQUEST],
    id: enumTypeWO.SERVICE_REQUEST,
  },
  {
    name: TypeWOConfig[enumTypeWO.ACCESS_CONTROL],
    id: enumTypeWO.ACCESS_CONTROL,
  },
  {name: TypeWOConfig[enumTypeWO.EVENT_SUPPORT], id: enumTypeWO.EVENT_SUPPORT},
  {
    name: TypeWOConfig[enumTypeWO.AMENITY_SPACE_BOOKING],
    id: enumTypeWO.AMENITY_SPACE_BOOKING,
  },
];
export const TypeWorkOrders = sortedBy('name', TypeWO);

export const TypesWOByRole: {[key: string]: {id: string; name: string}[]} = {
  [UserRole.ADMIN]: TypeWorkOrders,
  [UserRole.SUPERVISOR]: TypeWorkOrders,
};

export const PreventiveMaintenances = sortedBy(
  'name',
  Object.values(TypePM).map((val: string) => {
    return {id: val, name: val};
  }),
);

export const Recurring = sortedBy(
  'name',
  Object.values(RecurringSubtype).map((val: string) => {
    return {id: val, name: val};
  }),
);

export const Services = sortedBy(
  'name',
  Object.values(enumServices).map((val: string) => {
    return {id: val, name: val};
  }),
);

export const DropdownServices = Services.filter(
  el => el.id !== enumServices.HVAC,
);

export const AccessControl = sortedBy(
  'name',
  Object.values(TypeAccessControl).map((val: string) => {
    return {id: val, name: val};
  }),
);

export const Priority = Object.values(enumPriority).map((val: string) => {
  return {id: val, name: val};
});

export const Statuses = Object.values(enumStatuses).map((val: string) => {
  return {id: val, name: val};
});

export const BuildingTypes = sortedBy(
  'name',
  Object.values(enumBuildingTypes).map((val: string) => {
    return {id: val, name: val};
  }),
);

export const availabilities = sortedBy(
  'name',
  Object.values(enumAvailabilities).map((val: string) => {
    return {id: val, name: val};
  }),
);

export const contactTypes = sortedBy(
  'name',
  Object.values(enumContactTypes).map((val: string) => {
    return {id: val, name: val};
  }),
);

export const EmergencyFrequency: {[key: string]: string} = {
  '3y': 'Every three years',
  '2y': 'Every two year',
  '1y': 'Annually',
  '6m': 'Semi-Annually',
  '1m': 'Monthly',
  '1w': 'Weekly',
};

export const FREQUENCY = [
  {id: '1w', name: 'Weekly'},
  {id: '1m', name: 'Monthly'},
  {id: '6m', name: 'Semi-Annually'},
  {id: '1y', name: 'Annually'},
  {id: '2y', name: 'Every two year'},
  {id: '3y', name: 'Every three year'},
  {id: '4y', name: 'Every four year'},
  {id: '5y', name: 'Every five year'},
];

export const FREQUENCY_WO = Object.values(enumFREQUENCY_WO).map(
  (val: string) => {
    return {id: val, name: val};
  },
);

export const Dates = [
  {label: '12/12/2023', value: '12/12/2023'},
  {label: '13/12/2023', value: '13/12/2023'},
];

export const EmergencyScenario: EmergencyType[] = [
  {
    id: EmergencyPlanScenario.NATURAL_DISASTER,
    name: 'Natural Disaster',
    description:
      'These scenarios involve emergencies caused by natural events such as earthquakes, floods, hurricanes, tornadoes, wildfires, and severe weather conditions.',
    value: EmergencyPlanScenario.NATURAL_DISASTER,
    image: <NaturalDisasterIcon />,
  },
  {
    id: EmergencyPlanScenario.INFRASTRUCTURE_FAILURES,
    name: 'Infrastructure Failures',
    description:
      'These scenarios involve the failure of key infrastructure within the building, such as power outages, plumbing leaks, HVAC system failures, elevator malfunctions, or structural failures.',
    value: EmergencyPlanScenario.INFRASTRUCTURE_FAILURES,
    image: <InfrastructureFailuresIcon />,
  },
  {
    id: EmergencyPlanScenario.SECURITY_INCIDENTS,
    name: 'Security Incidents',
    description:
      'These scenarios involve threats to the security of the building and its occupants, such as break-ins, vandalism, or cyber attacks.',
    value: EmergencyPlanScenario.SECURITY_INCIDENTS,
    image: <SecurityIncidentsIcon />,
  },
  {
    id: EmergencyPlanScenario.HEALTH_EMERGENCIES,
    name: 'Health Emergencies',
    description:
      "These scenarios involve health-related emergencies, such as a pandemic outbreak, food poisoning in the building's cafeteria, or a person becoming seriously ill or injured on the premises. The response would typically involve coordinating with healthcare providers and implementing measures to protect the health and safety of all occupants.",
    value: EmergencyPlanScenario.HEALTH_EMERGENCIES,
    image: <HealthEmergenciesIcon />,
  },
  {
    id: EmergencyPlanScenario.HAZARDOUS_MATERIAL_INCIDENTS,
    name: 'Hazardous Material Incidents',
    description:
      'These scenarios involve the release of hazardous materials, such as chemical spills, gas leaks, or the presence of asbestos. The response would typically involve evacuating the affected area, containing the hazard, and cleaning up under the guidance of specialized professionals.',
    value: EmergencyPlanScenario.HAZARDOUS_MATERIAL_INCIDENTS,
    image: <HazardousMaterialIcon />,
  },
  {
    id: EmergencyPlanScenario.FIRE_EMERGENCY,
    name: 'Fire Emergency',
    description:
      'These scenarios involve fire-related emergencies, from small fires that can be extinguished with a fire extinguisher to larger fires that require evacuation and the intervention of the fire department.',
    value: EmergencyPlanScenario.FIRE_EMERGENCY,
    image: <FireEmergencyIcon />,
  },
];

export const ProcedureIcons = {
  [Procedures.SAFETY]: <SafetyProcedureIcon />,
  [Procedures.COMMUNICATIONS]: <CommunicationProceduresIcon />,
  [Procedures.RESPONSE]: <ResponseProceduresIcon />,
  [Procedures.RECOVERY]: <RecoveryProceduresIcon />,
  [Procedures.MONITORING_AND_EVALUATION]: <MonitoringProceduresIcon />,
  [Procedures.COMPLIANCE_AND_REGULATION]: <RegulationProceduresIcon />,
};

export const ProceduresData = [
  {
    id: Procedures.SAFETY,
    name: 'Safety Procedures',
    title: 'Safety Procedures',
    procedures: [],
  },
  {
    id: Procedures.COMMUNICATIONS,
    name: 'Communication Procedures',
    title: 'Communication Procedures',
    procedures: [],
  },
  {
    id: Procedures.RESPONSE,
    name: 'Response Procedures',
    title: 'Response Procedures',
    procedures: [],
  },
  {
    id: Procedures.RECOVERY,
    name: 'Recovery Procedures',
    title: 'Recovery Procedures',
    procedures: [],
  },
  {
    id: Procedures.MONITORING_AND_EVALUATION,
    name: 'Monitoring & Evaluation',
    title: 'Monitoring & Evaluation',
    procedures: [],
  },
  {
    id: Procedures.COMPLIANCE_AND_REGULATION,
    name: 'Compliance & Regulation',
    title: 'Compliance & Regulation',
    procedures: [],
  },
];
