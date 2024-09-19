import {assetsAPI} from './../../api/assetsApi';
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AssetType, CategoryAssets, InventoryType} from '../../types/StateType';
import {inventoriesAPI} from '../../api/inventoryApi';
import {GetAssetsByAntityParams} from '../../api/ApiTypes';
import {
  AssetGetByEntityAttributes,
  AssetGetByEntityInclude,
} from '../../enums/assets';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';

export const getCategoriesAssetsTC = createAsyncThunk(
  'assets/getCategoriesAssets',
  async (
    params: {
      offset?: number;
      limit?: number;
      buildingId?: string;
      searchString?: string | null;
      regionIdes: string[];
    },
    {dispatch},
  ) => {
    try {
      const res = await assetsAPI.getCategoriesAssets(params);
      dispatch(setCategoriesAssets(res.data.categories));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getAssetTC = createAsyncThunk(
  'assets/getAsset',
  async (data: {assetId: string; params: any}, {dispatch}) => {
    try {
      const res = await assetsAPI.getAssetById(data);
      dispatch(setAsset(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getInventoriesTC = createAsyncThunk(
  'assets/getInventories',
  async (typeId: string, {dispatch}) => {
    try {
      const res = await inventoriesAPI.getInventories({typeIdes: [typeId]});
      dispatch(setInventories(res.data.payload));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const updateAssetTC = createAsyncThunk(
  'assets/updateAsset',
  async (
    params: {assetId: string; body: any; fromPlan?: boolean},
    {dispatch},
  ) => {
    try {
      const res = await assetsAPI.updateAsset(params);
      dispatch(setAsset(res.data));
      if (params.fromPlan) {
        dispatch(getUnassignedAssetsByPlanIdTC(params.body.planId));
        dispatch(getAssignedAssetsByPlanIdTC(params.body.planId));
      } else {
        dispatch(
          getAssetTC({
            assetId: params.assetId,
            params: {
              includeCriteria: [
                AssetGetByEntityInclude.BUILDING,
                AssetGetByEntityInclude.AVATAR,
                AssetGetByEntityInclude.TYPE,
                AssetGetByEntityInclude.CATEGORY,
                AssetGetByEntityInclude.PROPS,
              ],
              attributeCriteria: Object.values(AssetGetByEntityAttributes),
            },
          }),
        );
        const resCategories = await assetsAPI.getCategoriesAssets({
          offset: 0,
          limit: 25,
        });
        dispatch(setCategoriesAssets(resCategories.data.categories));
      }

      dispatch(clearAssetForm());
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(clearAssetForm());
    }
  },
);

export const getAssetsTC = createAsyncThunk(
  'assets/getAssets',
  async (params: any, {dispatch}) => {
    try {
      const res = await assetsAPI.getAssets(params);
      dispatch(setAssets(res.data.assets));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getAssignedAssetsByPlanIdTC = createAsyncThunk(
  'assets/getUnassignedAssets',
  async (planId: string, {dispatch}) => {
    try {
      const res = await assetsAPI.getAssignedAssetsByPlanId(planId);
      dispatch(setAssignedAssets(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const getUnassignedAssetsByPlanIdTC = createAsyncThunk(
  'assets/getUnassignedAssets',
  async (params: GetAssetsByAntityParams, {dispatch}) => {
    try {
      const res = await assetsAPI.getAssetsByAntity(params);
      dispatch(setUnassignedAssets(res.data.assets));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const deleteAssetTC = createAsyncThunk(
  'assets/deleteAsset',
  async (id: string, {dispatch}) => {
    try {
      await assetsAPI.deleteAsset(id);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'assets',

  initialState: {
    categoriesAssets: [] as CategoryAssets[],
    editAsset: {},
    assets: [] as AssetType[],
    asset: {
      inventories: [] as InventoryType[],
    } as AssetType,
    unassignedAssets: [] as AssetType[],
    assignedAssets: [] as AssetType[],
  },

  reducers: {
    setCategoriesAssets(state, action: PayloadAction<any[]>) {
      state.categoriesAssets = action.payload;
      // .map(el => {
      //   return {...el, data: [{categoryId: el.id}]};
      // });
    },

    setAssets(state, action: PayloadAction<AssetType[]>) {
      state.assets = action.payload;
    },

    setAsset(state, action: PayloadAction<AssetType>) {
      state.asset = action.payload;
    },

    setInventories(state, action: PayloadAction<InventoryType[]>) {
      state.asset.inventories = action.payload;
    },

    setNewAsset(state, action: PayloadAction<AssetType>) {
      state.assignedAssets = [
        ...state.assignedAssets,
        {...action.payload, x: 15, y: 15},
      ];
    },

    setAssignedAssets(state, action: PayloadAction<AssetType[]>) {
      state.assignedAssets = action.payload;
    },

    setUnassignedAssets(state, action: PayloadAction<AssetType[]>) {
      state.unassignedAssets = action.payload;
    },

    deleteUnassignedAsset(state, action: PayloadAction<string>) {
      state.unassignedAssets = state.unassignedAssets.filter(
        asset => asset.id !== action.payload,
      );
    },

    updateAsset(state, action: PayloadAction<any>) {
      state.assignedAssets.map(asset =>
        asset.id === action.payload.planId
          ? {...asset, x: action.payload.x, y: action.payload.y}
          : asset,
      );
    },

    setAssetField(
      state,
      action: PayloadAction<{[key in string]: string | number | boolean}>,
    ) {
      state.editAsset = {
        ...state.editAsset,
        ...action.payload,
      };
    },

    clearAssetForm(state) {
      state.editAsset = {};
    },
  },
});

export const assetsReducer = slice.reducer;

export const {
  setCategoriesAssets,
  setAsset,
  setNewAsset,
  setAssignedAssets,
  setUnassignedAssets,
  deleteUnassignedAsset,
  updateAsset,
  setAssetField,
  clearAssetForm,
  setInventories,
  setAssets,
} = slice.actions;

export type ActionsTypeForAssetsReducer =
  | ReturnType<typeof setAssets>
  | ReturnType<typeof setInventories>
  | ReturnType<typeof clearAssetForm>
  | ReturnType<typeof setAssetField>
  | ReturnType<typeof setCategoriesAssets>
  | ReturnType<typeof setAsset>
  | ReturnType<typeof setNewAsset>
  | ReturnType<typeof setAssignedAssets>
  | ReturnType<typeof deleteUnassignedAsset>
  | ReturnType<typeof updateAsset>
  | ReturnType<typeof setUnassignedAssets>;
