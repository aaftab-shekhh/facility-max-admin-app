export enum enumTypeWO {
  PREVENTATIVE_MAINTENANCE = 'Preventative Maintenance',
  RECURRING_MAINTENANCE = 'Recurring',
  CORRECTIVE_MAINTENANCE = 'Corrective Maintenance',
  EMERGENCY = 'Emergency',
  PROJECT = 'PROJECT_PLANING',
  SERVICE_REQUEST = 'Service Request',
  ACCESS_CONTROL = 'Access Control Request',
  EVENT_SUPPORT = 'Event Support',
  AMENITY_SPACE_BOOKING = 'Amenity Space Booking',
}
export enum TypePM {
  RESTOCKING = 'Restocking ',
  SAFETY_CHECK = 'Health & Safety Check ',
  TENANT_CHECK = 'Tenant Check ',
  TESTING = 'Testing ',
}

export enum RecurringSubtype {
  ADJUSTMENTS = 'Adjustments/Calibrations',
  CLEANING = 'Cleaning',
  COMPLIANCE_VERIFICATION = 'Compliance Verification',
  EQUIPMENT_SERVICING = 'Equipment Servicing',
  FIRE_SYSTEM = 'Fire System Maintenance',
  INSPECTION = 'Inspection',
  PARTS_REPLACEMENT = 'Parts Replacement',
  PERFORMANCE_CHECK = 'Performance Check',
  RESTOCKING = 'Restocking',
  ROUTINE_SERVICE = 'Routine Maintenance',
  SAFETY_CHECK = 'Health & Safety Check',
  SOFTWARE_UPDATES = 'System/Software Updates',
  TENANT_CHECK = 'Tenant Check',
  TESTING = 'Testing',
  OTHER = 'Other',
}

export enum TypeAccessControl {
  INSTALLATION = 'Installation',
  MAINTENANCE = 'Maintenance',
  REPAIR = 'Repair',
  SETUP = 'Setup',
}

export enum enumServices {
  CUSTODIAL = 'Custodial',
  ELECTRICAL = 'Electrical',
  HVAC = 'HVAC',
  HVAC_HOT = 'HVAC/Too Hot',
  HVAC_COLD = 'HVAC/Too Cold',
  IT_TECHNOLOGY = 'IT/Technology',
  LANDSCAPING = 'Landscaping',
  MAINTENANCE = 'Maintenance ', // need space, because TypeAccessControlWO includes same field
  PLUMBING = 'Plumbing',
  SECURITY = 'Security',
  SPACE_SETUP = 'Space Setup',
  OTHER = 'Other ', // need space, because RecurringSubtype includes same field
}

export enum enumPriority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  SCHEDULED = 'Scheduled',
  // EMERGENCY = 'Emergency',
}

export enum enumStatuses {
  ACTIVE = 'ACTIVE',
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  PENDING_REVIEW = 'Pending Review',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum OnHoldReasons {
  WAITING_FOR_PARTS = 'Waiting for Parts',
  ASSIGN_SUBCONTRACTOR = 'Assign Subcontractor',
  LACK_OF_RESOURCES = 'Lack of Resources',
  UNAVAILABLE_EQUIPMENT = 'Unavailable Equipment',
  NEED_ADDITIONAL_INFORMATION = 'Need Additional Information',
  PRIORITIZATION_OF_OTHER_TASKS = 'Prioritization of Other Tasks',
  SAFETY_CONCERNS = 'Safety Concerns',
  ASSET_IS_CRITICAL = 'Asset is Critical – Review Operating Requirements',
  OTHER = 'Other',
}

export enum WorkTechStatuses {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  WORKING = 'Working',
}

export enum enumFREQUENCY_WO {
  ANNUALLY = 'Annually',
  SEMI_ANNUALLY = 'Semi-Annually',
  ON_HOLD = 'Monthly',
  WEEKLY = 'Weekly',
  EVERY_2_YEARS = 'Every 2 Years',
  EVERY_3_YEARS = 'Every 3 Years',
  EVERY_4_YEARS = 'Every 4 Years',
  EVERY_5_YEARS = 'Every 5 Years',
}

export enum WorkOrderManyAttributeKeys {
  description = 'description',
  type = 'type',
  subType = 'subType',
  scenario = 'scenario',
  specialInstructions = 'specialInstructions',
  priority = 'priority',
  status = 'status',
  startDate = 'startDate',
  expectedCompletionDate = 'expectedCompletionDate',
  endDate = 'endDate',
  displayOnCalendars = 'displayOnCalendars',
  subcontractorFee = 'subcontractorFee',
  weekDay = 'weekDay',
  weekMonth = 'weekMonth',
  year = 'year',
  frequencyPM = 'frequencyPM',
  isContractedPM = 'isContractedPM',
  isOverdue = 'isOverdue',
  contractValuePM = 'contractValuePM',
  paymentTermsPM = 'paymentTermsPM',
  plansId = 'plansId',
  mopsId = 'mopsId',
  workTechCount = 'workTechCount',
  additionalExpenses = 'additionalExpenses',
  estimatedLaborHours = 'estimatedLaborHours',
  actualLaborHours = 'actualLaborHours',
}

export enum WorkOrderManyIncludeKeys {
  creator = 'creator',
  bucket = 'bucket',
  asset = 'asset',
  technicians = 'technicians',
  technicians_with_details = 'technicians_with_details',
  bucket_with_user = 'bucket_with_user',
  building_with_region = 'building_with_region',
  floor = 'floor',
  subcontractor = 'subcontractor',
  room = 'room',
  statuses = 'statuses',
  asset_types = 'asset_types',
  requestor_files = 'requestor_files',
}
