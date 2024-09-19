import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {notesAPI} from '../../api/notesApi';
import {getWObyIdTC} from './wo-Reducer';
import {getBuildingByIdTC} from './buildings-reducer';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';

export const createNoteTC = createAsyncThunk(
  'notes/createNote',
  async (note: any, {dispatch}) => {
    try {
      const res = await notesAPI.createNote(note);
      if (res.data.assetId) {
        // dispatch(getAssetTC(res.data.assetId));
      }
      if (res.data.workOrderId) {
        dispatch(getWObyIdTC({workOrderId: res.data.workOrderId}));
      }
      if (res.data.buildingId) {
        dispatch(getBuildingByIdTC({buildingId: res.data.buildingId}));
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'plan',
  initialState: {
    note: {},
  },
  reducers: {
    setNotes(state, action: PayloadAction<any>) {
      state.note = action.payload;
    },
  },
});

export const notesReducer = slice.reducer;

export const {setNotes} = slice.actions;

export type ActionsTypeForNotesReducer = ReturnType<typeof setNotes>;
