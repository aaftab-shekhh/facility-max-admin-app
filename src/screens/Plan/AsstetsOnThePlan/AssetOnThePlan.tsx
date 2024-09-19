import {FC, MutableRefObject, memo, useEffect, useMemo, useState} from 'react';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../hooks/hooks';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../../../styles/colors';
import Modal from 'react-native-modal/dist/modal';
import {AssetType} from '../../../types/StateType';
import FastImage from 'react-native-fast-image';
import {
  deletePointsTC,
  getPointsByPageIdTC,
  setPoint,
  updatePointsTC,
} from '../../../bll/reducers/point-reducer';
import {dropdownIcons} from '../../../bll/icons';
import {showHideAsset} from '../../../bll/reducers/plan-Reducer';
import {SCREEN_HEIGHT, stylesModal} from '../../../styles/styles';
import {
  deleteAssetTC,
  getAssetTC,
  setAsset,
} from '../../../bll/reducers/assets-reducer';
import {ModalLayout} from '../../../components/Layouts/ModalLayout';
import {useNetInfo} from '@react-native-community/netinfo';
import {setRequest} from '../../../bll/reducers/offline-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../enums/offline';
import {
  deleteModuleItem,
  setNewModuleItem,
} from '../../../bll/reducers/local-reducer';
import {DeleteIcon} from '../../../assets/icons/DeleteIcon';
import {RemoveAssetIcon} from '../../../assets/icons/RemoveAssetIcon';
import {EyeSecondIcon} from '../../../assets/icons/EyeSecondIcon';
import {InfoIcon} from '../../../assets/icons/InfoIcon';
import {RelationshipIcon} from '../../../assets/icons/RelationshipIcon';
import {ReplaceAssetIcon} from '../../../assets/icons/ReplaceAssetIco';
import {
  AssetGetByEntityAttributes,
  AssetGetByEntityInclude,
} from '../../../enums/assets';
import AssetAssignmentsIcon from '../../../assets/icons/AssetAssignmentsIcon';
import {useLocalStateSelector} from '../../../hooks/useLocalStateSelector';
import {assetsAPI} from '../../../api/assetsApi';

type AssetOnThePlanProps = {
  asset: AssetType;
  zoomLevel: MutableRefObject<number>;
  removeAsset: (id: string) => void;
  openEstablishRelationship?: () => void;
  openAssetAssignments?: () => void;
  innerRef: any;
  onChange?: ({}: {id: string; x: number; y: number}) => void;
  onChangeDelete?: () => void;
  fromAsset?: boolean;
  version: string;
  onEndChange: ({}: {id: string; x: number; y: number}) => void;
  k: number;
};

