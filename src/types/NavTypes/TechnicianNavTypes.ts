import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type ParamList = {
  WorkOrdersTab: NavigatorScreenParams<WorksOrdersParamList>;
  MapTab: NavigatorScreenParams<MapTabParamList>;
  EmergencyTab: NavigatorScreenParams<EmergencyParamList>;
  MenuTab: NavigatorScreenParams<MenuParamList>;
  QR: undefined;
};
export type MenuParamList = {
  ContactsScreen: NavigatorScreenParams<ContactsParamList>;
  Notifications: undefined;
  Settings: NavigatorScreenParams<SettingsParamList>;
  Dashboard: undefined;
  WorkOrder: {id: string};
  WorkOrderInstruction: undefined;
  CloseWorkOrder: {id: string; title?: string};
  AddNewSubcontractor: undefined;
  CreateWorkOrder: {assetId: string} | undefined;
  RootAssets: NavigatorScreenParams<AssetsParamList>;
  Asset: {id: string};
  Buildings: NavigatorScreenParams<BuildingsParamList>;
  Building: {id: string};
  AddPlan: undefined;
  ContactInfo: {userId: string};
  RoomDetailsScreen: {roomId: string; getRooms?: () => void};
};

export type WorksOrdersParamList = {
  WorkOrders: undefined;
  WorkOrder: {id: string};
  WorkOrderInstruction: undefined;
  CloseWorkOrder: {id: string; title?: string};
  AddNewSubcontractor: undefined;
  CreateWorkOrder: {assetId: string} | undefined;
  Asset: {id: string};
  ContactInfo: {userId: string};
};

export type BuildingsParamList = {
  Buildings: undefined;
  BuildingInfo: {id: string};
  WorkOrder: {id: string};
  WorkOrderInstruction: undefined;
  CloseWorkOrder: {id: string; title?: string};
  AddNewSubcontractor: undefined;
  CreateWorkOrder: {assetId: string} | undefined;
  Asset: {id: string};
  ContactInfo: {userId: string};
  RoomDetailsScreen: {roomId: string; getRooms?: () => void};
};

export type AssetsParamList = {
  Assets: undefined;
  WorkOrder: {id: string};
  WorkOrderInstruction: undefined;
  CloseWorkOrder: {id: string; title?: string};
  AddNewSubcontractor: undefined;
  CreateWorkOrder: {assetId: string} | undefined;
  Asset: {id: string};
  ContactInfo: {userId: string};
  AddAsset: undefined;
};

export type MapTabParamList = {
  Map: undefined;
  Building: {id: string};
  AddAsset: {planId: string};
  AddPlan: undefined;
  WorkOrder: {id: string};
  WorkOrderInstruction: undefined;
  CloseWorkOrder: {id: string; title?: string};
  AddNewSubcontractor: undefined;
  CreateWorkOrder: {assetId: string} | undefined;
  Asset: {id: string};
  ContactInfo: {userId: string};
};

export type EmergencyParamList = {
  EmergencyTabScreen: undefined;
  EmergencyReport: NavigatorScreenParams<EmergencyReportParamList>;
  EmergencyPlans: {tab?: string};
  EmergencyPlan: {id: string};
  CreateEmergency: NavigatorScreenParams<CreateEmergencyParamList>;
  WorkOrder: {id: string};
  WorkOrderInstruction: undefined;
  CloseWorkOrder: {id: string; title?: string};
  AddNewSubcontractor: undefined;
  CreateWorkOrder: {assetId: string} | undefined;
  Asset: {id: string};
  ContactInfo: {userId: string};
};

export type EmergencyReportParamList = {
  EmergencyReportStep1: undefined;
  EmergencyReportStep2: undefined;
  EmergencyReportStep3: undefined;
};

export type CreateEmergencyParamList = {
  CreateEmergencyStep1: undefined;
  CreateEmergencyStep2: undefined;
  CreateEmergencyStep3: undefined;
  CreateEmergencyStep4: undefined;
  CreateEmergencyStep5: undefined;
  CreateEmergencyStep6: undefined;
};

export type ContactsParamList = {
  Contacts: undefined;
  ContactInfo: {userId: string};
};

export type SettingsParamList = {
  ProfileInfo: undefined;
  PrivacySetting: undefined;
  UpdatePassword: undefined;
  CreateNewPassword: {email: string};
  NotificationSettings: undefined;
};

export type CreateWorkOrderProps = NativeStackScreenProps<
  WorksOrdersParamList,
  'CreateWorkOrder'
>;
export type WorksOrdersProps = NativeStackScreenProps<
  WorksOrdersParamList,
  'WorkOrder'
>;
export type CloseWorksOrdersProps = NativeStackScreenProps<
  WorksOrdersParamList,
  'CloseWorkOrder'
>;
export type BuildingInfoProps = NativeStackScreenProps<
  MapTabParamList,
  'Building'
>;

export type ContactInfoProps = NativeStackScreenProps<
  ContactsParamList,
  'ContactInfo'
>;

export type AddAssetProps = NativeStackScreenProps<MapTabParamList, 'AddAsset'>;

export type AssetProps = NativeStackScreenProps<AssetsParamList, 'Asset'>;

export type CreateNewPasswordProps = NativeStackScreenProps<
  SettingsParamList,
  'CreateNewPassword'
>;

export type EmergencyReportStep1Props = NativeStackScreenProps<
  EmergencyReportParamList,
  'EmergencyReportStep1'
>;
export type EmergencyReportStep2Props = NativeStackScreenProps<
  EmergencyReportParamList,
  'EmergencyReportStep2'
>;
export type EmergencyReportStep3Props = NativeStackScreenProps<
  EmergencyReportParamList,
  'EmergencyReportStep3'
>;

export type EmergencyProps = NativeStackScreenProps<ParamList, 'EmergencyTab'>;
export type AddNewAssetProps = NativeStackScreenProps<
  AssetsParamList,
  'AddAsset'
>;

export type RoomDetailsScreenProps = NativeStackScreenProps<
  BuildingsParamList,
  'RoomDetailsScreen'
>;
