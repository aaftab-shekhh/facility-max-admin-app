import {
  GetBuildingsParams,
  GetFloorsParams,
  GetRoomsParams,
  UpdateBuildingType,
} from './ApiTypes';
import {instance, instanceFile} from './instances';

export const buildingsAPI = {
  getBuildingsList(params: any) {
    return instance.get('buildings/get-buildings-list', {
      params,
    });
  },

  getBuildingsListByRegion(params: any) {
    return instance.get('buildings/get-buildings-list-by-region', {
      params,
    });
  },

  getBuildingsByCoordinates(params: GetBuildingsParams) {
    return instance.get(
      'buildings/get-buildings-list-by-coordinates-mobile',
      {
        params,
      },
    );
  },

  getBuildingById(params: any) {
    return instance.get('buildings/get-building-by-id', {
      params,
    });
  },

  getBuildingByRegionId(params: any) {
    return instance.get('buildings/get-buildings-list-by-region', {
      params,
    });
  },

  getFloorsByBuildingId(params: GetFloorsParams) {
    return instance.get('floors/get-floors-by-building-id', {
      params,
    });
  },

  addFloor(body: {descriptions?: string; name: string; buildingId: string}) {
    return instance.post('floors/create-floor', body);
  },

  editFloor(body: {descriptions?: string; name: string; buildingId: string}) {
    return instance.patch('floors/update-floor', body);
  },

  deleteFloor(params: {floorId: string}) {
    return instance.delete('floors/delete-floor', {params});
  },

  getRoomsByEntity(params: GetRoomsParams) {
    return instance.get('rooms/get-rooms-by-entity', {
      params,
    });
  },

  getRoomById(params: {roomId: string}) {
    return instance.get('rooms/get-room-by-id', {params});
  },

  addRoom(body: {descriptions?: string; name: string; floorId: string}) {
    return instance.post('rooms/create-room', body);
  },

  addRoomFile(body: FormData) {
    return instanceFile.post('rooms/files/create-room-file', body);
  },

  editRoom(body: {descriptions?: string; name: string; roomId: string}) {
    return instance.patch('rooms/update-room', body);
  },

  getTenantList(params: {buildingId: string; size: number; page: number}) {
    return instance.get('tenantCompanies/get-tenantCompanies-list', {
      params,
    });
  },

  deleteRoom(params: {roomId: string}) {
    return instance.delete('rooms/delete-room', {params});
  },

  deleteRoomFile(params: {id: string}) {
    return instance.delete('rooms/files/delete-room-file', {params});
  },

  getBuildingFiles(params: {
    buildingId: string;
    page: number;
    size: number;
    sortField: string;
    sortDirection: string;
  }) {
    return instance.get(
      'buildings/files/get-building-files-by-building-id',
      {
        params,
      },
    );
  },

  addBuildingFiles(body: FormData) {
    return instanceFile.post('buildings/files/create-building-file', body);
  },

  updateBuilding(body: UpdateBuildingType) {
    return instance.patch('buildings/update-building', body);
  },

  updateBuildingImage(body: any) {
    return instanceFile.patch('buildings/upload-building-image', body);
  },
};
