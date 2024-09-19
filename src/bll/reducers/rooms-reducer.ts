import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {RoomType} from '../../types/StateType';
import {buildingsAPI} from '../../api/buildingsApi';

export const getRoomByIdTC = createAsyncThunk(
  'rooms/getRoomById',
  async (params: any, {dispatch}) => {
    try {
      const res = await buildingsAPI.getRoomById(params);
      dispatch(setRoom(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'rooms',
  initialState: {
    room: {name: ''} as RoomType,
  },
  reducers: {
    setRoom(state, action: PayloadAction<RoomType>) {
      state.room = action.payload;
    },
  },
});

export const roomsReducer = slice.reducer;

export const {setRoom} = slice.actions;

export type ActionsTypeForRoomsReducer = ReturnType<typeof setRoom>;
