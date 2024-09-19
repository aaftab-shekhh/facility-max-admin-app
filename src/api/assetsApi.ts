import {CreateAssetForm} from '../types/FormTypes';
import {NewAssetType} from '../types/StateType';
import {GetAssetsByAntityParams} from './ApiTypes';
import {instance, instanceFile} from './instances';

export const assetsAPI = {
  getAssetCategoriesList(params: {offset?: number; limit?: number}) {
    return instance.get('asset/category/many', {params});
  },

  getTypesAssets(params: {
    buildingId?: string;
    categoryIdes?: string[];
    offset?: number;
    limit?: number;
    variant?: string;
  }) {
    return instance.get('asset/type/many/', {params});
  },

  getPropsByAssetTypeId(params: {typeId: string}) {
    return instance.get('asset/props/many', {params});
  },

  createAsset(body: NewAssetType) {
    return instance.post('asset', body);
  },

  createAssetObject(body: {
    typeId: string;
    qty: number;
    name: string;
    pageId: string;
    objectGroupId?: string;
  }) {
    return instance.post('objects', body);
  },

  updateAsset(params: {assetId: string; body: any}) {
    const body = params.body;
    return instance.put(`asset/${params.assetId}`, body);
  },

  updateGroup(data: {objectGroupId: string; name: string}) {
    const body = {name: data.name};
    return instance.patch(`objects/${data.objectGroupId}`, body);
  },

  getCategoriesAssets(params: {
    offset?: number;
    limit?: number;
    buildingId?: string;
    regionIdes?: string[];
  }) {
    return instance.get('asset/category/many', {params});
  },

  getDataFilters(params: {
    type: string;
    data?: {offset?: number; limit?: number; searchString?: string};
  }) {
    return instance.get('asset/everything', {params});
  },

  getAssetById(data: {assetId: string; params: any}) {
    const params = data.params;
    return instance.get(`asset/${data.assetId}`, {params});
  },

  getAssetsByAntity(params: GetAssetsByAntityParams) {
    return instance.get('asset/by-entity', {params});
  },

  getAssetFiles(data: {id: string; params: {getKey: string}}) {
    const params = data.params;
    const id = data.id;
    return instance.get(`asset/files/many/${id}`, {
      params,
    });
  },

  addAssetFiles(data: {id: string; body: any}) {
    const body = data.body;
    const id = data.id;
    return instanceFile.post(`asset/files/${id}`, body);
  },

  getCountAssignedAssets(pageId: string, categoryId: string) {
    return instance.get(`asset/category/count/${pageId}/${categoryId}`);
  },

  getAssets(params: any) {
    return instance.get('assets/get-asset-by-category', {params});
  },

  getUnassignedAssetsByPlanId(planId: string) {
    return instance.get(`assets/get-unassigned-assets-by-plan-id/${planId}`);
  },

  getAssignedAssetsByPlanId(planId: string) {
    return instance.get(`asset/points/pages/${planId}`);
  },

  getPointsByPlanId(data: {pageId: string; params: any}) {
    const params = data.params;
    return instance.get(`asset/points/${data.pageId}`, {params});
  },

  getObjectPointsByPlanId(data: {pageId: string; params: any}) {
    const params = data.params;
    return instance.get(`objects/points/${data.pageId}`, {params});
  },

  getObjectGroups(params: {
    offset?: number;
    limit?: number;
    typeId?: string;
    categoryId?: string;
    searchString?: string;
    pageIdes?: string[];
    isIncludeCounts?: boolean;
  }) {
    return instance.get('objects/groups/many', {params});
  },

  getAssetObjects(params: {
    offset?: number;
    limit?: number;
    typeId?: string;
    categoryId?: string;
    searchString?: string;
    pageIdes?: string[];
    isIncludeCounts?: boolean;
    objectGroupId?: string;
  }) {
    return instance.get('objects/many', {params});
  },

  createPoints(data: {
    body: {
      fromId?: string;
      fromX?: number;
      fromY?: number;
      toId?: string;
      toX?: number;
      toY?: number;
      pageId: string;
    };
    route: string;
  }) {
    const body = data.body;
    return instance.post(`${data.route}/points`, body);
  },

  getAssetPagesByAssetId(assetId: string) {
    return instance.get(`asset/points/pages/${assetId}`);
  },

  getAssetFeds(data: {id: string; params: {fedType: string}}) {
    const params = data.params;
    return instance.get(`asset/fed-from/${data.id}`, {params});
  },

  getAssetAffectedAreaByAssetId(assetId: string) {
    return instance.get(`asset/affected-area/many/${assetId}`);
  },

  getAssetAffectedArea(id: string) {
    return instance.get(`/asset/affected-area/${id}`);
  },

  updatePoints(params: {
    pointId: string;
    body: {
      fromId?: string;
      fromX?: number;
      fromY?: number;
      toId?: string;
      toX?: number;
      toY?: number;
    };
  }) {
    const body = params.body;
    return instance.patch(`asset/points/${params.pointId}`, body);
  },

  updateObjectPoints(params: {
    pointId: string;
    body: {
      fromId?: string;
      fromX?: number;
      fromY?: number;
      toId?: string;
      toX?: number;
      toY?: number;
    };
  }) {
    const body = params.body;
    return instance.patch(`objects/points/${params.pointId}`, body);
  },

  deletePoints(params: {pageId: string; fromId: string}) {
    return instance.delete(
      `asset/points/${params.pageId}/${params.fromId}`,
    );
  },

  deleteObjectPoints(params: {pageId: string; fromId: string}) {
    return instance.delete(
      `objects/points/${params.pageId}/${params.fromId}`,
    );
  },

  deleteObjectOrGroup(objectIdOrObjectGroupId: string) {
    return instance.delete(`objects/${objectIdOrObjectGroupId}`);
  },

  deleteAsset(id: string) {
    return instance.delete(`asset/${id}`);
  },

  createQR(body: {url: string}) {
    return instance.post('qr-code', body);
  },

  getFolders(assetId: string) {
    return instance.get(`asset/assignment-folder/many/${assetId}`);
  },

  createFolder(body: {
    assetId: string;
    name: string;
    maxNumberOfAssignments: number;
    isCreateEmptyPanels?: boolean;
  }) {
    return instance.post('asset/assignment-folder/', body);
  },

  updateFolder(
    body: {
      name: string;
      maxNumberOfAssignments: number;
      isCreateEmptyPanels?: boolean;
    },
    folderId: string,
  ) {
    return instance.put('asset/assignment-folder/' + folderId, body);
  },

  updateAssetAvatar(assetId: string, body: FormData) {
    return instanceFile.post(`asset/files/avatar/${assetId}`, body);
  },

  deleteFolder(id: string) {
    return instance.delete(`asset/assignment-folder/${id}`);
  },

  getPanels(folderId: string) {
    return instance.get(`asset/assignment-panel/many/${folderId}`);
  },

  updatePanel(data: {id: string; body: {[key: string]: string[]}}) {
    const body = data.body;
    return instance.put(`asset/assignment-panel/${data.id}`, body);
  },

  createPanel(data: {id: string; body: {[key: string]: string}}) {
    const body = data.body;
    body.folderId = data.id;
    return instance.post('asset/assignment-panel', body);
  },

  replaceAsset(
    assetId: string,
    body: {
      isDestroyAsset?: boolean;
      isRetainFiles?: boolean;
      isRetainPreferredContractors?: boolean;
      isRetainRelationships?: boolean;
      itemId?: string;
      name?: string;
      serialNumber?: string;
      assetId?: string;
      newAsset?: CreateAssetForm;
    },
  ) {
    return instance.post(`asset/replace/${assetId}`, body);
  },
};
