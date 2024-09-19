import {instance, instanceFile} from './instances';

export const emergencyAPI = {
  getEmergencyContacts(params: any) {
    return instance.get('emergency-contacts/search', {
      params,
    });
  },

  getEmergencyContactsMany(params: {
    key: string;
    searchById: string;
    offset?: number;
    limit?: number;
  }) {
    return instance.get('emergency-contacts/many', {
      params,
    });
  },

  getEmergencyPlans(params: any) {
    return instance.get('emergency-plan/search', {
      params,
    });
  },

  getEmergencyReportPlans(params: {status: string}) {
    return instance.get('emergency-report/plans', {
      params,
    });
  },

  getReportContacts() {
    return instance.get('emergency-report/contacts');
  },

  getReportProcedures(params?: {id?: string}) {
    return instance.get('emergency-report/procedures', {params});
  },

  getEmergencyPlanById(params: {id?: string}) {
    return instance.get('emergency-plan', {params});
  },

  attachContact(body: {subcontractorId: string; emergencyPlanId: string}) {
    return instance.put('subcontractor/add-emergency-plan', body);
  },

  detachContact(body: {subcontractorId: string; emergencyPlanId: string}) {
    return instance.put('subcontractor/detach-emergency-plan', body);
  },

  getMyUnfilled() {
    return instance.get('emergency-plan/my-unfilled');
  },

  incrementLevel(body: {id: string}) {
    return instance.put('emergency-plan/increment-level', body);
  },

  decrementLevel(body: {id: string}) {
    return instance.put('emergency-plan/decrement-level', body);
  },

  createOrUpdateEmergencyPlan(body: {id?: string; scenario: string}) {
    return instance.post('emergency-plan', body);
  },

  updateNewPlanStep2(body: {id: string; name: string; description?: string}) {
    return instance.put('emergency-plan/name-description', body);
  },

  getAffectedAreas(params: {emergencyPlanId: string}) {
    return instance.get('emergency/affected-area/many', {params});
  },

  getAffectedArea(params: {id: string}) {
    return instance.get('emergency/affected-area', {params});
  },

  createOrUpdateAffectedAreaEmergencyPlan(body: {
    buildingId?: string;
    id?: string;
    emergencyPlanId?: string;
  }) {
    return instance.post('emergency/affected-area', body);
  },

  deleteAffectedArea(params: {id?: string; emergencyPlanId: string}) {
    return instance.delete('emergency/affected-area', {params});
  },

  getAffectedAssets(params: {emergencyPlanId: string}) {
    return instance.get('emergency/affected-asset/many', {params});
  },

  affectedAreaAddFloor(body: {floorId: string; affectedAreaId: string}) {
    return instance.put('emergency/affected-area/add-floor', body);
  },

  affectedAreaDetachFloor(body: {floorId: string; affectedAreaId: string}) {
    return instance.put('emergency/affected-area/detach-floor', body);
  },

  affectedAreaAddRoom(body: {roomId: string; affectedAreaId: string}) {
    return instance.put('emergency/affected-area/add-room', body);
  },

  affectedAreaDetachRoom(body: {roomId: string; affectedAreaId: string}) {
    return instance.put('emergency/affected-area/detach-room', body);
  },

  createOrUpdateAffectedAssetEmergencyPlan(body: {
    assetCategoryId?: string;
    id?: string;
    emergencyPlanId?: string;
  }) {
    return instance.post('affected-asset', body);
  },

  affectedAreaAddAsset(body: {affectedAreaId: string; assetId: string}) {
    return instance.put('emergency/affected-area/add-asset', body);
  },

  affectedAreaDetachAsset(body: {affectedAreaId: string; assetId: string}) {
    return instance.put('emergency/affected-area/detach-asset', body);
  },

  deleteAffectedAsset(params: {id?: string}) {
    return instance.delete('affected-asset', {params});
  },

  getProcedures(params: {type?: string; emergencyPlanId?: string}) {
    return instance.get('emergency-procedure/many', {params});
  },

  createProcedure(body: any) {
    return instanceFile.post('emergency-procedure', body);
  },

  attachProcedureForEmergencyPlan(body: {
    emergencyPlanId?: string;
    fileId?: string;
  }) {
    return instance.post('emergency-procedure/add-to-emergency-plan', body);
  },

  detachProcedureForEmergencyPlan(body: {
    fileId: string;
    emergencyPlanId: string;
  }) {
    return instance.put(
      'emergency-procedure/delete-from-emergency-plan',
      body,
    );
  },

  deleteProcedure(id: string) {
    return instance.delete(`emergency-procedure/${id}`);
  },

  updateFrequency(body: {
    frequency: string | null;
    frequencyStartDate: string | null;
    id: string;
  }) {
    return instance.put('emergency-plan/frequency', body);
  },

  getMyUnfilledRepor() {
    return instance.get('emergency-report/my-unfilled');
  },

  createOrUpdateEmergencyReport(body: {scenario: string}) {
    return instance.post('emergency-report', body);
  },

  incrementDecrementReport(body: {type: string}) {
    return instance.put('emergency-report/increment-decrement', body);
  },

  changeReportRegion(body: {regionId?: string}) {
    return instance.put('emergency-report/change-region', body);
  },

  changeReportBuilding(body: {buildingId?: string}) {
    return instance.put('emergency-report/change-building', body);
  },

  changeReportFloor(body: {floorId?: string}) {
    return instance.put('emergency-report/change-floor', body);
  },

  changeReportRoom(body: {roomId?: string}) {
    return instance.put('emergency-report/change-room', body);
  },

  getReportAssetCategories() {
    return instance.get('emergency-report/asset-categories');
  },

  getReportAssets() {
    return instance.get('emergency-report/assets');
  },

  addOrDeleteAssetCategories(params: {
    action: string;
    body: {categoryId: string};
  }) {
    const body = params.body;
    return instance.put(`emergency-report/${params.action}-category`, body);
  },

  addOrDeleteAsset(params: {action: string; body: {assetId: string}}) {
    const body = params.body;
    return instance.put(`emergency-report/${params.action}-asset`, body);
  },

  changeTitleDescription(body: {title?: string; description?: string}) {
    return instance.put('emergency-report/change-title-description', body);
  },

  fillContactsAndProcedures() {
    return instance.post('emergency-report/fill-contacts-and-procedures');
  },
  autoGenerateReport(assetId: string) {
    return instance.post(
      `emergency-report/auto-generate-report/${assetId}`,
    );
  },
};
