import {UserRole} from '../enums/user';

export type UserRoleType =
  | UserRole.REQUESTOR
  | UserRole.TECHNICIAN
  | UserRole.SUPERVISOR;

export type UserNotificationSettingsType = {
  id: string;
  reqWoLeftComments: boolean;
  reqWoResponseChanged: boolean;
  reqWoPartsOrdered: boolean;
  reqWoPmToday: boolean;
  reqWoPmCompleted: boolean;
  techBuildingNew: boolean;
  techBuildingNewPlan: boolean;
  techAssetImported: boolean;
  techPmCompleted: boolean;
  techInventoryLowStock: boolean;
  superBuildingNew: boolean;
  superBuildingNewPlan: boolean;
  superFloorPlansUpdate: boolean;
  superWoStatusChanged: boolean;
  superAssetsImported: boolean;
  superAssetsPlotted: boolean;
  superPmCompleted: boolean;
  superInventoryReservedItem: boolean;
  superSupportNewDoc: boolean;
  adminBuildingNew: boolean;
  adminBuildingTenantAssign: boolean;
  adminBuildingNewInsuranceUtility: boolean;
  adminWoNew: boolean;
  adminWoStatus: boolean;
  adminWoCompleted: boolean;
  adminWoOverdue: boolean;
  adminWoNotOpened: boolean;
  adminPmCompleted: boolean;
  adminPmOverDue: boolean;
  adminInventoryLowStock: boolean;
  adminInventoryReOrder: boolean;
  adminInventoryPurchaseRequest: boolean;
  adminInventoryTransferInit: boolean;
  adminSupportNewDoc: boolean;
  userId: string;
  creationDate: string;
  lastUpdateDate: string;
};

export type UserType = {
  id: string;
  email: string;
  avatar: {url: string};
  avatarKey: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  isTenant: false;
  buckets: any[];
  region: {id: string; name: string};
  role: UserRoleType;
  status: string;
  registrated: string;
  nextAuthWithCode: string;
  customerId: string;
  roomId: string;
  buildingId: string;
  building: string;
  room: string;
  type: string;
  woCompleteDate: string;
  regionId: string;
  creationDate: string;
  lastUpdateDate: string;
  notes: [];
  userFiles: [];
  userNotificationSettings: UserNotificationSettingsType;
};

export type SearchParamsType = {
  priorities?: string[];
  statuses?: string[];
  types?: string[];
  subTypes?: string[];
  accessControls?: string[];
  serviceTypes?: string[];
  recurringMaintenance?: string[];
  keySearchValue?: string;
  showPM?: boolean;
  onlyMyWO?: boolean;
  startDate: string;
  endDate: string;
  subcontractorIdes?: string[];
};

export type InventoryType = {
  id: string;
  createdAt: string;
  manufacturerPartNumber: number;
  currentQuantity: string;
  status: string;
  allocatedForWO: string;
  bin: string;
  buildingId: string;
  inventoryId: string;
  itemTurnoverRate: number;
  stockAge: number;
  price: number;
  profitMargin: number;
  roomId: string;
  shelf: string;
  totalPrice: number;
  updatedAt: string;
  workOrder: OrderType;
  building: BuildingType;
  room: RoomType;
  workOrderId: string;
  equipmentId: string;
};

export type ContractorType = {
  assetId: string;
  id: string;
  subcontractor: {
    address: string;
    afterHoursPhone: string;
    approvedByProcurement: boolean;
    availability: string;
    city: string;
    creationDate: string;
    customerId: string;
    emergencyContact: true;
    hoursOfOperation: string;
    id: string;
    lastUpdateDate: string;
    name: string;
    phone: string;
    regionId: string;
    state: string;
    zipCode: string;
  };
  subcontractorId: string;
};

export type HistoryType = {
  action: string;
  createdAt: string;
  id: string;
  link: string;
  object: string;
  subObject: string;
  user: {
    firstName: string;
    id: string;
    lastName: string;
    role: string;
  };
};

export type CategoryAssets = {
  id: string;
  name: string;
  assetsCount: number;
  newCount: number;
  file: {url: string};
  color: string;
};

