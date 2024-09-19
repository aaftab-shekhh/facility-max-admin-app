import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {EmergencyReportParamList, ParamList} from './TechnicianNavTypes';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthParamList>;
  Main: NavigatorScreenParams<MainParamList>;
  QR: NavigatorScreenParams<QRParamList>;
  Plan: NavigatorScreenParams<PlanParamList>;
  Notifications: undefined;
};

export type AuthParamList = {
  Login: undefined;
  Forgot: undefined;
  Verification: {email: string; password: string; type?: number};
  Password: {email: string; verificationCode: number};
  Restored: undefined;
};

export type QRParamList = {
  Scaner: undefined;
  Successfully: {id: string};
  WorkOrder: {id: string};
  WorkOrderInstruction: undefined;
  CloseWorkOrder: {id: string; title?: string};
  AddNewSubcontractor: undefined;
  CreateWorkOrder: {assetId: string} | undefined;
  Asset: {id: string; tab?: string};
  ContactInfo: {userId: string};
  EmergencyReport: NavigatorScreenParams<EmergencyReportParamList>;
  RoomDetailsScreen: {roomId: string; getRooms?: () => void};
};

export type PlanParamList = {
  PDFPlan: undefined;
  WorkOrder: {id: string};
  WorkOrderInstruction: undefined;
  CloseWorkOrder: {id: string; title?: string};
  AddNewSubcontractor: undefined;
  CreateWorkOrder: {assetId: string};
  AddAsset: {planId: string};
  Asset: {id: string};
  ContactInfo: {userId: string};
  ReplaceAsset: {assetId: string};
  RoomDetailsScreen: {roomId: string; getRooms?: () => void};
};

export type MainParamList = {
  TECHNICIAN: NavigatorScreenParams<ParamList>;
};

export type VerificationProps = NativeStackScreenProps<
  AuthParamList,
  'Verification'
>;

export type PasswordProps = NativeStackScreenProps<AuthParamList, 'Password'>;
export type PlanScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Plan'
>;
export type WorkOrderProps = NativeStackScreenProps<PlanParamList, 'WorkOrder'>;
export type AssetProps = NativeStackScreenProps<
  PlanParamList | QRParamList,
  'Asset'
>;
export type AddAssetProps = NativeStackScreenProps<PlanParamList, 'AddAsset'>;
export type ReplaceAssetProps = NativeStackScreenProps<
  PlanParamList,
  'ReplaceAsset'
>;
