import {instance} from './instances';

export const historyAPI = {
  getHistory(params: {searchString: string[]}) {
    return instance.get('history/many', {
      params,
    });
  },
};
