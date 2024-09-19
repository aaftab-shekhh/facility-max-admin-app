import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'offline',
  initialState: {
    requests: [] as any[],
  },
  reducers: {
    setRequest(state, action: PayloadAction<any>) {
      if (
        state.requests.some(
          el =>
            el.id === action.payload.id && el.action === action.payload.action,
        )
      ) {
        state.requests = state.requests.map(el => {
          return el.id === action.payload.id &&
            el.action === action.payload.action
            ? {...el, body: {...el.body, ...action.payload.body}}
            : el;
        });
      } else {
        state.requests.push(action.payload);
      }
    },

    deleteRequest(state, action: PayloadAction<string>) {
      state.requests = state.requests.filter(
        request => request.id !== action.payload,
      );
    },
  },
});

export const offlineReducer = slice.reducer;

export const {setRequest, deleteRequest} = slice.actions;

export type ActionsTypeForOfflineReducer =
  | ReturnType<typeof setRequest>
  | ReturnType<typeof deleteRequest>;
