import {AssetType, BuildingType, UserType} from './StateType';

export type CreateWOForm = {
  workOrderId?: string;
  title: string;
  type: string;
  subType?: string;
  priority?: string;
  frequency?: string;
  specialInstructions?: string;
  sendToSubcontractor?: boolean;
  buildingId: string;
  estimatedLaborHours?: number;
  frequencyPM?: string;
  expectedDuration?: string;
  displayOnCalendars?: boolean;
  floorId?: string;
  roomId?: string;
  expectedCompletionDate?: string;
  startDate?: string;
  contractValue?: string;
  paymentTerms?: string;
  contractDocuments?: string;
  customerId?: string;
  description?: string;
  isContractedPM?: boolean;
  startWorkOrder?: boolean;
  assetsId?: AssetType[];
  subcontractorId?: string;
  bucketsId?: string[];
  plansId?: string[];
  mopsId?: string[];
};

export type CreateAssetForm = {
  name: string;
  buildingId: string;
  categoryId: string;
  typeId: string;
  model: string;
  manufacturer: string;
  installDate: string;
  isCritical: boolean;
  laborValue: number;
  cost: number;
  serialNumber: string;
  description: string;
  equipmentId: string;
  props: any;
};

export type EditAssetForm = {
  name?: string;
  building?: BuildingType;
  categoryId?: string;
  typeId?: string;
  model?: string;
  manufacturer?: string;
  installDate?: string;
  isCritical?: boolean;
  laborValue?: number;
  cost?: number;
  serialNumber?: string;
  description?: string;
  props?: any;
  equipmentId?: string;
};

export type CreateSubcontractorForm = {
  customerId: string;
  name: string;
  companyName: string;
  availability?: string;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  assetCategoriesId: string[];
  hoursOfOperation: number;
  phone: string;
  afterHoursPhone?: string;
  regionId: string;
  noteText?: string;
  emergencyContact: boolean;
  approvedByProcurement: boolean;
  contacts: [
    {
      id: string;
      firstName?: string;
      lastName?: string;
      title?: string;
      phone?: string;
      email?: string;
    },
  ];
};
export type BuildingFormType = {
  name?: string;
  description?: string;
  type?: string;
  country?: string;
  city?: string;
  address?: string;
  zipCode?: string;
  lat?: string;
  long?: string;
  state?: string;
  area?: string;
  floorsNumber?: number;
  websiteURL?: string;
  buidingAccessInformation?: string;
  yearBuilt?: number;
  buildingId?: string;
  regionId?: string;
  creator: UserType;
  region?: any;
};
