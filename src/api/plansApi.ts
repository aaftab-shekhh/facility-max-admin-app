import {instance, instanceFile} from './instances';
import {GetPlansParams} from './ApiTypes';

export const plansAPI = {
  getPlanTypes() {
    return instance.get('plans/plan-types');
  },

  getPlanById(planId: string) {
    return instance.get(`plan/${planId}`);
  },

  getPageById(pageId: string) {
    return instance.get(`plan/page/${pageId}`);
  },

  getPlans(params: GetPlansParams) {
    return instance.get('plan/by-plan-type', {params});
  },

  getPlanPages(planId: string, params: {version?: number}) {
    return instance.get(`plan/document-by-rootId/${planId}`, {params});
  },

  createPlan(data: FormData) {
    return instanceFile.post('plan', data);
  },

  editPlan(body: any) {
    return instance.patch('plan/rename', body);
  },

  deletePlan(id: string) {
    return instance.delete(`plans/delete-plan/${id}`);
  },

  getRoomsByPageId(pageId: string, params: any) {
    return instance.get(`/room/point/v2/with-rooms/${pageId}`, {params});
  },

  deleteRoomsFromPage(pageId: string, pointId: string) {
    return instance.delete(`/room/point/${pageId}/${pointId}`);
  },

  saveStagesByPageId(pageId: string) {
    return instance.post(`/plan/page/stage/${pageId}`);
  },

  getStagesByPageId(pageId: string, params?: any) {
    return instance.get(`/plan/page/stage/${pageId}`, {params});
  },
};
