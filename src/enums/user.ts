export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  REQUESTOR = 'REQUESTOR',
  TECHNICIAN = 'TECHNICIAN',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum UserType {
  MANAGER = 'manager',
  EMERGENCY = 'emergency',
  MAIN = 'main',
}

export enum enumAdminNotificationSettings {
  NEW_BUILDING = 'adminBuildingNew',
  NEW_TENNANT_ADDED = 'adminBuildingTenantAssign',
  NEW_INSURANCE = 'adminBuildingNewInsuranceUtility',
  NEW_TENANT_LEAS = 'adminNewLease',
  TENANT_RELOCATION = 'adminTenantRelocated',
  CANCELLED_LEASE = 'adminLeaseExpiredOrCancelled',
  LEASE_RENEWALS = 'adminLeaseUpdated',
  WO_CREATED = 'adminWoNew',
  WO_COMPLETION = 'adminWoCompleted',
  WO_OVERDUE = 'adminWoOverdue',
  WO_NOT_OPENED = 'adminWoNotOpened',
  PM_COMPLETION = 'adminPmCompleted',
  PM_OVERDUE = 'adminPmOverDue',
  INVENTORY_LOW_STOCK = 'adminInventoryLowStock',
  INVENTORY_RE_ORDER = 'adminInventoryReOrder',
  INVENTORY_PURCHASE_REQUEST = 'adminInventoryPurchaseRequest',
  INVENTORY_PARTS_TRANSFERS = 'adminInventoryTransferInit',
}

export enum enumSupervisirNotificationSettings {
  NEW_BUILDING = 'superBuildingNew',
  BUILDING_NEW_PLAN_ADDED = 'superBuildingNewPlan',
  BUILDING_NEW_TENNANT_ADDED = 'superBuildingTenantAssign',
  BUILDING_NEW_DOCUMENT_ADDED = 'BUILDING_NEW_DOCUMENT_ADDED', //TODO
  BUILDING_TENANT_RELOCATIONS = 'superTenantRelocated',
  WO_CREATED = 'superWoNew',
  WO_STATUS_CHANGED = 'superWoStatusChanged',
  WO_PARTS_ORDERED = 'superInventoryReOrder',
  ASSET_IMPORTS = 'superAssetsImported',
  PM_COMPLETION = 'superPmCompleted',
  INVENTORY_LOW_STOCK = 'superInventoryLowStock',
  INVENTORY_RE_ORDER = 'superInventoryReOrder',
  SUPPORT_NEW_DOCUMENT = 'superSupportNewDoc',
}