export type AssetType = {
  id: string;
  equipmentId: string;
  name: string;
  pagesCount: number;
  description?: string;
  avatar: any;
  category: {
    customerId: string;
    id: string;
    name: string;
    color: string;
    file: {url: string};
  };
  types: {
    customerId: string;
    id: string;
    name: string;
  };
  woCount: number;
  isCritical?: boolean;
  plansCount?: number;
  building: BuildingType;
  room?: RoomType;
  installDate?: string;
  qr?: string;
  categoryId: string;
  serialNumber: string;
  model?: string;
  manufacturer: string;
  supervisorContacts?: string;
  requestorContacts?: string;
  laborValue?: string;
  cost?: string;
  price?: number;
  creatorId: string;
  buildingId?: string;
  floorId: string;
  roomId?: string;
  customerId?: string;
  regionId?: string;
  creationDate?: string;
  lastUpdateDate?: string;
  AICRating?: string;
  busAmpRating?: string;
  busSize?: string;
  mountingType?: string;
  location?: string;
  phase?: string;
  typeId: string;
  x: number;
  y: number;
  assetPropsAnswers?: any;
  notes?: NoteType[];
  inventories?: InventoryType[];
  contractors?: ContractorType[];
  WOhistory?: HistoryType[];
  workOrders: OrderType[];
  assetPlans: [
    {
      x: number;
      y: number;
    },
  ];
  history?: HistoryType[];
  floor?: FloorType;
};

export type OrderType = {
  id: string;
  woId?: string;
  number: number;
  title: string;
  name: string;
  type: string;
  serviceType: string;
  status: string;
  date: number;
  description: string;
  createdDate: number;
  owner: string;
  executor: string;
  executorId: number;
  priorities: string;
  lat?: string;
  long?: string;
  assets?: AssetType[];
  contractors?: ContractorType[];
  assetHistory: HistoryType[];
  workOrderStatuses: {
    cancellationReason: string;
    creationDate: string;
    id: string;
    lastUpdateDate: string;
    reasonForOnHold: string;
    status: string;
    workOrderId: string;
  }[];
  subType: string;
  priority: string;
  specialInstructions: string;
  startDate: string;
  expectedCompletionDate: string;
  estimatedLaborHours: number;
  actualLaborHours: number;
  customerId: string;
  buildingId: string;
  floorId?: string;
  roomId?: string;
  assetId?: string;
  subcontractorId: string;
  bucketId: string;
  creationDate: string;
  lastUpdateDate: string;
  requestorFiles?: FileType[];
  buckets: {
    id: string;
    name: string;
    description: string;
    assignmentMethod: string;
    creatorId: string;
    customerId: string;
    regionId: string;
    createdAt: string;
    updatedAt: string;
  }[];
  technicians: [
    {
      id: string;
      email: string;
      avatarUrl: string;
      avatarKey: string;
      phone: string;
      firstName: string;
      lastName: string;
      title: string;
      type: string;
      isTenant: string;
      initialSetup: boolean;
      role: string;
      status: string;
      workOrderStatus: string;
      workOrderCompleteDate: string;
      nextAuthWithCode: string;
      workTechStatus: string;
      regionId: string;
      customerId: string;
      buildingId: string;
      roomId: string;
      creationDate: string;
      lastUpdateDate: string;
      WorkOrderTechnician: {
        id: string;
        workTechStatus: string;
        workOrderId: string;
        technicianId: string;
        endDateTech?: string;
        startDateTech?: string;
        hoursSpentTech?: string;
        estimatedLaborHoursTech?: string;
      };
    },
  ];
  customer: any;
  building: BuildingType;
  room: RoomType;
  floor: FloorType;
  subcontractor: any;
  notes: NoteType[];
  workOrderFiles: FileType[];
  creator: UserType;
  creatorId: string;
};

export type TenantType = {
  id: string;
  name: string;
  website: string;
  status: string;
  customerId: string;
  creationDate: string;
  lastUpdateDate: string;
  deletedAt: string;
  avatar: FileType;
  regionsCount: number;
  statusByLease: boolean;
  buildingCount: number;
  totalUsersInTenantCompanyCount: number;
  activeUsersCount: number;
  unactiveUsersCount: number;
  totalAttachedUsersCount: number;
  totalSqFeet: number;
  leaseFees: number;
  leases: any[];
};

export type ContactType = {
  id: string;
  name?: string;
  phone?: string;
  img?: string;
  role?: string;
  email?: string;
  building?: string;
  type?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  subcontractorId?: string;
  customerId?: string;
  buildingId?: string;
  roomId?: string;
  creationDate?: string;
  lastUpdateDate?: string;
  user?: Omit<ContactType, 'user'>;
};

export type NoteType = {
  id: string;
  text: string;
  isVisible: boolean;
  userId: string;
  creatorId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  assetId: string;
  subcontractorId: string;
  customerId: string;
  workOrderId: string;
  creationDate: string;
  lastUpdateDate: string;
  noteFiles?: any[];
  bucketId: null;
  creator: UserType;
};

