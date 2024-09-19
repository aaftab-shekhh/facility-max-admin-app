import {instance} from './instances';

export const offlineAPI = {
  getModels() {
    return instance.get('offline/available-models');
  },
  getArhive(params: {modelName: string}) {
    return instance.get('offline/archive', {params});
  },
};
