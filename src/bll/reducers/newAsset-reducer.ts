import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {assetsAPI} from '../../api/assetsApi';
import {setNewAsset} from './assets-reducer';
import {NewAssetType} from '../../types/StateType';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';

export const createNewAssetTC = createAsyncThunk(
  'assets/createNewAsset',
  async (params: {body: NewAssetType; nav?: any}, {dispatch}) => {
    const body = params.body;

    try {
      const props = body.props
        ? Array.from(Object.keys(body.props), id => ({
            id,
            value: String(body.props[id].value),
            name: body.props[id].name,
            type: body.props[id].type,
          }))
        : undefined;

      if (props) {
        body.props = props;
      }

      const res = await assetsAPI.createAsset(body);

      params.nav && params.nav.goBack();
      dispatch(setNewAsset(res.data));
      dispatch(clearNewAssetForm());
      return res.data;
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(clearNewAssetForm());
    }
  },
);

export const createNewAssetsTC = createAsyncThunk(
  'assets/createNewAssets',
  async (body: {[key: string]: {props: any}}, {dispatch}) => {
    try {
      Object.values(body).forEach(async (el: NewAssetType) => {
        const data = el;
        if (el.props) {
          const props = Array.from(Object.keys(el.props), id => ({
            id,
            value: String(el.props[id].value),
            name: el.props[id].name,
            type: el.props[id].type,
          }));
          await assetsAPI.createAsset({...data, props: [...props]});
        } else {
          await assetsAPI.createAsset({...data});
        }
      });

      dispatch(clearNewAssetsForm());
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(clearNewAssetForm());
    }
  },
);

export const replaceAssetsTC = createAsyncThunk(
  'assets/replaceAssets',
  async (
    body: {[key: string]: {itemId: string; isDestroyAsset?: boolean}},
    {dispatch},
  ) => {
    try {
      for (const el in body) {
        await assetsAPI.replaceAsset(el, body[el]);
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      dispatch(clearNewAssetForm());
    }
  },
);

const slice = createSlice({
  name: 'createAsset',
  initialState: {
    newAsset: {} as NewAssetType,
    newAssets: null,
    replacedAssets: null,
  },
  reducers: {
    clearNewAssetForm(state) {
      state.newAsset = {} as NewAssetType;
    },
    clearNewAssetsForm(state) {
      state.newAssets = null;
    },
    deleteAssetFromForm(state, action: PayloadAction<string>) {
      if (state.newAssets !== null) {
        delete state.newAssets[action.payload];
      }
    },
    setNewAssetField(
      state,
      action: PayloadAction<{
        [key in string]: string | number | boolean;
      }>,
    ) {
      state.newAsset = {...state.newAsset, ...action.payload};
    },
    setNewAssets(state, action: PayloadAction<{id: string; asset: any}>) {
      state.newAssets =
        state.newAssets !== null
          ? {
              ...state.newAssets,
              [action.payload.id]: action.payload.asset,
            }
          : {[action.payload.id]: action.payload.asset};
    },
    setReplasetAssets(state, action: PayloadAction<{id: string; item: any}>) {
      state.replacedAssets =
        state.replacedAssets !== null
          ? {
              ...state.replacedAssets,
              [action.payload.id]: action.payload.item,
            }
          : {[action.payload.id]: action.payload.item};
    },
    changeReplacedActions(
      state,
      action: PayloadAction<{id: string; item: any}>,
    ) {
      state.replacedAssets =
        state.replacedAssets !== null
          ? {
              ...state.replacedAssets,
              [action.payload.id]: {
                ...state.replacedAssets[action.payload.id],
                ...action.payload.item,
              },
            }
          : {
              [action.payload.id]: {
                ...state.replacedAssets[action.payload.id],
                ...action.payload.item,
              },
            };
    },

    deleteReplacedAsset(state, action: PayloadAction<string>) {
      if (state.replacedAssets !== null) {
        delete state.replacedAssets[action.payload];
      }
    },
    setNewAssetCategory(state, action: PayloadAction<string>) {
      state.newAsset = {
        ...state.newAsset,
        categoryId: action.payload,
        typeId: '',
        props: {},
      };
    },
    setNewAssetType(state, action: PayloadAction<string>) {
      state.newAsset = {
        ...state.newAsset,
        typeId: action.payload,
        props: {},
      };
    },
    setNewAssetPropsField(
      state,
      action: PayloadAction<{
        [key in string]: {
          value: string | number | boolean;
          name: string;
          type: string;
        };
      }>,
    ) {
      state.newAsset = {
        ...state.newAsset,
        props: {...state.newAsset.props, ...action.payload},
      };
    },
  },
});

export const newAssetReducer = slice.reducer;

export const {
  clearNewAssetForm,
  setNewAssetField,
  setNewAssetCategory,
  setNewAssetType,
  setNewAssetPropsField,
  setNewAssets,
  clearNewAssetsForm,
  deleteAssetFromForm,
  setReplasetAssets,
  deleteReplacedAsset,
  changeReplacedActions,
} = slice.actions;

export type ActionsTypeForNewAssetReducer =
  | ReturnType<typeof clearNewAssetForm>
  | ReturnType<typeof clearNewAssetsForm>
  | ReturnType<typeof deleteAssetFromForm>
  | ReturnType<typeof setNewAssets>
  | ReturnType<typeof setNewAssetField>
  | ReturnType<typeof setNewAssetCategory>
  | ReturnType<typeof setReplasetAssets>
  | ReturnType<typeof deleteReplacedAsset>
  | ReturnType<typeof changeReplacedActions>
  | ReturnType<typeof setNewAssetPropsField>
  | ReturnType<typeof setNewAssetType>;
