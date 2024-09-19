import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {emergencyAPI} from '../../api/emergencyApi';
import {
  AffectedAreaType,
  AffectedAssetType,
  EmergencyReportType,
} from '../../types/EmergencyTypes';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';

export const getMyUnfilledReportTC = createAsyncThunk(
  'getMyUnfilledReport/getMyUnfilled',
  async (params: any, {dispatch}) => {
    try {
      const res = await emergencyAPI.getMyUnfilledRepor();
      if (res.data) {
        dispatch(setEmergencyReport(res.data));
      } else {
        dispatch(cleanNewEmergencyReport());
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const createOrUpdateEmergencyReportTC = createAsyncThunk(
  'createNewEmergencyReport/createOrUpdateEmergencyReport',
  async (body: {scenario: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.createOrUpdateEmergencyReport(body);
      dispatch(setNewEmergencyReport(res.data));
      dispatch(incOrDecEmergencyReportTC({type: 'increment'}));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const incOrDecEmergencyReportTC = createAsyncThunk(
  'createNewEmergencyReport/incOrDecEmergencyReport',
  async (body: {type: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.incrementDecrementReport(body);
      dispatch(setNewEmergencyReport(res.data.updated));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const changeReporRegionTC = createAsyncThunk(
  'createNewEmergencyReport/changeReportBuilding',
  async (body: {regionId: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.changeReportRegion(body);
      dispatch(getMyUnfilledReportTC({}));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const changeReportBuildingTC = createAsyncThunk(
  'createNewEmergencyReport/changeReportRegion',
  async (body: {buildingId?: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.changeReportBuilding(body);
      dispatch(getMyUnfilledReportTC({}));
      // dispatch(setNewEmergencyReport({building: {id: res.data.buildingId}}));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const changeReportFloorTC = createAsyncThunk(
  'createNewEmergencyReport/changeReportFloorTC',
  async (body: {floorId?: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.changeReportFloor(body);
      dispatch(getMyUnfilledReportTC({}));
      dispatch(setNewEmergencyReport({floor: {id: res.data.floorId}}));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const changeReportRoomTC = createAsyncThunk(
  'createNewEmergencyReport/changeReportFloorTC',
  async (body: {roomId?: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.changeReportRoom(body);
      dispatch(getMyUnfilledReportTC({}));

      dispatch(setNewEmergencyReport({room: {id: res.data.roomId}}));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getReportAssetCategoriesTC = createAsyncThunk(
  'createNewEmergencyReport/getReportAssetCategories',
  async (body: {}, {dispatch}) => {
    try {
      const res = await emergencyAPI.getReportAssetCategories();
      dispatch(
        setNewEmergencyReport({
          selectedAssetCategories: res.data.categories.map(
            cat => cat.category.id,
          ),
        }),
      );
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getReportAssetsTC = createAsyncThunk(
  'createNewEmergencyReport/getReportAssets',
  async (body: {}, {dispatch}) => {
    try {
      const res = await emergencyAPI.getReportAssets();
      dispatch(
        setNewEmergencyReport({
          selectedAssets: res.data.assets.map(el => el.asset),
        }),
      );
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const addOrDeleteAssetCategoriesTC = createAsyncThunk(
  'createNewEmergencyReport/addOrDeleteAssetCategories',
  async (
    params: {
      action: string;
      body: {categoryId: string};
    },
    {dispatch},
  ) => {
    try {
      await emergencyAPI.addOrDeleteAssetCategories(params);
      dispatch(getReportAssetCategoriesTC({}));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const addOrDeleteAssetTC = createAsyncThunk(
  'createNewEmergencyReport/addOrDeleteAsset',
  async (
    params: {
      action: string;
      body: {assetId: string};
    },
    {dispatch},
  ) => {
    try {
      await emergencyAPI.addOrDeleteAsset(params);
      // dispatch(getReportAssetsTC({}));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const changeTitleDescriptionTC = createAsyncThunk(
  'createNewEmergencyReport/changeTitleDescription',
  async (body: {title?: string; description?: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.changeTitleDescription(body);
      dispatch(setNewEmergencyReport(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'createNewEmergencyReport',
  initialState: {
    newEmergencyReport: {} as EmergencyReportType,
    affectedAreas: [] as AffectedAreaType[],
    affectedAssets: [] as AffectedAssetType[],
  },
  reducers: {
    setEmergencyReport(state, action: PayloadAction<EmergencyReportType>) {
      state.newEmergencyReport = action.payload;
    },
    setNewEmergencyReport(state, action: PayloadAction<EmergencyReportType>) {
      state.newEmergencyReport = {
        ...state.newEmergencyReport,
        ...action.payload,
      };
    },
    cleanNewEmergencyReport(state) {
      state.newEmergencyReport = {} as EmergencyReportType;
    },
  },
});

export const createNewEmergencyReportReducer = slice.reducer;

export const {
  setNewEmergencyReport,
  cleanNewEmergencyReport,
  setEmergencyReport,
} = slice.actions;

export type ActionsTypeForCreateNewEmergencyPlanReducer =
  | ReturnType<typeof setEmergencyReport>
  | ReturnType<typeof setNewEmergencyReport>
  | ReturnType<typeof cleanNewEmergencyReport>;
