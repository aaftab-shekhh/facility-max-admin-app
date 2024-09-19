import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {OrderType} from '../../types/StateType';
import {woAPI} from '../../api/woApi';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {GetWOsParams} from '../../api/ApiTypes';
import {subcontractorsAPI} from '../../api/subcontractorsApi';

export const getWOsTC = createAsyncThunk(
  'wo/getWOsId',
  async (params: GetWOsParams, {dispatch}) => {
    try {
      const res = await woAPI.getWorkOrders(params);
      dispatch(setWorkOrders(res.data.rows));
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(setWorkOrders([]));
    }
  },
);

export const getWObyCoordinatesTC = createAsyncThunk(
  'wo/getWObyCoordinates',
  async (params: any, {dispatch}) => {
    try {
      const res = await woAPI.getWObyCoordinates(params);
      dispatch(setWorkOrders(res.data.rows));
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(setWorkOrders([]));
    }
  },
);

export const getWObyIdTC = createAsyncThunk(
  'wo/getWOId',
  async (params: {workOrderId: string}, {dispatch}) => {
    try {
      const res = await woAPI.getWObyId(params);
      dispatch(setWorkOrder(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const createWOTC = createAsyncThunk(
  'wo/createWO',
  async (data: any, {dispatch}) => {
    try {
      const res = await woAPI.createWO(data);
      return res;
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const updateWOTC = createAsyncThunk(
  'wo/updateWO',
  async (body: any, {dispatch}) => {
    try {
      const res = await woAPI.updateWO(body);
      dispatch(setWorkOrder(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getSubcontractorsTC = createAsyncThunk(
  'wo/getSubcontractors',
  async (params: any, {dispatch}) => {
    try {
      const res = await subcontractorsAPI.getSubcontractors(params);
      dispatch(setSubcontractors(res.data.rows));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const createSubcontractorTC = createAsyncThunk(
  'wo/createSubcontractor',
  async (body: {data: any; navigation: any}, {dispatch}) => {
    try {
      const res = await subcontractorsAPI.createSubcontractor(body.data);
      body.navigation.goBack();
      dispatch(setSubcontractor(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

// export const acceptWOTC = createAsyncThunk(
//   'wo/acceptWO',
//   async (
//     body: {
//       workOrderId: string;
//       estimatedLaborHoursTech: number;
//       expectedCompletionDateTech: string;
//     },
//     {dispatch},
//   ) => {
//     try {
//       await woAPI.acceptWO(body);
//       // dispatch(getWObyIdTC(params.params));
//     } catch (err) {
//       handleServerNetworkError(err.response.data);
//     }
//   },
// );

export const deleteWorkOrderFileTC = createAsyncThunk(
  'wo/deleteWorkOrderFile',
  async (params: any, {dispatch}) => {
    try {
      const res = await woAPI.deleteWorkOrderFile(params);
      dispatch(deleteFile(res.data.id));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'wo',
  initialState: {
    unassignedWorkOrders: [] as OrderType[],
    myWorkOrders: [] as OrderType[],
    workOrders: [] as OrderType[],
    workOrder: {} as OrderType,
    subcontractors: [] as any[],
  },
  reducers: {
    setWorkOrders(state, action: PayloadAction<OrderType[]>) {
      state.workOrders = action.payload;
    },
    setMyWorkOrders(state, action: PayloadAction<OrderType[]>) {
      state.myWorkOrders = action.payload;
    },
    setUnassignedWorkOrders(state, action: PayloadAction<OrderType[]>) {
      state.unassignedWorkOrders = action.payload;
    },
    setNewWorkOrder(state, action: PayloadAction<OrderType>) {
      state.workOrders = [action.payload, ...state.workOrders];
    },
    deleteWOfromList(state, action: PayloadAction<string>) {
      state.workOrders = state.workOrders.filter(
        order => order.id !== action.payload,
      );
    },
    setWorkOrder(state, action: PayloadAction<OrderType>) {
      state.workOrder = action.payload;
    },
    setSubcontractors(state, action: PayloadAction<any[]>) {
      state.subcontractors = action.payload;
    },
    setSubcontractor(state, action: PayloadAction<any>) {
      state.subcontractors = [action.payload, ...state.subcontractors];
    },
    deleteFile(state, action: PayloadAction<any>) {
      state.workOrder.workOrderFiles = state.workOrder.workOrderFiles.filter(
        file => file.id !== action.payload,
      );
    },
  },
});

export const woReducer = slice.reducer;

export const {
  setWorkOrders,
  setMyWorkOrders,
  setUnassignedWorkOrders,
  setNewWorkOrder,
  deleteWOfromList,
  setWorkOrder,
  setSubcontractors,
  deleteFile,
  setSubcontractor,
} = slice.actions;

export type ActionsTypeForWOReducer =
  | ReturnType<typeof deleteFile>
  | ReturnType<typeof setMyWorkOrders>
  | ReturnType<typeof setUnassignedWorkOrders>
  | ReturnType<typeof deleteWOfromList>
  | ReturnType<typeof setSubcontractors>
  | ReturnType<typeof setSubcontractor>
  | ReturnType<typeof setWorkOrders>
  | ReturnType<typeof setNewWorkOrder>
  | ReturnType<typeof setWorkOrder>;
