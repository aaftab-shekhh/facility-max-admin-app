import {instance, instanceFile} from './instances';

export const subcontractorsAPI = {
  getSubcontractors(params: any) {
    return instance.get('subcontractor/get-subcontractors-list', {params});
  },

  getSubcontractorById(params: {subcontractorId: string}) {
    return instance.get('subcontractor/get-subcontractor-by-id', {params});
  },

  createSubcontractor(body: any) {
    return instanceFile.post('subcontractor/create-subcontractor', body);
  },

  getSubcontractorsByAssetId(params: {
    assetId: string;
    page?: number;
    size?: number;
  }) {
    return instance.get(
      'subcontractor/get-asset-preferred-contractor-list',
      {
        params,
      },
    );
  },
};
