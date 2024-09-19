import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {emergencyAPI} from '../../api/emergencyApi';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {
  EmergencyContactType,
  NewEmergencyPlanType,
} from '../../types/EmergencyTypes';
import {subcontractorsAPI} from '../../api/subcontractorsApi';

export const getEmergencyContactesTC = createAsyncThunk(
  'emergency/getEmergencyContactes',
  async (params: any, {dispatch}) => {
    try {
      const res = await subcontractorsAPI.getSubcontractors(params);
      dispatch(setEmergencyContactes(res.data.rows));
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(setEmergencyContactes([]));
    }
  },
);

export const getEmergencyPlansTC = createAsyncThunk(
  'emergency/getEmergencyPlans',
  async (params: any, {dispatch}) => {
    try {
      const res = await emergencyAPI.getEmergencyPlans(params);
      dispatch(setEmergencyPlans(res.data.payload));
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(setEmergencyPlans([]));
    }
  },
);

export const getEmergencyPlanTC = createAsyncThunk(
  'emergency/getEmergencyPlan',
  async (params: {id: string}, {dispatch}) => {
    try {
      const res = await emergencyAPI.getEmergencyPlanById(params);
      dispatch(setEmergencyPlan(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(setEmergencyPlan({} as NewEmergencyPlanType));
    }
  },
);

const slice = createSlice({
  name: 'emergency',
  initialState: {
    emergencyContactes: [] as EmergencyContactType[],
    emergencyPlans: [] as NewEmergencyPlanType[],
    emergencyPlan: {} as NewEmergencyPlanType,
  },
  reducers: {
    setEmergencyContactes(
      state,
      action: PayloadAction<EmergencyContactType[]>,
    ) {
      state.emergencyContactes = action.payload;
    },
    setEmergencyPlans(state, action: PayloadAction<NewEmergencyPlanType[]>) {
      state.emergencyPlans = action.payload;
    },
    setEmergencyPlan(state, action: PayloadAction<NewEmergencyPlanType>) {
      state.emergencyPlan = action.payload;
    },
    updateEmergencyPlan(state, action: PayloadAction<any>) {
      state.emergencyPlan = {...state.emergencyPlan, ...action.payload};
    },
  },
});

export const emergencyReducer = slice.reducer;

export const {
  setEmergencyContactes,
  setEmergencyPlans,
  setEmergencyPlan,
  updateEmergencyPlan,
} = slice.actions;

export type ActionsTypeForEmergencyReducer =
  | ReturnType<typeof setEmergencyContactes>
  | ReturnType<typeof updateEmergencyPlan>
  | ReturnType<typeof setEmergencyPlan>
  | ReturnType<typeof setEmergencyPlans>;