export type FileType = {
  id: string;
  name: string;
  url: string;
  fileKey: string;
  creationDate: string;
  size: number;
  buildingId?: number;
  floorId?: number;
  roomId?: number;
  utilitiesOrInsuranceId: null;
  lastUpdateDate: string;
  mimetype: string;
  workOrderId?: string;
};

export type PageType = {
  id: string;
  page: number;
  customerId: string;
  planId: string;
  file: {
    id: string;
    name: string;
    url: string;
    mimetype: string;
    size: number;
    width: number;
    height: number;
    createdAt: string;
    version: number;
    key: string;
  };
};

export type PlanType = {
  id: string;
  buildingId: string;
  floorId: string;
  fileKey: string;
  name: string;
  url: string;
  size: number;
  creationDate: string;
  lastUpdateDate: string;
  width: number;
  height: number;
  file: {
    id: string;
    name: string;
    key: string;
    url: string;
    mimetype: string;
    size: number;
    width: number;
    height: number;
    purchaseId: string;
    planId: string;
    categoryId: string;
    emergencyProcedureId: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type RoomType = {
  id: string;
  name: string;
  isAmenity: boolean;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  tenantWebsite: string;
  tenantTitle: string;
  tenantLeaseType: string;
  floorId: number;
  userId: string;
  roomFiles: FileType[];
  roomPlans: PlanType[];
  show?: boolean;
  area?: number;
  description?: string;
};
export type RoomOnThePlanType = {
  id: string;
  name: string;
  show: boolean;
  points: [
    {
      color: string;
      id: string;
      x: number;
      y: number;
    },
  ];
};

export type FloorType = {
  id: string;
  name: string;
  label: string;
  descriptions: string;
  buildingId: number;
  rooms: RoomType[];
  floorFiles: FileType[];
  floorPlans: PlanType[];
  roomsCount: number;
  plansCount: number;
};

export type BuildingType = {
  id: string;
  name: string;
  description: string;
  avatar: {url: string};
  imageKey: string;
  type: string;
  country: string;
  city: string;
  zipCode: string;
  state: string;
  address: string;
  lat: string;
  long: string;
  area: string;
  yearBuilt: number;
  floorsNumber: number;
  websiteURL: string;
  buidingAccessInformation: string;
  created: string;
  creatorId: number;
  contactId: number;
  customerId: number;
  regionId: number;
  creator: {
    id: number;
    email: string;
    avatarUrl: string;
    avatarKey: string;
    phone: string;
    firstName: string;
    lastName: string;
    title: string;
    region: string;
    isTenant: string;
    role: string;
    status: number;
    registrated: string;
    nextAuthWithCode: string;
    customerId: number;
    roomId: number;
    buildingId: number;
  };
  contact: {
    id: number;
    email: string;
    avatarUrl: string;
    avatarKey: string;
    phone: string;
    firstName: string;
    lastName: string;
    title: string;
    region: string;
    isTenant: string;
    role: string;
    status: number;
    registrated: string;
    nextAuthWithCode: string;
    customerId: number;
    roomId: number;
    buildingId: number;
  };
  region: {
    id: number;
    name: string;
    customerId: number;
  };
  customer: {
    id: number;
    name: string;
    taxId: string;
    websiteURL: string;
    active: true;
    registrated: string;
    contactPerson: {
      type: string;
      email: string;
      title: string;
      lastName: string;
      firstName: string;
    };
    billingContact: {
      type: string;
      email: string;
      title: string;
      lastName: string;
      firstName: string;
    };
  };
  contacts: ContactType[];
  notes: NoteType[];
  floors: FloorType[];
  inventary?: InventoryType[];
  creationDate?: string;
  deletedAt?: string;
  lastUpdateDate?: string;
  openWOCount?: number;
  pastDuePMCount?: number;
  pastDueWOCount?: number;
  totalAssetsCount?: number;
  totalWOCount?: number;
};

export type EmergencyType = {
  id: string;
  name: string;
  description: string;
  value: string;
  image?: JSX.Element;
};

export type AssetCategoryType = {
  id: string;
  name: string;
  categoryId: string;
  color: string;
  file: FileType;
};

export type AssetTypeType = {
  id: string;
  name: string;
  categoryId: string;
  category: AssetCategoryType;
};

export type GroupType = {
  id: string;
  name: string;
  creator: UserType;
  category: AssetCategoryType;
  type: AssetTypeType;
  objectCount: number;
};

export type NewAssetType = {
  name?: string;
  categoryId?: string;
  typeId?: string;
  props?: any;
  buildingId: string;
  model: 'model';
  manufacturer: 'manufacturer';
  installDate: '2023-11-06T12:43:31.143Z';
  isCritical: false;
  laborValue: 1;
  cost: 1;
  serialNumber: 'number';
};

export type DBType = {
  activationcode: {[key: string]: any};
  user: {[key: string]: any};
  usercredential: {[key: string]: any};
  customer: {[key: string]: any};
  building: {[key: string]: any};
  floor: {[key: string]: any};
  room: {[key: string]: any};
  buildingfile: {[key: string]: any};
  userfile: {[key: string]: any};
  note: {[key: string]: any};
  region: {[key: string]: any};
  customermodule: {[key: string]: any};
  utilitiesorinsurance: {[key: string]: any};
  notefile: {[key: string]: any};
  asset: {[key: string]: any};
  assetfile: {[key: string]: any};
  assetcategory: {[key: string]: any};
  assetprops: {[key: string]: any};
  assettypes: {[key: string]: any};
  assettypesprops: {[key: string]: any};
  assetpropsdata: {[key: string]: any};
  plan: {[key: string]: any};
  assetplans: {[key: string]: any};
  alertmessage: {[key: string]: any};
  supportsticker: {[key: string]: any};
  contact: {[key: string]: any};
  subcontractor: {[key: string]: any};
  plantypes: {[key: string]: any};
  buckettechnician: {[key: string]: any};
  workorder: {[key: string]: any};
  bucket: {[key: string]: any};
  workorderfile: {[key: string]: any};
  workordertechnician: {[key: string]: any};
  vendor: {[key: string]: any};
  inventoryitem: {[key: string]: any};
  inventory: {[key: string]: any};
  inventorypart: {[key: string]: any};
  transfer: {[key: string]: any};
  transferworkorder: {[key: string]: any};
  purchase: {[key: string]: any};
  emergencyprocedure: {[key: string]: any};
  userabilitysettings: {[key: string]: any};
  workorderplan: {[key: string]: any};
  emergencyplan: {[key: string]: any};
  emergencycontac: {[key: string]: any};
  econtactcontact: {[key: string]: any};
  econtactbuilding: {[key: string]: any};
  econtactregion: {[key: string]: any};
  econtactplan: {[key: string]: any};
  news: {[key: string]: any};
  notification: {[key: string]: any};
  appfile: {[key: string]: any};
  afarfloor: {[key: string]: any};
  affectedasset: {[key: string]: any};
  afarroom: {[key: string]: any};
  affectedarea: {[key: string]: any};
  afasasset: {[key: string]: any};
  eprocedureeplan: {[key: string]: any};
  points: {[key: string]: any};
  module: {[key: string]: any};
  pdfdocumentsmodel: {[key: string]: any};
  askforassistance: {[key: string]: any};
  assistancetechnician: {[key: string]: any};
  assetpropsanswer: {[key: string]: any};
  usernotificationsettings: {[key: string]: any};
  preferredassetcontractor: {[key: string]: any};
  roompoints: {[key: string]: any};
  assetaffectedarea: {[key: string]: any};
  assetaffectedareafloor: {[key: string]: any};
  assetaffectedarearoom: {[key: string]: any};
  subcontractorresponsibilities: {[key: string]: any};
  history: {[key: string]: any};
  bucketassettypes: {[key: string]: any};
  assignmentfolder: {[key: string]: any};
  assignmentpanel: {[key: string]: any};
  afarasset: {[key: string]: any};
  emergencyreport: {[key: string]: any};
  ereportasset: {[key: string]: any};
  ereportassetcategory: {[key: string]: any};
  eplansubcontractor: {[key: string]: any};
  ereporteprocedure: {[key: string]: any};
  ereportsubcontractor: {[key: string]: any};
  views: {[key: string]: any};
  viewsuser: {[key: string]: any};
  file: {[key: string]: any};
  verification: {[key: string]: any};
  workorderasset: {[key: string]: any};
  workorderbucket: {[key: string]: any};
  workorderstatuses: {[key: string]: any};
};

export type PointType = {
  id: string;
  fromId?: string;
  fromX?: number;
  fromY?: number;
  toId?: string;
  toX?: number;
  toY?: number;
  pageId: string;
  from?: any;
  to?: any;
};
