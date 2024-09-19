import {StyleSheet, Switch, Text, View} from 'react-native';
import {colors} from '../styles/colors';
import {useOfflineMode} from '../hooks/useOfflineMode';
import {useEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import {OFFLINE_ACTIONS} from '../enums/offline';
import {handleServerNetworkError} from '../utils/handleServerNetworkUtils';
import {createNewAssetTC} from '../bll/reducers/newAsset-reducer';
import {deleteRequest} from '../bll/reducers/offline-reducer';
import {updateAssetTC} from '../bll/reducers/assets-reducer';
import {
  createPointsTC,
  deletePointsTC,
  updatePointsTC,
} from '../bll/reducers/point-reducer';
import {toggleIsOfflineMode} from '../bll/reducers/app-reducer';
import {createNoteTC} from '../bll/reducers/notes-Reducer';
import {assetsAPI} from '../api/assetsApi';
import {sortedBy} from '../utils/sorted';
import {updateWOTC} from '../bll/reducers/wo-Reducer';
import {woAPI} from '../api/woApi';

export const OfflineMode = () => {
  const dispatch = useAppDispatch();
  const {downloadFiles, modelText} = useOfflineMode();
  const {isConnected} = useNetInfo();
  const {isOfflineMode} = useAppSelector(state => state.app);
  const {requests} = useAppSelector(state => state.offline);
  const {assignmentpanel} = useAppSelector(state => state.local.db);

  useEffect(() => {
    if (isConnected && isOfflineMode) {
      if (requests.length > 0) {
        requests.forEach(el => {
          switch (el.action) {
            case OFFLINE_ACTIONS.CREATE_ASSET:
              (async () => {
                try {
                  await dispatch(
                    createNewAssetTC({
                      body: el.body,
                    }),
                  );
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.EDIT_ASSET:
              (async () => {
                try {
                  if (el.body.props) {
                    const props = Object.values(el.body.props).map(
                      (el: any) => ({
                        id: el.id,
                        value: String(el.value),
                        name: el.name,
                        type: el.type,
                      }),
                    );

                    dispatch(
                      updateAssetTC({
                        assetId: el.id,
                        body: {...el.body, props},
                      }),
                    );
                  } else {
                    dispatch(
                      updateAssetTC({
                        assetId: el.id,
                        body: el.body,
                      }),
                    );
                  }
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.CREATE_POINT:
              (async () => {
                try {
                  await dispatch(createPointsTC(el.body));

                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.EDIT_POINT:
              (async () => {
                try {
                  await dispatch(updatePointsTC(el.body));

                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.DELETE_POINT:
              (async () => {
                try {
                  await dispatch(deletePointsTC(el.body));
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.ADD_ASSET_FILES:
              (async () => {
                try {
                  await assetsAPI.addAssetFiles({
                    id: el.assetId,
                    body: el.body,
                  });
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.CREATE_NOTE:
              (async () => {
                try {
                  await dispatch(createNoteTC(el.body));
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.UPDATE_ASSIGNMENT_FOOLDER:
              (async () => {
                try {
                  await assetsAPI.updateFolder(el.body, el.id);
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;

            case OFFLINE_ACTIONS.CREATE_ASSIGNMENT_FOOLDER:
              (async () => {
                try {
                  const res = await assetsAPI.createFolder(el.body);
                  sortedBy(
                    'panelNumber',
                    Object.values(assignmentpanel).filter(
                      panel => panel.parentId === el.id,
                    ),
                  ).forEach(
                    chaildEl =>
                      el.id === chaildEl.parentId &&
                      (async () => {
                        await assetsAPI.createPanel({
                          id: res.data.id,
                          body: {
                            roomId: chaildEl.roomId,
                            assetId: chaildEl.assetId,
                            assignmentDetails: chaildEl.assignmentDetails,
                            panelNumber: chaildEl.panelNumber,
                          },
                        });
                        dispatch(deleteRequest(chaildEl.id));
                      })(),
                  );
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.DELETE_POINT:
              (async () => {
                try {
                  await dispatch(deletePointsTC(el.body));
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.EDIT_WO:
              (async () => {
                try {
                  await dispatch(updateWOTC(el.body));
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
            case OFFLINE_ACTIONS.EDIT_WO_TECH:
              (async () => {
                try {
                  await woAPI.updateWOTech(el.body);
                  dispatch(deleteRequest(el.id));
                } catch (err) {
                  handleServerNetworkError(err.response.data);
                }
              })();
              break;
          }
        });
      }
      (async () => await downloadFiles())();
    } else {
      // Object.values(arhiveLinks || {}).forEach(
      //   async (el: {
      //     url: string;
      //     name: string;
      //     model: string;
      //     dirPath: string;
      //   }) => await readFile(el.dirPath, el.model),
      // );
    }
  }, [isConnected, isOfflineMode]);

  return (
    <View style={styles.switchContainer}>
      <View style={styles.switchSubContainer}>
        <Text style={styles.offline}>Offline Mode</Text>
        <View style={styles.switchSubContainer}>
          <Text style={styles.status}>{isOfflineMode ? 'On' : 'Off'}</Text>
          <Switch
            trackColor={{false: '#6C757D', true: colors.selectCheck}}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#6C757D"
            onValueChange={(value: boolean) => {
              dispatch(toggleIsOfflineMode(value));
              if (value) {
                downloadFiles();
              }
            }}
            value={isOfflineMode}
            style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
          />
        </View>
      </View>
      {modelText ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.status}>
          {modelText}
        </Text>
      ) : (
        <Text style={styles.status} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    justifyContent: 'space-between',
    marginVertical: 10,
    marginBottom: 30,
  },

  switchSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },

  offline: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  status: {
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14,
    height: 16,
  },
});
