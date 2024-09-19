import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {BuildingType, FloorType} from '../../types/StateType';
import {buildingsAPI} from '../../api/buildingsApi';
import {
  GetBuildingsParams,
  GetFloorsParams,
  UpdateBuildingType,
} from '../../api/ApiTypes';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';

export const getBuildingsListTC = createAsyncThunk(
  'buildings/getBuildingsList',
  async (params: any, {dispatch}) => {
    try {
      const res = await buildingsAPI.getBuildingsList(params);
      dispatch(
        setBuildings(
          res.data.rows.map(el => ({
            ...el,
            file: el.avatar,
          })),
        ),
      );
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(setBuildings([]));
    }
  },
);

export const getBuildingsByCoordinatesTC = createAsyncThunk(
  'buildings/getBuildingsByCoordinates',
  async (params: GetBuildingsParams, {dispatch}) => {
    try {
      const res = await buildingsAPI.getBuildingsByCoordinates(params);
      dispatch(setBuildings(res.data.rows));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getBuildingByIdTC = createAsyncThunk(
  'buildings/getBuildingById',
  async (params: any, {dispatch}) => {
    try {
      const res = await buildingsAPI.getBuildingById(params);
      dispatch(setBuilding(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getFloorsTC = createAsyncThunk(
  'buildings/getFloors',
  async (params: GetFloorsParams, {dispatch}) => {
    try {
      const res = await buildingsAPI.getFloorsByBuildingId(params);
      dispatch(setFloors(res.data.rows));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const updateBuildingTC = createAsyncThunk(
  'buildings/updateBuilding',
  async (body: UpdateBuildingType, {dispatch}) => {
    const {endUpdate, ...data} = body;
    try {
      const res = await buildingsAPI.updateBuilding(data);
      dispatch(updateBuilding(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      endUpdate && endUpdate();
    }
  },
);

export const updateBuildingImageTC = createAsyncThunk(
  'buildings/updateBuildingImage',
  async (body: any, {dispatch}) => {
    try {
      const res = await buildingsAPI.updateBuildingImage(body);
      dispatch(updateBuilding(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'buildings',
  initialState: {
    buildings: [] as BuildingType[],
    building: {name: ''} as BuildingType,
    floors: [] as FloorType[],
  },
  reducers: {
    setBuildings(state, action: PayloadAction<BuildingType[]>) {
      state.buildings = action.payload || [];
    },
    setBuilding(state, action: PayloadAction<BuildingType>) {
      state.building = action.payload;
    },
    updateBuilding(state, action: PayloadAction<BuildingType>) {
      state.building = {...state.building, ...action.payload};
    },
    setFloors(state, action: PayloadAction<FloorType[]>) {
      state.floors = action.payload;
    },
  },
});

export const buildingsReducer = slice.reducer;

export const {setBuildings, setBuilding, setFloors, updateBuilding} =
  slice.actions;

export type ActionsTypeForBuildingsReducer =
  | ReturnType<typeof updateBuilding>
  | ReturnType<typeof setBuildings>
  | ReturnType<typeof setBuilding>
  | ReturnType<typeof setFloors>;
