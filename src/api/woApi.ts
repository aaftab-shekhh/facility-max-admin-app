import {GetWOsParams} from './ApiTypes';
import {instance, instanceFile} from './instances';

export const woAPI = {
  getWorkOrders(params: GetWOsParams) {
    return instance.get('workOrders/get-workOrder-list', {params});
  },

  getWorkOrdersMany(params: GetWOsParams) {
    return instance.get('workOrders/get-many', {params});
  },

  getWorkOrdersForCalendar(params: GetWOsParams) {
    return instance.get('workOrders/get-workOrder-list-for-calendar', {
      params,
    });
  },

  getWOTech(params: {workOrderId: string; offset?: number; limit?: number}) {
    return instance.get('workOrders/get-workOrder-tech', {
      params,
    });
  },

  getWObyCoordinates(params: {
    customerId?: string;
    minLat?: number;
    maxLat?: number;
    minLong?: number;
    maxLong?: number;
  }) {
    return instance.get('workOrders/get-workOrder-list-by-coordinates', {
      params,
    });
  },

  getWObyId(params: {workOrderId: string}) {
    return instance.get('workOrders/get-workOrder-by-id', {
      params,
    });
  },

  getBucketsList(params: {
    customerId: string;
    sortField: string;
    sortDirection: string;
    regionIds?: string[];
    page: number;
    size: number;
  }) {
    return instance.get('bucket/get-buckets-list', {
      params,
    });
  },

  createWO(data: any) {
    return instanceFile.post('workOrders/create-workOrder', data);
  },

  getWODetails(id: string) {
    return instance.get(`workOrders/get-work-order-details/${id}`);
  },

  sendWODetails(id: string, body: FormData) {
    return instanceFile.post(
      `workOrders/send-work-order-details/${id}`,
      body,
    );
  },

  updateWO(body: any) {
    return instanceFile.patch('workOrders/update-workOrder', body);
  },

  updateWOTech(body: FormData) {
    return instanceFile.patch(
      'workOrders/update-workOrder-technician',
      body,
    );
  },

  addBucketToWO(body: {bucketsId: string[]; workOrderId: string}) {
    return instance.post('workOrders/add-bucket-to-workOrder', body);
  },

  deleteBucketFromWO(params: {bucketId: string; workOrderId: string}) {
    return instance.delete('workOrders/delete-bucket-from-workOrder', {
      params,
    });
  },

  deleteTechnicianFromWO(params: {technicianId: string; workOrderId: string}) {
    return instance.delete('workOrders/delete-technician-from-workOrder', {
      params,
    });
  },

  deleteEntitiesFromWO(body: {
    workOrderId: string;
    roomId?: null;
    floorId?: null;
    subcontractorId?: null;
  }) {
    return instance.patch(
      'workOrders/delete-entities-from-workOrder',
      body,
    );
  },

  startWork(body: {
    workOrderId: string;
    estimatedLaborHoursTech?: number | null;
    expectedCompletionDateTech?: string;
  }) {
    return instance.post('workOrders/join-to-workOrder', body);
  },

  getWOFileCounts(params: {workOrderId: string}) {
    return instance.get('workOrders/files/get-workOrder-files-count', {
      params,
    });
  },

  getWOFiles(params: {
    workOrderId: string;
    offset?: string;
    limit?: string;
    fileKey?: string;
  }) {
    return instance.get('workOrders/files/get-workOrder-files', {params});
  },

  getWOPlans(params: {workOrderId: string; offset?: string; limit?: string}) {
    return instance.get('workOrder/get-workOrder-plans', {params});
  },

  addWOFile(body: any) {
    return instance.post('workOrders/files/create-workOrder-file', body);
  },

  addAsset(body: {assetsId: string[]; workOrderId: string}) {
    return instance.post('workOrders/add-asset-to-workOrder', body);
  },

  deleteAsset(params: {assetId: string; workOrderId: string}) {
    return instance.delete('workOrders/delete-asset-from-workOrder', {
      params,
    });
  },

  deleteWorkOrderFile(params: {id: string}) {
    return instance.delete('workOrders/files/delete-workOrder-file', {
      params,
    });
  },
};
