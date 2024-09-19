import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {PageType, PlanType, RoomOnThePlanType} from '../../types/StateType';
import {store} from '../store';
import {getFloorsTC} from './buildings-reducer';
import {plansAPI} from '../../api/plansApi';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';

export const getPlanTC = createAsyncThunk(
  'plan/getPlan',
  async (planId: string, {dispatch}) => {
    try {
      const res = await plansAPI.getPlanById(planId);
      dispatch(setPlan(res.data));
    } catch (err) {
      console.log('plan/getPlan', err.response.data.message);
    }
  },
);

export const getPageTC = createAsyncThunk(
  'plan/getPage',
  async (planId: string, {dispatch}) => {
    try {
      const res = await plansAPI.getPageById(planId);

      dispatch(setPage(res.data));
    } catch (err) {
      console.log('plan/getPage', err.response.data.message);
    }
  },
);

export const getStagesTC = createAsyncThunk(
  'plan/getPlan',
  async (pageId: string, {dispatch}) => {
    try {
      const {data} = await plansAPI.getStagesByPageId(pageId, {});
      dispatch(setStages(data.payload));
    } catch (err) {
      console.log('plan/getPlan', err.response.data.message);
    }
  },
);

export const getPagesTC = createAsyncThunk(
  'plan/getPages',
  async (params: {rootId: string; version?: number}, {dispatch}) => {
    const {rootId, ...param} = params;
    try {
      const res = await plansAPI.getPlanPages(rootId, param);
      if (res.data.children.length > 0) {
        dispatch(setPages([res.data.root, ...res.data.children]));
      } else {
        dispatch(setPages([]));
      }
    } catch (err) {
      console.log('plan/getPages', err.response.data.message);
      dispatch(setPages([]));
    }
  },
);

export const createPlanTC = createAsyncThunk(
  'plan/createPlan',
  async (data: any, {dispatch}) => {
    try {
      await plansAPI.createPlan(data);
      dispatch(
        getFloorsTC({
          buildingId: store.getState().buildings.building.id,
          sortField: 'id',
          sortDirection: 'ASC',
          size: 100,
          page: 1,
        }),
      );
    } catch (err) {
      console.log('plan/createPlan', err.response.data.message);
    }
  },
);

export const editPlanTC = createAsyncThunk(
  'plan/editPlan',
  async (body: any, {dispatch}) => {
    try {
      await plansAPI.editPlan(body);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const deletePlanTC = createAsyncThunk(
  'plan/deletePlan',
  async (id: string, {dispatch}) => {
    try {
      await plansAPI.deletePlan(id);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getRoomsPointsByPageId = createAsyncThunk(
  'plan/getRoomsPointsByPageData',
  async ({pageId}: any, {dispatch}) => {
    try {
      let rooms = [] as Array<any>;
      let count = 0;
      let rowsCount = 0;
      let isFirst = false;

      while (rowsCount < count || !isFirst) {
        const result = await plansAPI.getRoomsByPageId(pageId, {
          offset: rowsCount,
          limit: 1000,
        });

        count = result.data.count;
        rooms = [...rooms, ...result.data.rooms];
        rowsCount = rooms.length;
        isFirst = true;
      }

      dispatch(setRooms(rooms));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'plan',
  initialState: {
    plan: {} as PlanType,
    page: {} as PageType,
    stages: [] as any[],
    pages: [],
    rooms: [] as RoomOnThePlanType[],
    hideAssets: {} as {[key: string]: string[]},
  },
  reducers: {
    setPlan(state, action: PayloadAction<PlanType>) {
      state.plan = action.payload;
    },
    setPage(state, action: PayloadAction<PageType>) {
      state.page = action.payload;
    },
    setStages(state, action: PayloadAction<any[]>) {
      state.stages = action.payload;
    },
    updatePlanForSaveVersion(state, action: PayloadAction<PageType>) {
      state.page = {
        ...state.page,
        ...action.payload,
      };
    },
    setPages(state, action: PayloadAction<any>) {
      state.pages = action.payload;
    },
    setRooms(state, action: PayloadAction<RoomOnThePlanType[]>) {
      state.rooms = action.payload.map((room: RoomOnThePlanType) => ({
        ...room,
        show: true,
      }));
    },
    showHideRoom(state, action: PayloadAction<string>) {
      state.rooms = state.rooms.map((room: RoomOnThePlanType) =>
        room.id === action.payload ? {...room, show: !room.show} : room,
      );
    },
    showHideAsset(
      state,
      action: PayloadAction<{pageId: string; assetId: string}>,
    ) {
      state.hideAssets = state.hideAssets[action.payload.pageId]
        ? {
            ...state.hideAssets,
            [action.payload.pageId]: state.hideAssets[
              action.payload.pageId
            ]?.some(el => el === action.payload.assetId)
              ? state.hideAssets[action.payload.pageId].filter(
                  assetId => assetId !== action.payload.assetId,
                )
              : [
                  ...state.hideAssets[action.payload.pageId],
                  action.payload.assetId,
                ],
          }
        : {
            ...state.hideAssets,
            [action.payload.pageId]: [action.payload.assetId],
          };
    },
  },
});

export const planReducer = slice.reducer;

export const {
  setPlan,
  setPage,
  setStages,
  setPages,
  setRooms,
  showHideRoom,
  showHideAsset,
  updatePlanForSaveVersion,
} = slice.actions;

export type ActionsTypeForPlanReducer =
  | ReturnType<typeof setPlan>
  | ReturnType<typeof setPage>
  | ReturnType<typeof setStages>
  | ReturnType<typeof setRooms>
  | ReturnType<typeof showHideRoom>
  | ReturnType<typeof showHideAsset>
  | ReturnType<typeof updatePlanForSaveVersion>
  | ReturnType<typeof setPages>;
