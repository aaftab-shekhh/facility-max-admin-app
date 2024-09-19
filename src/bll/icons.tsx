import {Source} from 'react-native-fast-image';
import {TypePM, enumTypeWO} from '../enums/workOrders';

export const dropdownIcons: {[key: string]: Source} = {
  Architectural: require('../assets/img/assets/Architectural.png'),
  Electrical: require('../assets/img/assets/Electrical.png'),
  Plumbing: require('../assets/img/assets/Plumbing.png'),
  HVAC: require('../assets/img/assets/HVAC.png'),
  'HVAC & Mechanical': require('../assets/img/assets/Mechanical.png'),
  'Fire Protection': require('../assets/img/assets/FireProtection.png'),
  'Fire Safety': require('../assets/img/assets/FireProtection.png'),
  Lighting: require('../assets/img/assets/Lighting.png'),
  Equipment: require('../assets/img/assets/Equipment.png'),
  Structural: require('../assets/img/assets/Structural.png'),
  Landscaping: require('../assets/img/assets/Landscaping.png'),
  General: require('../assets/img/assets/General.png'),
  Technology: require('../assets/img/assets/Technology.png'),
  Security: require('../assets/img/assets/Security.png'),
  Furniture: require('../assets/img/assets/FF&E.png'),
};

export const filesIcons: {[key: string]: Source} = {
  'application/pdf': require('../assets/img/files/pdfImage.png'),
  'application/x-pdf': require('../assets/img/files/pdfImage.png'),
  'application/msword': require('../assets/img/files/docImage.png'),
  'image/png': require('../assets/img/files/pngImage.png'),
  'image/jpeg': require('../assets/img/files/jpgImage.png'),
  'image/jpg': require('../assets/img/files/jpgImage.png'),
  'video/mp4': require('../assets/img/files/videoImage.png'),
  'video/quicktime': require('../assets/img/files/videoImage.png'),
  default: require('../assets/img/files/pdfImage.png'),
};

export const workOrderIcons: {[key: string]: Source} = {
  [enumTypeWO.PREVENTATIVE_MAINTENANCE]: require('../assets/img/workOrders/PreventiveMaintenance.png'),
  [enumTypeWO.RECURRING_MAINTENANCE]: require('../assets/img/workOrders/PreventiveMaintenance.png'),
  [enumTypeWO.CORRECTIVE_MAINTENANCE]: require('../assets/img/workOrders/CorrectiveMaintenance.png'),
  [enumTypeWO.EMERGENCY]: require('../assets/img/workOrders/Emergency.png'),
  [enumTypeWO.PROJECT]: require('../assets/img/workOrders/Project.png'),
  [enumTypeWO.SERVICE_REQUEST]: require('../assets/img/workOrders/ServiceRequest.png'),
  [enumTypeWO.ACCESS_CONTROL]: require('../assets/img/workOrders/AccessContro.png'),
  [enumTypeWO.EVENT_SUPPORT]: require('../assets/img/workOrders/EventSupport.png'),
  [enumTypeWO.AMENITY_SPACE_BOOKING]: require('../assets/img/workOrders/AmenitySpaceBooking.png'),
};

export const PMTypeIcons: {[key: string]: Source} = {
  [TypePM.RESTOCKING]: require('../assets/img/PMs/Restocking.png'),
  [TypePM.SAFETY_CHECK]: require('../assets/img/PMs/HealthSafetyCheck.png'),
  [TypePM.TENANT_CHECK]: require('../assets/img/PMs/TenantCheck.png'),
  [TypePM.TESTING]: require('../assets/img/PMs/Testing.png'),
  // [TypePM.CALIBRATION]: require('../assets/img/PMs/Calibrations.png'),
  // [TypePM.CLEANING]: require('../assets/img/PMs/Cleaning.png'),
  // [TypePM.COMPLIANCE_VERIFICATION]: require('../assets/img/PMs/ComplianceVerification.png'),
  // [TypePM.EQUIPMENT_SERVICING]: require('../assets/img/PMs/EquipmentServicing.png'),
  // [TypePM.FIRE_SYSTEM_MAINTENANCE]: require('../assets/img/PMs/FireSystemMaintenance.png'),
  // [TypePM.INSPECTION]: require('../assets/img/PMs/Inspection.png'),
  // [TypePM.PARTS_REPLACEMENT]: require('../assets/img/PMs/PartsReplacement.png'),
  // [TypePM.PERFORMANCE_CHECK]: require('../assets/img/PMs/PerformanceCheck.png'),
  // [TypePM.ROUTINE_MAINTENANCE]: require('../assets/img/PMs/RoutineMaintenance.png'),
  // [TypePM.SOFTWERE_UPDATES]: require('../assets/img/PMs/SoftwareUpdates.png'),
  // [TypePM.OTHER]: require('../assets/img/PMs/Other.png'),
};

export const emergencyProcedureIcons: {[key: string]: Source} = {
  COMPLIANCE_AND_REGULATION: require('../assets/img/emergencyProcedures/regulation.png'),
  MONITORING_AND_EVALUATION: require('../assets/img/emergencyProcedures/Monitoring.png'),
  SAFETY: require('../assets/img/emergencyProcedures/SafetyProcedures.png'),
  COMMUNICATIONS: require('../assets/img/emergencyProcedures/CommunicationProcedures.png'),
  RESPONSE: require('../assets/img/emergencyProcedures/ResponseProcedures.png'),
  RECOVERY: require('../assets/img/emergencyProcedures/RecoveryProcedures.png'),
};
