import {instance} from './instances';

export const inventoriesAPI = {
  getInventories(params: {
    limit?: number;
    offset?: number;
    typeIdes?: string[];
    status?: string;
    allocatedToWorkOrderId?: string;
  }) {
    return instance.get('inventory/item/many', {params});
  },
  allocateWO(itemId: string, body: {workOrderId: string}) {
    return instance.patch(`inventory/item/allocate-for-wo/${itemId}`, body);
  },
  setAvailable(itemId: string, body: {reason?: string}) {
    return instance.patch(`inventory/item/set-available/${itemId}`, body);
  },
};
