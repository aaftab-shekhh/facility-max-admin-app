import axios from 'axios';
import {ITokens, getTokens, setTokens} from './storage';
import {store} from '../bll/store';
import {logoutTC} from '../bll/reducers/app-reducer';
// export const API_URL = 'https://api.facilitymaxpro.com/';
export const API_URL = 'https://dev.api.facilitymaxpro.com/';

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const instanceFile = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    accept: 'application/json',
  },
});

instance.interceptors.request.use(async config => {
  const tokens = await getTokens();
  config.headers.Authorization = `Bearer ${tokens?.accessToken}`;
  return config;
});

instance.interceptors.response.use(
  config => {
    return config;
  },
  async error => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const tokens = await getTokens();
        if (!tokens) {
          return;
        }
        const {data} = await axios.get(`${API_URL}/auth/refresh`, {
          headers: {
            Authorization: `Bearer ${tokens.refreshToken}`,
          },
        });
        await setTokens(data);
        return instance.request(originalRequest);
      } catch (e) {
        await setTokens({} as ITokens);
        store.dispatch(logoutTC({}));
        console.log('no registration!', e);
      }
    } else {
      console.log('Error=>', error);
      throw error;
    }

    return error;
  },
);

instanceFile.interceptors.request.use(async config => {
  const tokens = await getTokens();
  config.headers.Authorization = `Bearer ${tokens?.accessToken}`;
  return config;
});

instanceFile.interceptors.response.use(
  config => {
    return config;
  },
  async error => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;

      try {
        const tokens = await getTokens();
        if (!tokens) {
          return;
        }
        const {data} = await axios.get(`${API_URL}/auth/refresh`, {
          headers: {
            Authorization: `Bearer ${tokens.refreshToken}`,
          },
        });
        await setTokens(data);
        return instanceFile.request(originalRequest);
      } catch (e) {
        await setTokens({} as ITokens);
        // useLogout()
        store.dispatch(logoutTC({}));
        console.log('no registration!');
      }
    } else {
      console.log('Error=>', error.response.data.message);
      throw error;
    }

    return error;
  },
);
