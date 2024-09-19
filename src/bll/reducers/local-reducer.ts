import {DBType} from './../../types/StateType';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'local',
  initialState: {
    db: {
      activationcode: {},
      user: {},
      usercredential: {},
      customer: {},
      building: {},
      floor: {},
      room: {},
      buildingfile: {},
      userfile: {},
      note: {},
      region: {},
      customermodule: {},
      utilitiesorinsurance: {},
      notefile: {},
      asset: {},
      assetfile: {},
      assetcategory: {},
      assetprops: {},
      assettypes: {},
      assettypesprops: {},
      assetpropsdata: {},
      plan: {},
      assetplans: {},
      alertmessage: {},
      supportsticker: {},
      contact: {},
      subcontractor: {},
      plantypes: {},
      buckettechnician: {},
      workorder: {},
      bucket: {},
      workorderfile: {},
      workordertechnician: {},
      vendor: {},
      inventoryitem: {},
      inventory: {},
      inventorypart: {},
      transfer: {},
      transferworkorder: {},
      purchase: {},
      emergencyprocedure: {},
      userabilitysettings: {},
      workorderplan: {},
      emergencyplan: {},
      emergencycontac: {},
      econtactcontact: {},
      econtactbuilding: {},
      econtactregion: {},
      econtactplan: {},
      news: {},
      notification: {},
      appfile: {},
      afarfloor: {},
      affectedasset: {},
      afarroom: {},
      affectedarea: {},
      afasasset: {},
      eprocedureeplan: {},
      points: {},
      module: {},
      pdfdocumentsmodel: {},
      askforassistance: {},
      assistancetechnician: {},
      assetpropsanswer: {},
      usernotificationsettings: {},
      preferredassetcontractor: {},
      roompoints: {},
      assetaffectedarea: {},
      assetaffectedareafloor: {},
      assetaffectedarearoom: {},
      subcontractorresponsibilities: {},
      history: {},
      bucketassettypes: {},
      assignmentfolder: {},
      assignmentpanel: {},
      afarasset: {},
      emergencyreport: {},
      ereportasset: {},
      ereportassetcategory: {},
      eplansubcontractor: {},
      ereporteprocedure: {},
      ereportsubcontractor: {},
      views: {},
      viewsuser: {},
      file: {},
      verification: {},
      workorderasset: {},
      workorderbucket: {},
      workorderstatuses: {},
    } as DBType,
  },
  reducers: {
    setdbModule(state, action: PayloadAction<string>) {
      state.db = {...state.db, [action.payload]: {}};
    },
    setdbModuleData(state, action: PayloadAction<{model: string; data: any}>) {
      state.db = {...state.db, [action.payload.model]: action.payload.data};
    },
    setdbNestedModuleData(
      state,
      action: PayloadAction<{model: string; id: string; data: any}>,
    ) {
      state.db[action.payload.model] = {
        ...state.db[action.payload.model],
        [action.payload.id]: action.payload.data,
      };
    },
    setNewModuleItem(
      state,
      action: PayloadAction<{
        model: string;
        id: string;
        body: any;
      }>,
    ) {
      // console.log('prev', state.db[action.payload.model][action.payload.id]);
      state.db[action.payload.model][action.payload.id] = {
        ...state.db[action.payload.model][action.payload.id],
        ...action.payload.body,
      };
      // console.log('prev', state.db[action.payload.model][action.payload.id]);
    },
    deleteModuleItem(
      state,
      action: PayloadAction<{model: string; id: string}>,
    ) {
      // console.log(state.db[action.payload.model][action.payload.id]);
      delete state.db[action.payload.model][action.payload.id];
      // console.log(state.db[action.payload.model][action.payload.id]);
    },
  },
});

export const localReducer = slice.reducer;

export const {
  setdbModule,
  setdbModuleData,
  setNewModuleItem,
  setdbNestedModuleData,
  deleteModuleItem,
} = slice.actions;

export type ActionsTypeForLocalReducer =
  | ReturnType<typeof setdbModule>
  | ReturnType<typeof setNewModuleItem>
  | ReturnType<typeof setdbNestedModuleData>
  | ReturnType<typeof deleteModuleItem>
  | ReturnType<typeof setdbModuleData>;