export const AssetOnThePlan: FC<AssetOnThePlanProps> = memo(
  ({
    asset,
    zoomLevel,
    openEstablishRelationship,
    openAssetAssignments,
    onChange,
    innerRef,
    onChangeDelete,
    fromAsset,
    onEndChange,
    version,
    k,
  }) => {
    const {current} = zoomLevel;
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const {isConnected} = useNetInfo();

    const assetID = useAppSelector(state => state.assets.asset?.id);
    const {getLocalAssetsById} = useLocalStateSelector();

    const [editFrom, setEditFrom] = useState(false);

    const [isViewActionsFrom, setIsViewActionsFrom] = useState(false);
    const [isViewActionsDeleteQuestion, setIsViewActionsDeleteQuestion] =
      useState(false);

    const [pageX, setPageX] = useState(0);
    const [pageY, setPageY] = useState(0);

    const startX = useSharedValue(asset.x);
    const startY = useSharedValue(asset.y);

    const togleViewActionsFrom = () => {
      setIsViewActionsFrom(!isViewActionsFrom);
    };

    const panGestureEventFrom = ({
      nativeEvent,
    }: GestureEvent<PanGestureHandlerEventPayload>) => {
      !fromAsset &&
        (() => {
          setEditFrom(true);

          onChange &&
            onChange({
              id: asset.id,
              x: +(nativeEvent?.translationX / current / k + asset.x).toFixed(
                0,
              ),
              y: +(nativeEvent?.translationY / current / k + asset.y).toFixed(
                0,
              ),
            });

          startX.value = +(
            nativeEvent?.translationX / current +
            asset.x * k
          ).toFixed(0);

          startY.value = +(
            nativeEvent?.translationY / current +
            asset.y * k
          ).toFixed(0);
        })();
    };

    useEffect(() => {
      startX.value = asset.x * k;
      startY.value = asset.y * k;
    }, [asset.x, asset.y, k]);

    const reanimatedStyle = useAnimatedStyle(() => {
      return {
        left: startX.value ? startX.value - 12.5 * k : 15 * k,
        top: startY.value ? startY.value - 12.5 * k : 15 * k,
      };
    }, [k]);

    const isObj = useMemo(
      () => asset.from?.objectGroupId,
      [asset.from?.objectGroupId],
    );

    const editLocalPoint = () => {
      const model = 'points';

      dispatch(
        setRequest({
          action: OFFLINE_ACTIONS.EDIT_POINT,
          method: OFFLINE_METHOD.PATCH,
          model,
          id: innerRef.current[asset.id].pointId,
          body: {
            pageId: version,
            pointId: innerRef.current[asset.id].pointId,
            body: {
              fromId: asset.id,
              fromX: startX.value,
              fromY: startY.value,
            },
          },
        }),
      );

      dispatch(
        setNewModuleItem({
          model,
          id: innerRef.current[asset.id].pointId,
          body: {
            fromX: startX.value / k,
            fromY: startY.value / k,
          },
        }),
      );
    };

    const deleteLocalPoint = () => {
      const model = 'points';
      dispatch(
        setRequest({
          action: OFFLINE_ACTIONS.DELETE_POINT,
          method: OFFLINE_METHOD.DELETE,
          model,
          id: innerRef.current[asset.id].pointId,
          body: {pageId: version, fromId: asset.id},
        }),
      );
      dispatch(
        deleteModuleItem({
          model,
          id: innerRef.current[asset.id].pointId,
        }),
      );
    };

    return (
      <TouchableOpacity
        style={[styles.asset]}
        hitSlop={15}
        onPress={event => {
          if (!fromAsset) {
            setPageX(event.nativeEvent.pageX * k);
            setPageY(event.nativeEvent.pageY * k);
            togleViewActionsFrom();
          }
        }}>
        <View>
          <PanGestureHandler
            onGestureEvent={panGestureEventFrom}
            activateAfterLongPress={500}
            hitSlop={15}
            onEnded={() => {
              !fromAsset &&
                (async () => {
                  setEditFrom(false);
                  if (!isObj) {
                    isConnected
                      ? dispatch(
                          updatePointsTC({
                            pageId: version,
                            pointId: innerRef.current[asset.id].pointId,
                            body: {
                              fromId: asset.id,
                              fromX: startX.value / k,
                              fromY: startY.value / k,
                            },
                          }),
                        )
                      : editLocalPoint();
                  } else {
                    await assetsAPI.updateObjectPoints({
                      pointId: innerRef.current[asset.id].pointId,
                      body: {
                        fromId: asset.from?.id,
                        fromX: startX.value / k,
                        fromY: startY.value / k,
                      },
                    });
                    dispatch(
                      getPointsByPageIdTC({
                        pageId: version,
                        params: {offset: 0, limit: 1000},
                      }),
                    );
                  }
                })();
              !isConnected &&
                onEndChange({
                  id: asset.id,
                  x: startX.value,
                  y: startY.value,
                });
            }}>
            <Animated.View
              style={[
                styles.assetContainer,
                reanimatedStyle,
                editFrom && styles.assetContainerEdit && {borderWidth: 1 * k},
                {borderRadius: isObj ? 12 * k : 6 * k},
                fromAsset && asset.id === assetID && styles.fromAssetContainer,
              ]}>
              <Pressable
                onPress={event => {
                  if (!fromAsset) {
                    setPageX(event.nativeEvent.pageX);
                    setPageY(event.nativeEvent.pageY);
                    togleViewActionsFrom();
                  }
                }}
                style={{
                  position: 'absolute',
                  width: 24 * k,
                  height: 24 * k,
                  zIndex: 111,
                  borderRadius: isObj ? 12 * k : 6 * k,
                }}
              />

              {editFrom &&
                [
                  {left: -3 * k, top: 10 * k},
                  {left: 10 * k, top: -3 * k},
                  {right: -3 * k, top: 10 * k},
                  {left: 10 * k, bottom: -3 * k},
                ].map((el, index) => (
                  <View
                    key={(index + 1).toString()}
                    style={[
                      styles.assetEditArrows,
                      {
                        width: 5 * k,
                        height: 5 * k,
                        transform: [{rotate: `${index + 1 * 45}deg`}],
                      },
                      el,
                    ]}
                  />
                ))}
              <FastImage
                source={
                  asset?.category?.file
                    ? {uri: asset?.category?.file.url}
                    : dropdownIcons[asset?.category?.name]
                }
                style={[
                  styles.icon,
                  {
                    width: 24 * k,
                    height: 24 * k,
                    borderRadius: isObj ? 12 * k : 6 * k,
                  },
                  asset?.category.color && {
                    backgroundColor: asset?.category.color,
                  },
                ]}
                defaultSource={dropdownIcons[asset?.category?.name]}
              />
              <Modal
                customBackdrop={
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setIsViewActionsFrom(false);
                    }}>
                    <View style={{flex: 1}} />
                  </TouchableWithoutFeedback>
                }
                animationInTiming={1}
                animationOutTiming={1}
                isVisible={isViewActionsFrom}
                onBackdropPress={() => setIsViewActionsFrom(false)}>
                <View
                  style={[
                    styles.actions,
                    pageX < Dimensions.get('window').width / 2
                      ? {top: pageY - 50, left: pageX - 10}
                      : {
                          top: pageY - 50,
                          left:
                            (pageX - (Dimensions.get('window').width - pageX)) /
                              2 -
                            15,
                        },
                  ]}>
                  <Text style={styles.assetName}>{asset?.name}</Text>
                  {isObj ? (
                    <>
                      <Pressable
                        style={styles.action}
                        onPress={async () => {
                          await assetsAPI.deleteObjectPoints({
                            pageId: version,
                            fromId: asset.from?.id,
                          });
                          dispatch(
                            getPointsByPageIdTC({
                              pageId: version,
                              params: {offset: 0, limit: 1000},
                            }),
                          );
                          setIsViewActionsFrom(false);
                        }}>
                        <RemoveAssetIcon />
                        <Text style={styles.actionText}>Remove from Plan</Text>
                      </Pressable>
                    </>
                  ) : (
                    <>
                      <Pressable
                        style={styles.action}
                        onPress={() => {
                          setIsViewActionsFrom(false);
                          navigation.navigate('Plan', {
                            screen: 'Asset',
                            params: {id: asset?.id},
                          });
                        }}>
                        <InfoIcon />
                        <Text style={styles.actionText}>
                          View Asset Information
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.action}
                        onPress={() => {
                          dispatch(
                            setPoint({
                              pageId: version,
                              pointId: innerRef.current[asset.id].pointId,
                              fromId: asset?.id,
                              fromX: startX.value,
                              fromY: startY.value,
                              toId: asset?.id,
                              toX: startX.value,
                              toY: startY.value,
                            }),
                          );
                          setIsViewActionsFrom(false);
                          openEstablishRelationship &&
                            openEstablishRelationship();
                        }}>
                        <RelationshipIcon />
                        <Text style={styles.actionText}>
                          Establish Relationship
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.action}
                        onPress={() => {
                          setIsViewActionsFrom(false);
                          isConnected
                            ? dispatch(
                                getAssetTC({
                                  assetId: asset?.id,
                                  params: {
                                    includeCriteria: [
                                      AssetGetByEntityInclude.BUILDING,
                                      AssetGetByEntityInclude.FLOOR,
                                      // AssetGetByEntityInclude.ROOM,
                                      AssetGetByEntityInclude.TYPE,
                                      AssetGetByEntityInclude.CATEGORY,
                                      AssetGetByEntityInclude.PROPS,
                                    ],
                                    attributeCriteria: Object.values(
                                      AssetGetByEntityAttributes,
                                    ),
                                  },
                                }),
                              )
                            : dispatch(setAsset(getLocalAssetsById(asset?.id)));
                          openAssetAssignments && openAssetAssignments();
                        }}>
                        <AssetAssignmentsIcon />
                        <Text style={styles.actionText}>
                          View Asset Assignments
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.action}
                        onPress={() =>
                          dispatch(
                            showHideAsset({
                              pageId: version,
                              assetId: asset.id,
                            }),
                          )
                        }>
                        <EyeSecondIcon />
                        <Text style={styles.actionText}>Hide Asset</Text>
                      </Pressable>
                      <Pressable
                        style={styles.action}
                        onPress={() => {
                          setIsViewActionsFrom(false);
                          navigation.navigate('Plan', {
                            screen: 'ReplaceAsset',
                            params: {
                              assetId: asset.id,
                            },
                          });
                        }}>
                        <ReplaceAssetIcon />
                        <Text style={styles.actionText}>Replace Asset</Text>
                      </Pressable>
                      <Pressable
                        style={styles.action}
                        onPress={() => {
                          isConnected
                            ? dispatch(
                                deletePointsTC({
                                  pageId: version,
                                  fromId: asset.id,
                                }),
                              )
                            : deleteLocalPoint();
                          setIsViewActionsFrom(false);
                        }}>
                        <RemoveAssetIcon />
                        <Text style={styles.actionText}>Remove from Plan</Text>
                      </Pressable>
                      <Pressable
                        style={styles.action}
                        onPress={() => {
                          setIsViewActionsFrom(false);
                          setTimeout(() => {
                            setIsViewActionsDeleteQuestion(true);
                          }, 100);
                        }}>
                        <DeleteIcon />
                        <Text style={styles.actionText}>Delete Asset</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </Modal>
            </Animated.View>
          </PanGestureHandler>
        </View>
        <ModalLayout
          title="You are about to delete this asset, are you sure?"
          isModalVisible={isViewActionsDeleteQuestion}
          toggleModal={() => {
            setIsViewActionsDeleteQuestion(false);
          }}>
          {/* <View style={[stylesModal.modalContainer, styles.modalContainer]}> */}
          <>
            <Text style={styles.deleteText}>
              Deleting assets will remove all relationships and place the asset
              in an archive state. If you meant to replace or upgrade this asset
              with new/other equipment, please click cancel and choose
              "Upgrade/Replace Asset" from the menu.
            </Text>
            <View style={[stylesModal.modalButtons, styles.modalButtons]}>
              <Pressable
                onPress={() => setIsViewActionsDeleteQuestion(false)}
                style={[stylesModal.modalButton, stylesModal.modalButtonReset]}>
                <Text
                  style={[
                    stylesModal.modalButtonText,
                    stylesModal.modalButtonTextReset,
                  ]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  dispatch(deleteAssetTC(asset.id));
                  onChangeDelete && onChangeDelete();
                  setIsViewActionsDeleteQuestion(false);
                }}
                style={[stylesModal.modalButton, styles.deleteButton]}>
                <Text style={[stylesModal.modalButtonText]}>Delete</Text>
              </Pressable>
            </View>
          </>
          {/* </View> */}
        </ModalLayout>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  asset: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 100,
  },
  icon: {
    zIndex: 100,
  },
  assetContainer: {
    position: 'relative',
    borderStyle: 'solid',
    borderColor: colors.deleteColor,
    borderRadius: 7,
  },
  assetContainerEdit: {
    borderWidth: 2,
  },
  fromAssetContainer: {
    borderWidth: 2,
    borderColor: colors.borderAssetColor,
  },

  assetEditArrows: {
    width: 5,
    height: 5,
    backgroundColor: colors.deleteColor,
    position: 'absolute',
  },
  actions: {
    gap: 5,
    backgroundColor: colors.backgroundLightColor,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 30,
    minWidth: 180,
    borderRadius: 10,
    paddingVertical: 5,
  },
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    gap: 10,
    marginHorizontal: 10,
    paddingVertical: 5,
  },
  actionText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  assetName: {
    marginHorizontal: 10,
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    borderStyle: 'solid',
    borderEndWidth: 1,
    borderEndColor: 'red',
  },
  deleteText: {
    marginBottom: 10,
    marginRight: 22,
    marginLeft: 11,
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
  },
  modalButtons: {
    position: 'relative',
    marginBottom: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: colors.deleteColor,
    borderColor: colors.deleteColor,
  },
  modalContainer: {
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  ring: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: colors.textSecondColor,
    borderWidth: 1,
    borderStyle: 'solid',
  },
});
