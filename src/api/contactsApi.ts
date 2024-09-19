import {instance} from './instances';

export const contactsAPI = {
  getContacts(params: {link: string}) {
    return instance.get('contacts/v2/many', {params});
  },
  getBucketsContact(params: {userId: string; page: number; size: number}) {
    return instance.get('bucket/get-buckets-by-user-id', {params});
  },
};
