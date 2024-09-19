import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {assetsAPI} from '../../api/assetsApi';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {PointType} from '../../types/StateType';

export const getPointsByPageIdTC = createAsyncThunk(
  'assets/getPointsByPlanId',
  async (
    data: {
      pageId: string;
      params: any;
    },
    {dispatch},
  ) => {
    try {
      const res = await assetsAPI.getPointsByPlanId(data);
      const objRes = await assetsAPI.getObjectPointsByPlanId(data);
      dispatch(setPoints(res.data.points.concat(objRes.data.payload)));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const createPointsTC = createAsyncThunk(
  'createNewEmergencyPlan/createPoints',
  async (
    data: {body: Omit<PointType, keyof {id: string}>; route: string},
    {dispatch},
  ) => {
    try {
      await assetsAPI.createPoints(data);
      dispatch(
        getPointsByPageIdTC({
          pageId: data.body.pageId,
          params: {offset: 0, limit: 1000},
        }),
      );
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const createLinkTC = createAsyncThunk(
  'createNewEmergencyPlan/createLink',
  async (
    params: {
      firstParams: {
        pageId: string;
        pointId: string;
        body: {
          fromId?: string;
          fromX?: number;
          fromY?: number;
          toId?: string;
        };
      };
      secondParams: {
        pageId: string;
        pointId: string;
        body: {
          fromId?: string;
          fromX?: number;
          fromY?: number;
        };
      };
    },
    {dispatch},
  ) => {
    try {
      await assetsAPI.updatePoints(params.firstParams);
      await assetsAPI.updatePoints(params.secondParams);

      dispatch(
        getPointsByPageIdTC({
          pageId: params.firstParams.pageId,
          params: {offset: 0, limit: 1000},
        }),
      );
      dispatch(cleanPoint());
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(cleanPoint());
    }
  },
);

export const updatePointsTC = createAsyncThunk(
  'createNewEmergencyPlan/updatePoints',
  async (
    params: {
      pageId: string;
      pointId: string;
      body: {
        fromId?: string;
        fromX?: number;
        fromY?: number;
      };
    },
    {dispatch},
  ) => {
    try {
      await assetsAPI.updatePoints(params);
      dispatch(
        getPointsByPageIdTC({
          pageId: params.pageId,
          params: {offset: 0, limit: 1000},
        }),
      );
      dispatch(cleanPoint());
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(cleanPoint());
    }
  },
);

export const deletePointsTC = createAsyncThunk(
  'assets/deletePoints',
  async (params: {pageId: string; fromId: string}, {dispatch}) => {
    try {
      await assetsAPI.deletePoints(params);
      dispatch(
        getPointsByPageIdTC({
          pageId: params.pageId,
          params: {offset: 0, limit: 1000},
        }),
      );
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);
const slice = createSlice({
  name: 'newPoint',

  initialState: {
    points: [] as {
      id: string;
      fromX?: number;
      fromY?: number;
      fromId: string;
      from: {
        id: string;
        name: string;
        category: {id: string; name: string; link: string};
      };
      to: {id: string};
      type: string;
    }[],
    newPoints: {} as {
      fromId: string;
      pageId: string;
      fromX: number;
      fromY: number;
    },
  },

  reducers: {
    setPoint(state, action: PayloadAction<any>) {
      state.newPoints = {...state.newPoints, ...action.payload};
    },

    cleanPoint(state) {
      state.newPoints = {} as {
        fromId: string;
        pageId: string;
        fromX: number;
        fromY: number;
      };
    },

    setPoints(state, action: PayloadAction<any>) {
      state.points = action.payload.map((el: any) => ({
        ...el,
        fromX: +el.fromX.toFixed(0),
        fromY: +el.fromY.toFixed(0),
        toX: +el.toX.toFixed(0),
        toY: +el.toY.toFixed(0),
      }));
    },
    deletePoints(state, action: PayloadAction<string>) {
      state.points = state.points.filter(el => el.id !== action.payload);
    },
  },
});

export const newPointReducer = slice.reducer;

export const {setPoint, setPoints, cleanPoint, deletePoints} = slice.actions;

export type ActionsTypeForNewPointsReducer =
  | ReturnType<typeof setPoint>
  | ReturnType<typeof deletePoints>
  | ReturnType<typeof cleanPoint>
  | ReturnType<typeof setPoints>;
