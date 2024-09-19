import {instance} from './instances';

export const fileAPI = {
  renameFile(params: {id: string; name: string}) {
    const body = {
      name: params.name,
    };
    return instance.patch(`file/${params.id}`, body);
  },
  deleteFile(id: string) {
    return instance.delete(`file/${id}`);
  },
};
