import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {UserType} from '../../types/StateType';
import {userAPI} from '../../api/userApi';
import {UpdateUserType} from '../../api/ApiTypes';
import {logoutTC} from './app-reducer';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';

export const getMeTC = createAsyncThunk(
  'user/getMe',
  async (params: {}, {dispatch}) => {
    try {
      const res = await userAPI.getMe();
      dispatch(setUser(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
      dispatch(logoutTC({}));
    }
  },
);

export const getUserByIdTC = createAsyncThunk(
  'user/getUserById',
  async (params: {id: string}, {dispatch}) => {
    try {
      const res = await userAPI.getUserById(params);
      dispatch(setUser(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const updateSettingNotificationTC = createAsyncThunk(
  'user/updateSettingNotification',
  async (body: any, {dispatch}) => {
    try {
      await userAPI.updateSettingNotification(body);
      dispatch(updateNotificationSetting(body));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const updateUserProfileInfoTC = createAsyncThunk(
  'user/updateUser',
  async (body: UpdateUserType, {dispatch}) => {
    try {
      const res = await userAPI.updateUser(body);

      dispatch(setUser(res.data));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const updateAvatarTC = createAsyncThunk(
  'user/updateAvatar',
  async (body: any, {dispatch}) => {
    try {
      const res = await userAPI.updateAvatar(body);
      dispatch(setNewAvatar(res.data.url));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);
export const getAssignedBucketsTC = createAsyncThunk(
  'user/getAssignedBuckets',
  async (body: any, {dispatch}) => {
    try {
      const res = await userAPI.getAssignedTeams();
      dispatch(setAssignedBuckets(res.data.payload));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'user',
  initialState: {
    user: {
      role: 'REQUESTOR',
    } as UserType,
    assignedBuckets: [] as {
      id: string;
    }[],
  },
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      state.user = {...state.user, ...action.payload};
    },
    setNewAvatar(state, action: PayloadAction<string>) {
      state.user.avatar.url = action.payload;
    },
    updateNotificationSetting(
      state,
      action: PayloadAction<{[key: string]: boolean}>,
    ) {
      state.user.userNotificationSettings = {
        ...state.user.userNotificationSettings,
        ...action.payload,
      };
    },
    setAssignedBuckets(
      state,
      action: PayloadAction<
        {
          id: string;
        }[]
      >,
    ) {
      state.assignedBuckets = action.payload;
    },
  },
});

export const userReducer = slice.reducer;

export const {
  setUser,
  setNewAvatar,
  updateNotificationSetting,
  setAssignedBuckets,
} = slice.actions;

export type ActionsTypeForUserReducer =
  | ReturnType<typeof updateNotificationSetting>
  | ReturnType<typeof setNewAvatar>
  | ReturnType<typeof setAssignedBuckets>
  | ReturnType<typeof setUser>;
