import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {emergencyAPI} from '../../api/emergencyApi';
import {
  AffectedAreaType,
  AffectedAssetType,
  NewEmergencyPlanType,
} from '../../types/EmergencyTypes';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';

export const getMyUnfilledTC = createAsyncThunk(
  'createNewEmergencyPlan/getMyUnfilled',
  async (params: any, {dispatch}) => {
    try {
      const res = await emergencyAPI.getMyUnfilled();
      if (res.data) {
        dispatch(setNewEmergencyPlan(res.data));
      } else {
        dispatch(cleanNewEmergencyPlan());
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const createOrUpdateEmergencyPlanTC = createAsyncThunk(
  'createNewEmergencyPlan/createOrUpdateEmergencyPlan',
  async (body: {id?: string; scenario: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.createOrUpdateEmergencyPlan(body);
      dispatch(setNewEmergencyPlan(res.data));
      const resInc = await emergencyAPI.incrementLevel({id: res.data.id});
      dispatch(setNewEmergencyPlan(resInc.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const decrementLevelTC = createAsyncThunk(
  'createNewEmergencyPlan/decrementLevelTC',
  async (body: {id: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.decrementLevel(body);
      dispatch(setNewEmergencyPlan(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const incrementLevelTC = createAsyncThunk(
  'createNewEmergencyPlan/incrementLevel',
  async (body: {id: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.incrementLevel(body);
      dispatch(setNewEmergencyPlan(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const updateNewPlanStep2TC = createAsyncThunk(
  'createNewEmergencyPlan/updateNewPlanStep2TC',
  async (body: {id: string; name: string; description: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.updateNewPlanStep2(body);
      dispatch(setNewEmergencyPlan(res.data));
      // const resInc = await emergencyAPI.incrementLevel({id: body.id});
      // dispatch(setNewEmergencyPlan(resInc.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getAffectedAreasTC = createAsyncThunk(
  'createNewEmergencyPlan/getAffectedAreas',
  async (params: {emergencyPlanId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.getAffectedAreas(params);
      dispatch(setAffectedAreas(res.data.areas));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const createOrUpdateAffectedAreaTC = createAsyncThunk(
  'createNewEmergencyPlan/createOrUpdateAffectedArea',
  async (
    body: {buildingId?: string; emergencyPlanId?: string; id?: string},
    {dispatch},
  ) => {
    try {
      body.id &&
        body.emergencyPlanId &&
        dispatch(
          deleteAffectedAreaTC({
            id: body.id,
            emergencyPlanId: body.emergencyPlanId,
          }),
        );

      const res = await emergencyAPI.createOrUpdateAffectedAreaEmergencyPlan({
        emergencyPlanId: body.emergencyPlanId,
        buildingId: body.buildingId,
      });
      dispatch(setNewAffectedArea(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const affectedAreaAddFloorTC = createAsyncThunk(
  'createNewEmergencyPlan/affectedAreaAddFloor',
  async (body: {affectedAreaId: string; floorId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.affectedAreaAddFloor(body);
      dispatch(setNewAffectedArea(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const affectedAreaDetachFloorTC = createAsyncThunk(
  'createNewEmergencyPlan/affectedAreaDetachFloor',
  async (body: {affectedAreaId: string; floorId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.affectedAreaDetachFloor(body);
      dispatch(setNewAffectedArea(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const affectedAreaAddRoomTC = createAsyncThunk(
  'createNewEmergencyPlan/affectedAreaAddRoom',
  async (body: {affectedAreaId: string; roomId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.affectedAreaAddRoom(body);
      dispatch(setNewAffectedArea(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const affectedAreaDetachRoomTC = createAsyncThunk(
  'createNewEmergencyPlan/affectedAreaDetachRoom',
  async (body: {affectedAreaId: string; roomId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.affectedAreaDetachRoom(body);
      dispatch(setNewAffectedArea(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const deleteAffectedAreaTC = createAsyncThunk(
  'createNewEmergencyPlan/deleteAffectedArea',
  async (params: {id: string; emergencyPlanId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.deleteAffectedArea(params);
      dispatch(deleteAffectedAreas(res.data.id));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getAffectedAssetsTC = createAsyncThunk(
  'createNewEmergencyPlan/getAffectedAssets',
  async (params: {emergencyPlanId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.getAffectedAssets(params);
      if (res.data.count !== 0) {
        dispatch(setAffectedAssets(res.data.areas));
      } else {
        dispatch(setAffectedAssets([]));
        const resCreate =
          await emergencyAPI.createOrUpdateAffectedAssetEmergencyPlan({
            emergencyPlanId: params.emergencyPlanId,
            assetCategoryId: '100',
          });
        dispatch(setNewAffectedAsset(resCreate.data));
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const createOrUpdateAffectedAssetTC = createAsyncThunk(
  'createNewEmergencyPlan/createOrUpdateAffectedAsset',
  async (
    body: {assetCategoryId?: string; emergencyPlanId?: string; id?: string},
    {dispatch},
  ) => {
    try {
      body.id && dispatch(deleteAffectedAssetTC({id: body.id}));

      const res = await emergencyAPI.createOrUpdateAffectedAssetEmergencyPlan({
        emergencyPlanId: body.emergencyPlanId,
        assetCategoryId: body.assetCategoryId,
      });
      dispatch(setNewAffectedAsset(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const affectedAssetAddAssetTC = createAsyncThunk(
  'createNewEmergencyPlan/affectedAssetAddAsset',
  async (body: {affectedAssetId: string; assetId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.affectedAssetAddAsset(body);
      dispatch(setNewAffectedAsset(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const affectedAssetDetachAssetTC = createAsyncThunk(
  'createNewEmergencyPlan/affectedAssetDetachAsset',
  async (body: {affectedAssetId: string; assetId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.affectedAssetDetachAsset(body);
      dispatch(setNewAffectedAsset(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const deleteAffectedAssetTC = createAsyncThunk(
  'createNewEmergencyPlan/deleteAffectedAsset',
  async (params: {id: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.deleteAffectedAsset(params);
      dispatch(deleteAffectedAsset(res.data.id));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const attachProcedureForEmergencyPlanTC = createAsyncThunk(
  'createNewEmergencyPlan/attachProcedureForEmergencyPlan',
  async (
    body: {emergencyProcedureId: string; emergencyPlanId: string},
    {dispatch},
  ) => {
    try {
      await emergencyAPI.attachProcedureForEmergencyPlan(body);
      const res = await emergencyAPI.getEmergencyPlanById({
        id: body.emergencyPlanId,
      });
      dispatch(setNewEmergencyPlan(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const detachProcedureForEmergencyPlanTC = createAsyncThunk(
  'createNewEmergencyPlan/detachProcedureForEmergencyPlan',
  async (
    body: {emergencyProcedureId: string; emergencyPlanId: string},
    {dispatch},
  ) => {
    try {
      await emergencyAPI.detachProcedureForEmergencyPlan(body);
      const res = await emergencyAPI.getEmergencyPlanById({
        id: body.emergencyPlanId,
      });
      dispatch(setNewEmergencyPlan(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const attachContactTC = createAsyncThunk(
  'createNewEmergencyPlan/attachContact',
  async (
    body: {subcontractorId: string; emergencyPlanId: string},
    {dispatch},
  ) => {
    try {
      await emergencyAPI.attachContact(body);
      const res = await emergencyAPI.getEmergencyPlanById({
        id: body.emergencyPlanId,
      });
      dispatch(setNewEmergencyPlan(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const detachContactTC = createAsyncThunk(
  'createNewEmergencyPlan/detachContact',
  async (
    body: {subcontractorId: string; emergencyPlanId: string},
    {dispatch},
  ) => {
    try {
      await emergencyAPI.detachContact(body);
      const res = await emergencyAPI.getEmergencyPlanById({
        id: body.emergencyPlanId,
      });
      dispatch(setNewEmergencyPlan(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const updateFrequencyTC = createAsyncThunk(
  'createNewEmergencyPlan/updateFrequency',
  async (
    body: {
      frequency?: string;
      frequencyStartDate?: string;
      id: string;
    },
    {dispatch},
  ) => {
    try {
      const res = await emergencyAPI.updateFrequency(body);
      dispatch(setNewEmergencyPlan(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'createNewEmergencyPlan',
  initialState: {
    newEmergencyPlan: {} as NewEmergencyPlanType,
    affectedAreas: [] as AffectedAreaType[],
    affectedAssets: [] as AffectedAssetType[],
  },
  reducers: {
    setNewEmergencyPlan(state, action: PayloadAction<NewEmergencyPlanType>) {
      state.newEmergencyPlan = {...state.newEmergencyPlan, ...action.payload};
    },
    setAffectedAreas(state, action: PayloadAction<AffectedAreaType[]>) {
      state.affectedAreas = action.payload;
    },
    setNewAffectedArea(state, action: PayloadAction<AffectedAreaType>) {
      state.affectedAreas = state.affectedAreas.some(
        area => area.id === action.payload.id,
      )
        ? state.affectedAreas.map(area => {
            return area.id === action.payload.id
              ? {...area, ...action.payload}
              : area;
          })
        : [action.payload, ...state.affectedAreas];
    },
    deleteAffectedAreas(state, action: PayloadAction<string>) {
      state.affectedAreas = state.affectedAreas.filter(
        area => area.id !== action.payload,
      );
    },
    setAffectedAssets(state, action: PayloadAction<AffectedAssetType[]>) {
      state.affectedAssets = action.payload;
    },
    setNewAffectedAsset(state, action: PayloadAction<AffectedAssetType>) {
      state.affectedAssets = state.affectedAssets.some(
        asset => asset.id === action.payload.id,
      )
        ? state.affectedAssets.map(asset => {
            return asset.id === action.payload.id
              ? {...asset, ...action.payload}
              : asset;
          })
        : [action.payload, ...state.affectedAssets];
    },
    deleteAffectedAsset(state, action: PayloadAction<string>) {
      state.affectedAssets = state.affectedAssets.filter(
        asset => asset.id !== action.payload,
      );
    },
    cleanNewEmergencyPlan(state) {
      state.newEmergencyPlan = {} as NewEmergencyPlanType;
    },
  },
});

export const createNewEmergencyPlanReducer = slice.reducer;

export const {
  setNewEmergencyPlan,
  cleanNewEmergencyPlan,
  setAffectedAreas,
  setNewAffectedArea,
  deleteAffectedAreas,
  setAffectedAssets,
  setNewAffectedAsset,
  deleteAffectedAsset,
} = slice.actions;

export type ActionsTypeForCreateNewEmergencyPlanReducer =
  | ReturnType<typeof setNewEmergencyPlan>
  | ReturnType<typeof setAffectedAreas>
  | ReturnType<typeof setNewAffectedArea>
  | ReturnType<typeof deleteAffectedAreas>
  | ReturnType<typeof setAffectedAssets>
  | ReturnType<typeof setNewAffectedAsset>
  | ReturnType<typeof deleteAffectedAsset>
  | ReturnType<typeof cleanNewEmergencyPlan>;
