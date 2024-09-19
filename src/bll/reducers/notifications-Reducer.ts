import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {notificationsAPI} from '../../api/notificationsApi';

export const getNotificationsCountTC = createAsyncThunk(
  'notifications/getNotificationsCount',
  async (_, {dispatch}) => {
    try {
      const res = await notificationsAPI.getNotificationsCount();
      dispatch(setNotificationsCount(res.data));
    } catch (err) {
      console.log(
        'notifications/getNotificationsCount',
        err.response.data.message,
      );
    }
  },
);

const initialState = {
  notificationsUnreadCount: 0,
  isNotificationsChange: false,
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationsCount(
      state,
      action: PayloadAction<{totalCount: number; unreadCount: number}>,
    ) {
      state.notificationsUnreadCount = action.payload.unreadCount;
    },
    notificationsChanging(state) {
      state.isNotificationsChange = !state.isNotificationsChange;
    },
  },
});

export const notificationsReducer = slice.reducer;

export const {setNotificationsCount, notificationsChanging} = slice.actions;

export type ActionsTypeForNotificationsReducer =
  | ReturnType<typeof notificationsChanging>
  | ReturnType<typeof setNotificationsCount>;
