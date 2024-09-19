import {SearchParamsType} from '../types/StateType';

export const getActualSearchParams = (
  searchParams: URLSearchParams,
): SearchParamsType => {
  return {
    serviceType: searchParams.get('serviceType') || undefined,
    wotype: searchParams.get('wotype') || undefined,
    keyword: searchParams.get('keyword') || undefined,
    date: searchParams.get('date') || undefined,
  };
};
