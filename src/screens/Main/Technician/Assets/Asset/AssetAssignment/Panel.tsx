import {useNetInfo} from '@react-native-community/netinfo';
import {FC, memo, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {stylesModal} from '../../../../../../styles/styles';
import {InputItem} from '../../../../../../components/InputItam';
import {setNewModuleItem} from '../../../../../../bll/reducers/local-reducer';
import {DeleteIcon} from '../../../../../../assets/icons/DeleteIcon';
import {colors} from '../../../../../../styles/colors';
import {AssetType, RoomType} from '../../../../../../types/StateType';
import {arrayToString} from '../../../../../../utils/arrayToString';
import {AddAssets} from '../../../../../../components/AddAssets';
import {AddRooms} from '../../../../../../components/AddRooms';
import LocationIcon from '../../../../../../assets/icons/LocationIcon';
import {AddObjectGroups} from '../../../../../../components/AddObjectGroups';
import {adjustColor} from '../../../../../../utils/adjustColor';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';

export type PanelType = {
  id: string;
  panelNumber: number;
  roomIdes?: string;
  assetIdes?: string;
  pageIdes: string[];
  folderId: string;
  assignmentDetails: string[];
  createdAt: string;
  updatedAt: string;
  rooms: {id: string; name: string}[];
  assets: {id: string; name: string}[];
  objectGroups: {id: string; name: string}[];
};

type PanelProps = {
  panel: PanelType;
  update: () => void;
  pageId?: string;
  showOnPlan?: () => void;
};

export const Panel: FC<PanelProps> = memo(
  ({panel, update, pageId, showOnPlan}) => {
    const dispatch = useAppDispatch();
    const {isConnected} = useNetInfo();
    const {asset} = useAppSelector(state => state.assets);
    const {points: netPoints} = useAppSelector(state => state.points);
    const {rooms: netRooms} = useAppSelector(state => state.plan);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [assets, setAssets] = useState<AssetType[]>([]);
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [details, setDetails] = useState<string[]>([]);
    const [objectGroups, setObjectGroups] = useState<any[]>([]);

    const toggleModal = () => {
      setIsModalVisible(!isModalVisible);
    };

    const save = async () => {
      try {
        const body: any = {};
        if (assets.length > 0) {
          body.assetIdes = assets.map(el => el.id);
        }
        if (rooms.length > 0) {
          body.roomIdes = rooms.map(el => el.id);
        }
        if (objectGroups.length > 0) {
          body.objectGroupIdes = objectGroups.map(el => el.id);
        }
        if (details.length > 0) {
          body.assignmentDetails = details;
        }

        await assetsAPI.updatePanel({
          id: panel.id,
          body,
        });

        update();

        toggleModal();
      } catch (err) {
        handleServerNetworkError(err.response.data);
        console.log('edit panel ==>>', err);
      }
    };

    const saveLocal = () => {
      try {
        const model = 'assignmentpanel';

        const body: any = {
          id: panel.id,
          panelNumber: panel.panelNumber,
          assetIdes: assets.map(el => el.id),
          roomIdes: rooms.map(el => el.id),
          objectGroupIdes: objectGroups.map(el => el.id),
          assignmentDetails: details,
          folderId: panel.folderId,
          createdAt: panel.createdAt,
          updatedAt: new Date().toISOString(),
        };

        dispatch(
          setNewModuleItem({
            model,
            id: panel.id,
            body,
          }),
        );
        toggleModal();
        update();
      } catch (err) {
        handleServerNetworkError(err.response.data);
        console.log(err);
      }
    };

    const currentCount = useMemo(
      () => assets.length + rooms.length + details.length + objectGroups.length,
      [assets.length, rooms.length, details.length, objectGroups.length],
    );

    const stylePanel = useMemo(
      () =>
        !!panel.assignmentDetails?.length ||
        !!panel.assets?.length ||
        !!panel.objectGroups?.length ||
        !!panel.rooms?.length,
      [
        panel.assets.length,
        panel.rooms.length,
        panel.assignmentDetails.length,
        panel.objectGroups.length,
      ],
    );

    useEffect(() => {
      if (panel.assets.length > 0) {
        setAssets(panel.assets as AssetType[]);
      }
      if (panel.rooms.length > 0) {
        setRooms(panel.rooms as RoomType[]);
      }
      if (panel.assignmentDetails.length > 0) {
        setDetails(panel.assignmentDetails as string[]);
      }
      if (panel.objectGroups.length > 0) {
        setObjectGroups(panel.objectGroups as any[]);
      }
    }, [panel]);

    const [isLocationView, setIsLocationView] = useState(false);

    useEffect(() => {
      setIsLocationView(false);
    }, [panel]);

    return (
      <>
        <Pressable
          style={[
            styles.tableItem,
            // panel?.panelNumber % 2 === 0 && styles.revers,
          ]}
          onPress={toggleModal}>
          <View style={{flex: 1, paddingLeft: 10, paddingVertical: 10, gap: 2}}>
            {isLocationView && !!pageId && (
              <TouchableOpacity
                style={{
                  left: -5,
                  top: -10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.borderAssetColor,
                  gap: 9,
                  padding: 6,
                  borderRadius: 6,
                }}
                onPress={showOnPlan}>
                <LocationIcon />
                <Text
                  style={{color: colors.bottomActiveTextColor, fontSize: 12}}>
                  Show on plan
                </Text>
              </TouchableOpacity>
            )}
            <View style={componentStyles.items}>
              {!!panel.assignmentDetails?.length && (
                <View
                  style={[
                    componentStyles.selectedStyle,
                    {
                      borderColor: colors.textSecondColor,
                      backgroundColor: adjustColor(colors.textSecondColor, 0.1),
                    },
                  ]}>
                  <Text
                    style={[
                      componentStyles.textSelectedStyle,
                      {color: colors.textSecondColor},
                    ]}>
                    {arrayToString(panel.assignmentDetails)}
                  </Text>
                </View>
              )}
              {panel.assets?.length > 0 && (
                <>
                  {panel.assets.map(item => {
                    const disabled =
                      !!pageId && !netPoints.some(el => el.from.id === item.id);
                    if (!isLocationView && !disabled) {
                      setIsLocationView(true);
                    }
                    return (
                      <View
                        key={item.id}
                        style={[
                          componentStyles.selectedStyle,
                          item.category?.color && {
                            borderColor: item.category?.color,
                            backgroundColor: adjustColor(
                              item.category?.color,
                              0.2,
                            ),
                          },

                          disabled && componentStyles.disabledStyle,
                        ]}>
                        <Text
                          style={[
                            componentStyles.textSelectedStyle,
                            item.category?.color && {
                              color: item.category?.color,
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </View>
                    );
                  })}
                </>
              )}
              {panel.rooms?.length > 0 && (
                <>
                  {panel.rooms.map(item => {
                    const disabled =
                      !!pageId && !netRooms.some(el => el.id === item?.id);
                    if (!isLocationView && !disabled) {
                      setIsLocationView(true);
                    }
                    return (
                      <View
                        key={item.id}
                        style={[
                          componentStyles.selectedStyle,
                          {
                            backgroundColor: adjustColor(
                              colors.mainActiveColor,
                              0.2,
                            ),
                          },
                          disabled && componentStyles.disabledStyle,
                        ]}>
                        <Text style={[componentStyles.textSelectedStyle]}>
                          {item.name}
                        </Text>
                      </View>
                    );
                  })}
                </>
              )}
              {panel.objectGroups?.length > 0 && (
                <>
                  {panel.objectGroups.map(item => {
                    // const disabled =
                    //   !!pageId && !netRooms.some(el => el.id === item?.id);
                    // if (!isLocationView && !disabled) {
                    //   setIsLocationView(true);
                    // }
                    return (
                      <View
                        key={item.id}
                        style={[
                          componentStyles.selectedStyle,
                          item.category?.color && {
                            borderColor: item.category?.color,
                            backgroundColor: adjustColor(
                              item.category?.color,
                              0.2,
                            ),
                          },
                          // disabled && componentStyles.disabledStyle,
                        ]}>
                        <Text
                          style={[
                            componentStyles.textSelectedStyle,
                            item.category?.color && {
                              color: item.category?.color,
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </View>
                    );
                  })}
                </>
              )}
            </View>

            {!panel.assignmentDetails.length &&
              !panel.assets.length &&
              !panel.rooms.length && (
                <Text
                  style={[styles.tableItemName, styles.headerItemInputText]}>
                  Free panel
                </Text>
              )}
          </View>
          <View
            style={[
              styles.tableItemCount,
              stylePanel && styles.tableItemCountActive,
            ]}>
            <Text style={styles.tableItemCountText}>{panel?.panelNumber}</Text>
          </View>
        </Pressable>
        <ModalLayout
          title="Assignment settings"
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}>
          <ScrollView contentContainerStyle={{gap: 10, paddingHorizontal: 5}}>
            <AddAssets
              buildingId={asset.buildingId!}
              values={assets}
              onChange={setAssets}
              maxCount={5}
              assetId={asset.id}
              currentCount={rooms.length + details.length + objectGroups.length}
            />
            <AddRooms
              buildingId={asset.building.id}
              values={rooms}
              onChange={setRooms}
              maxCount={5}
              currentCount={
                assets.length + details.length + objectGroups.length
              }
            />
            <AddObjectGroups
              pageId={pageId}
              values={objectGroups}
              onChange={setObjectGroups}
              maxCount={5}
              currentCount={rooms.length + details.length + assets.length}
            />

            <InputItem
              label="Custom text"
              handleChange={(val: string) => {
                if (val === '') {
                  setDetails([]);
                } else {
                  setDetails([val]);
                }
              }}
              defaultValue={details[0]}
              placeholder="Write here something"
              multiline
            />

            {currentCount > 5 && (
              <View style={[componentStyles.subLabel]}>
                <View style={componentStyles.mark}>
                  <Text style={componentStyles.markText}>!</Text>
                </View>
                <Text style={componentStyles.labelErrorText}>
                  You cannot select more than 5
                </Text>
              </View>
            )}

            {stylePanel && (
              <Pressable style={[styles.headerItem, {marginTop: 10}]}>
                <DeleteIcon fill={colors.deleteColor} />
                <Text style={styles.deleteButtonText}>Clear panel</Text>
              </Pressable>
            )}

            <View style={[stylesModal.modalButtons, styles.modalButtons]}>
              <Pressable
                onPress={toggleModal}
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
                disabled={currentCount > 5}
                onPress={isConnected ? save : saveLocal}
                style={stylesModal.modalButton}>
                <Text style={stylesModal.modalButtonText}>Save</Text>
              </Pressable>
            </View>
          </ScrollView>
        </ModalLayout>
      </>
    );
  },
);

const componentStyles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.mainActiveColor,
    backgroundColor: '#009ef72c',
    // backgroundColor: colors.mainActiveColor,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  disabledStyle: {
    opacity: 0.3,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 12,
    color: colors.mainActiveColor,
  },
  subLabel: {
    flexDirection: 'row',
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
  },
  labelError: {
    marginTop: 5,
  },
  labelErrorText: {
    flex: 1,
    color: colors.deleteColor,
    fontSize: 12,
    lineHeight: 18,
  },
  mark: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: colors.deleteColor,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: 5,
  },
  markText: {
    color: colors.deleteColor,
    fontSize: 10,
  },
});
