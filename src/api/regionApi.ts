import {instance} from './instances';

export const regionAPI = {
  getRegionsByCustomerId(params: any) {
    return instance.get('regions/get-regions-by-customer-id', {params});
  },
};
