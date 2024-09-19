export type UpdateUserType = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  title?: string;
  region?: string;
  isTenant?: boolean;
  userId: string;
};
export type GetBuildingsParams = {
  keyWord?: string;
  customerId?: string;
  minLat?: number;
  maxLat?: number;
  minLong?: number;
  maxLong?: number;
  keySearchValue?: string;
};

export type GetFloorsParams = {
  sortField: string;
  sortDirection: string;
  size: number;
  page: number;
  buildingId: string;
  keySearchValue?: string;
};
export type GetRoomsParams = {
  sortField: string;
  sortDirection: string;
  size?: number;
  page?: number;
  floorIdes?: string[];
  buildingId?: string;
  keySearchValue?: string;
  isAmenity?: boolean;
};

export type GetPlansParams = {
  offset: number;
  limit: number;
  planTypeId?: string;
  floorId: string;
};

export type GetAssetsByAntityParams = {
  sortField: string;
  sortDirection: string;
  categoryIdes?: string[];
  typeIdes?: string[];
  buildingIdes?: string[];
  floorIdes?: string[];
  roomIdes?: string[];
  regionIdes?: string[];
  includeCriteria?: string[];
  attributeCriteria?: string[];
  assignedForPageId?: string;
  offset?: number;
  limit?: number;
  searchString?: string | null;
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
  hasInventory?: boolean;
  isCritical?: boolean;
  hasPlans?: boolean;
  isArhived?: boolean;
  lastServiceDate?: string;
  installDate?: string;
  maxCost?: number;
  minCost?: number;
};

export type UpdateBuildingType = {
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
  contactId?: number;
  buidingAccessInformation?: string;
  yearBuilt?: number;
  regionId?: string;
  buildingId: string;
  endUpdate?: () => void;
};

export type GetWOsParams = {
  isDayCalendar?: boolean;
  customerId?: string;
  buildingId?: string;
  assetId?: string[];
  startDate?: string;
  endDate?: string;
  byCreator?: boolean;
  roomId?: string;
  keySearchValue?: string;
  offset?: number;
  limit?: number;
  priority?: string[];
  types?: string[];
  subType?: string[];
  showPM?: boolean;
  onlyMyWO?: boolean;
  statuses?: string[];
  byBucket?: boolean;
  regionId?: string;
  attributeCriteria?: string[];
  includeCriteria?: string[];
};

export type UpdateWOTechBodyType = {
  workOrderId: string;
  technicianId: string;
  estimatedLaborHoursTech?: string;
  hoursSpentTech: string;
  expectedCompletionDateTech?: string;
  startDateTech: string;
  endDateTech: string;
  noteText?: string;
  noteFiles?: any;
};
