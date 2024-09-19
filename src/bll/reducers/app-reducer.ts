import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authAPI} from '../../api/authApi';
import {setUser} from './user-reducer';
import {UserType} from '../../types/StateType';
import {Alert, Platform} from 'react-native';
import {removeToken} from '../../api/storage';
import {UserRole} from '../../enums/user';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {notificationsAPI} from '../../api/notificationsApi';

export const loginTC = createAsyncThunk(
  'app/login',
  async (
    params: {
      body: {password: string; email: string};
      navigation: any;
    },
    {dispatch},
  ) => {
    dispatch(setIsLoading(true));
    try {
      const res = await authAPI.verifyPassword(params.body);
      if (res.status === 201) {
        const resCode = await authAPI.sendVerificationCode({
          email: params.body.email,
        });
        if (resCode.status === 201) {
          params.navigation.navigate('Auth', {
            screen: 'Verification',
            params: {
              email: params.body.email,
              password: params.body.password,
            },
          });
        }
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      dispatch(setIsLoading(false));
    }
  },
);

export const logoutTC = createAsyncThunk(
  'app/logout',
  async (body: {}, {dispatch}) => {
    try {
      await notificationsAPI.disable({deviceType: Platform.OS});
      await authAPI.logOut();
      dispatch(setIsLoggedIn(false));
      await removeToken();
      dispatch(setUser({} as UserType));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

export const changePasswordTC = createAsyncThunk(
  'app/logout',
  async (
    params: {
      navigation: any;
      role: string;
      body: {email: string; password: string; newPassword: string};
    },
    {dispatch},
  ) => {
    dispatch(setIsLoading(true));
    try {
      const res = await authAPI.changePassword(params.body);
      Alert.alert(res.data.message, '', [
        {
          text: 'OK',
          onPress: () => {
            params.navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: 'MenuTab',
                params: {
                  screen: 'Settings',
                  params: {screen: 'PrivacySetting'},
                },
              },
            });
          },
        },
      ]);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      dispatch(setIsLoading(false));
    }
  },
);

export const sendVerificationCodeTC = createAsyncThunk(
  'app/sendVerificationCode',
  async (
    params: {
      navigation: any;
      body: {email: string; type: number};
    },
    {dispatch},
  ) => {
    try {
      const res = await authAPI.sendVerificationCode(params.body);
      params.navigation.navigate('Auth', {
        screen: 'Verification',
        params: {
          email: params.body.email,
          code: res.data.code,
          type: params.body.type,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
);

export const checkVerificationCodeTC = createAsyncThunk(
  'app/checkVerificationCode',
  async (
    params: {
      navigation: any;
      body: {email: string; code: string; type: number};
    },
    {dispatch},
  ) => {
    try {
      const res = await authAPI.checkVerificationCode(params.body);
      params.navigation.navigate('Auth', {
        screen: 'Verification',
        params: {email: params.body.email, code: String(res.data.code)},
      });
    } catch (err) {
      console.log(err);
    }
  },
);

export const setNewPasswordTC = createAsyncThunk(
  'app/setNewPassword',
  async (
    params: {
      navigation: any;
      body: {email: string; verificationCode: number; password: string};
    },
    {dispatch},
  ) => {
    try {
      await authAPI.setNewPassword(params.body);

      params.navigation.navigate('Auth', {
        screen: 'Restored',
      });
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  },
);

const slice = createSlice({
  name: 'app',
  initialState: {
    isLoggedIn: false,
    isLoading: false,
    isModalEmergency: false,
    isOpenMenu: false,
    isOfflineMode: false,
    errors: {
      isError: false,
      message: '',
    },
    arhiveLinks: {} as {
      [key: string]: {
        url: string;
        name: string;
        model: string;
        dirPath: string;
      };
    },
  },
  reducers: {
    togleMenu(state) {
      state.isOpenMenu = !state.isOpenMenu;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setIsModalEmergency(state, action: PayloadAction<boolean>) {
      state.isModalEmergency = action.payload;
    },
    toggleIsOfflineMode(state, action: PayloadAction<boolean>) {
      state.isOfflineMode = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setArhiveLinks(
      state,
      action: PayloadAction<{
        model: string;
        url: string;
        name: string;
        dirPath: string;
      }>,
    ) {
      state.arhiveLinks = {
        ...state.arhiveLinks,
        [action.payload.model]: {
          url: action.payload.url,
          name: action.payload.name,
          model: action.payload.model,
          dirPath: action.payload.dirPath,
        },
      };
    },
  },
});

export const appReducer = slice.reducer;

export const {
  togleMenu,
  setIsLoggedIn,
  setIsModalEmergency,
  setIsLoading,
  toggleIsOfflineMode,
  setArhiveLinks,
} = slice.actions;

export type ActionsTypeForAppReducer =
  | ReturnType<typeof setIsLoading>
  | ReturnType<typeof toggleIsOfflineMode>
  | ReturnType<typeof togleMenu>
  | ReturnType<typeof setIsLoggedIn>
  | ReturnType<typeof setArhiveLinks>
  | ReturnType<typeof setIsModalEmergency>;
