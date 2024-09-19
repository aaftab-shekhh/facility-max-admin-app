import {
  AssetCategoryType,
  AssetTypeType,
  BuildingType,
  OrderType,
} from './StateType';

export type EmergencyContactType = {
  id: string;
  companyName: string;
  hoursOfOperation: number;
  phone: string;
  emergencyPhone: string;
  buildingAssignments: string;
  responsibilities: [{id: string; name: string; link: string}];
  regions: [
    {
      id: string;
      region: {
        id: string;
        name: string;
        customerId: string;
        creationDate: string;
        lastUpdateDate: string;
      };
    },
  ];
  assetType: AssetCategoryType;
  assetCategory: AssetTypeType;
  contacts: any[];
  emergencyPlans: any[];
  buildings: BuildingType[];
};

export type AffectedAreaType = {
  id: string;
  buildingId: string;
  emergencyPlanId: string;
  building: {id: string; name: string};
  rooms: any[];
  floors: any[];
};
export type AffectedAssetType = {
  id: string;
  assetCategoryId: string;
  emergencyPlanId: string;
  assetCategory: {
    id: string;
    name: string;
    file: {
      id: string;
      url: string;
    };
  };
  assets: any[];
};

export type ProcedureType = {
  id: string;
  type: string;
  title: string;
  description: string;
  assetTypeId: string;
  assetCategoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type NewEmergencyPlanType = {
  id: string;
  currentLevel: number;
  lastReviewed: string;
  createdById: string;
  scenario: string;
  updatedAt: string;
  createdAt: string;
  name: string;
  description: string;
  frequencyStartDate: string;
  frequency: string;
  affectedAreas: [
    {
      id: string;
      building: {
        id: string;
        name: string;
      };
    },
  ];
  ePlanEProcedureFiles: [
    {
      file: {
        id: string;
        emergencyProcedure: ProcedureType;
      };
    },
  ];
  emergencyContacts: [
    {
      id: '4deabb59-423b-4476-8251-d8c7bb4f0cfd';
      emergencyContact: EmergancyContactType;
    },
  ];
  workOrder?: OrderType;
  nextReviewed: string;
  createdBy: {firstName: string; lastName: string};
};

export type LocationItem = {
  id: string;
};

export type EmergencyReportType = {
  id: string;
  scenario: string;
  title: string;
  description: string;
  currentLevel: number;
  createdAt: string;
  updatedAt: string;
  region: LocationItem;
  building: LocationItem;
  floor: LocationItem;
  room: LocationItem;
  selectedAssetCategories?: string[];
  selectedAssets?: string[];
};
