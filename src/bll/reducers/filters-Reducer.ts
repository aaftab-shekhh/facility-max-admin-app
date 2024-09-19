import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {SearchParamsType} from '../../types/StateType';
import moment from 'moment';
// import moment from 'moment';

const slice = createSlice({
  name: 'filters',
  initialState: {
    paramsState: {
      startDate: moment().format('YYYY-MM-DDT00:00:00.000'),
      endDate: moment().format('YYYY-MM-DDT23:59:00.000'),
    } as SearchParamsType,
    assetFilters: {} as any,
  },
  reducers: {
    setParamsState(
      state,
      action: PayloadAction<{[key in string]: string | number | boolean}>,
    ) {
      state.paramsState = {...state.paramsState, ...action.payload};
    },
    setAssetFiltersField(
      state,
      action: PayloadAction<{
        [key in string]: string | number | boolean | string[];
      }>,
    ) {
      state.assetFilters = {...state.assetFilters, ...action.payload};
    },
    resetParamsState(state) {
      state.paramsState = {
        startDate: moment().format('YYYY-MM-DDT00:00:00.000'),
        endDate: moment().format('YYYY-MM-DDT23:59:00.000'),
      };
    },
    resetAssetFilters(state) {
      state.assetFilters = {};
    },
  },
});

export const filtersReducer = slice.reducer;

export const {
  setParamsState,
  resetParamsState,
  setAssetFiltersField,
  resetAssetFilters,
} = slice.actions;

export type ActionsTypeForFiltersReducer =
  | ReturnType<typeof setAssetFiltersField>
  | ReturnType<typeof resetParamsState>
  | ReturnType<typeof resetAssetFilters>
  | ReturnType<typeof setParamsState>;
