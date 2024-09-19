import {instance} from './instances';

export const objectGroupsAPI = {
  getManyGroups(params: any) {
    return instance.get('objects/groups/many', {params});
  },
};
