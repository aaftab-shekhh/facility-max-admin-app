import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {AssetsOnThePlan} from './AsstetsOnThePlan/AsstetsOnThePlan';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../hooks/hooks';
import {
  FC,
  RefObject,
  createRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {AssetType} from '../../types/StateType';
import {createPointsTC} from '../../bll/reducers/point-reducer';
import {useNetInfo} from '@react-native-community/netinfo';
import {setRequest} from '../../bll/reducers/offline-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../enums/offline';
import uuid from 'react-native-uuid';
import {setNewModuleItem} from '../../bll/reducers/local-reducer';
import {useImage} from '@shopify/react-native-skia';
import {SCREEN_WIDTH, stylesModal} from '../../styles/styles';
import RNFS from 'react-native-fs';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import {Preloader} from '../../components/Preloader';
import {ModalLayout} from '../../components/Layouts/ModalLayout';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {colors} from '../../styles/colors';
import {PlotAssetIcon} from '../../assets/icons/PlotAssetIcon';
import {CreateAssetIcon} from '../../assets/icons/CreateAssetIcon';
import {EstablishRelationship} from './ButtomSheetChildren/EstablishRelationship';
import {AssetAssignments} from './ButtomSheetChildren/AssetAssignments';
import {ShowHideAssets} from './ButtomSheetChildren/ShowHideAssets';
import {ChooseAssetFromList} from './ButtomSheetChildren/ChooseAssetFromList';
import {ManageObject} from './ButtomSheetChildren/ManageObjects';
import {MyButton} from '../../components/MyButton';
import ManageObjectIcon from '../../assets/icons/ManageObjectIcon';

type PDFPlanType = {
  isEditMode?: boolean;
  setIsEditMode?: (value: boolean) => void;
  fromAsset?: boolean;
  version: string;
};

export const PDFPlan: FC<PDFPlanType> = memo(
  ({isEditMode, setIsEditMode, fromAsset, version}) => {
    const dispatch = useAppDispatch();
    const {isConnected} = useNetInfo();
    const navigation = useAppNavigation();
    const refZoomLevel = useRef(1);
    const [isModalVisible, setModalVisible] = useState(false);
    const [action, setAction] = useState<string>();

    const refAddAsset = useRef<BottomSheetModal>(null);
    const refShowAssets = useRef<BottomSheetModal>(null);
    const refEstablishRelationship = useRef<BottomSheetModal>(null);
    const refAssetAssignments = useRef<BottomSheetModal>(null);
    const refManageObject = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ['10%', '60%', '100%'], []);

    const {page} = useAppSelector(state => state.plan);
    const {asset} = useAppSelector(state => state.assets);
    const {points} = useAppSelector(state => state.points);
    const zoomableViewRef = createRef<ReactNativeZoomableView>();
    const [isLoading, setIsLoading] = useState(false);
    const {file} = useMemo(() => page, [page]);

    const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);

    const openBottomSheet = useCallback(
      (ref: RefObject<BottomSheetModal>, index?: number) => {
        ref.current?.present();
        setTimeout(() => {
          ref.current?.snapToIndex(index || 1);
        }, 400);
      },
      [],
    );

    const wrapBottomSheet = useCallback((ref: RefObject<BottomSheetModal>) => {
      ref.current?.snapToIndex(0);
    }, []);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const addAssetOnThePlan = (asset: AssetType) => {
      setSelectedAsset(asset);
      refAddAsset.current?.close();
      refManageObject.current?.close();
      setIsEditMode && setIsEditMode(true);
    };

    const renderBackdrop = useCallback(props => {
      return (
        <BottomSheetBackdrop
          {...props}
          pressBehavior={'close'}
          opacity={0.5}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          animatedPosition={0}
          enableTouchThrough={false}
        />
      );
    }, []);

    const k = useMemo(() => 1, []);
    const initialZoom = useMemo(
      () => (file?.width ? SCREEN_WIDTH / file?.width : 1),
      [file?.width],
    );

    const sourceUrl = useMemo(() => file?.url || '', [file]);

    const [image, setImage] = useState<{
      uri: string;
      withImg: number;
      heightImg: number;
    }>({
      uri: '',
      withImg: 1,
      heightImg: 1,
    });

    const convertToImg = useCallback(async () => {
      if (file) {
        try {
          setIsLoading(true);
          const nestedFilePath =
            RNFS.DocumentDirectoryPath + '/file' + `/${file?.key}`;
          const existsDir = await RNFS.exists(
            RNFS.DocumentDirectoryPath + '/file',
          );

          if (!existsDir) {
            await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/file');
          }

          const existsFile = await RNFS.exists(nestedFilePath);

          if (!existsFile) {
            await RNFS.downloadFile({
              fromUrl: sourceUrl,
              toFile: nestedFilePath,
              background: true, // Enable downloading in the background (iOS only)
              discretionary: true, // Allow the OS to control the timing and speed (iOS only)
            }).promise;
          }
          const {uri} = await PdfThumbnail.generate(
            'file://' + nestedFilePath,
            0,
            100,
          );
          setImage({
            uri,
            withImg: file?.width * k,
            heightImg: file?.height * k,
          });
        } catch (err) {
          handleServerNetworkError(err);
        } finally {
          setIsLoading(false);
        }
      }
    }, [file?.width, file?.height, sourceUrl]);

    const zoomableViewStyle = useMemo(() => {
      return [
        styles.box,
        {width: image?.withImg, height: image?.heightImg, zIndex: 5},
      ];
    }, [image.withImg, image?.heightImg]);

    const imgContainerStyle = useMemo(() => {
      return [
        styles.imgContainer,
        {width: image?.withImg, height: image?.heightImg},
      ];
    }, [image.withImg, image?.heightImg]);

    const editLocalCoordinate = useCallback(
      ({id, x, y}: {id: string; x: number; y: number}) => {
        const pointId = uuid.v4().toString();
        const model = 'points';

        dispatch(
          setRequest({
            action: OFFLINE_ACTIONS.CREATE_POINT,
            method: OFFLINE_METHOD.POST,
            model,
            id: pointId,
            body: {
              pageId: page.id,
              fromId: id,
              fromX: x,
              fromY: y,
            },
          }),
        );

        dispatch(
          setNewModuleItem({
            model,
            id: pointId,
            body: {
              id: pointId,
              color: '#FFC107',
              type: 'POINT',
              pageId: page,
              fromId: id,
              fromX: x,
              fromY: y,
              toId: null,
              toX: 0,
              toY: 0,
            },
          }),
        );
      },
      [],
    );

    const editCoordinate = useCallback(
      ({id, x, y}: {id: string; x: number; y: number}) => {
        isConnected
          ? dispatch(
              createPointsTC({
                body: {
                  pageId: page.id,
                  fromId: id,
                  fromX: x,
                  fromY: y,
                },
                route: selectedAsset?.objectGroupId ? 'objects' : 'asset',
              }),
            )
          : editLocalCoordinate({id, x, y});
      },
      [page.id, isConnected, selectedAsset],
    );

    useEffect(() => {
      if (fromAsset) {
        const assetOnThePlan: any = points.find(
          point => point.fromId === asset.id,
        );

        const x = assetOnThePlan?.fromX;
        const y = assetOnThePlan?.fromY;
        // zoomableViewRef.current?.zoomTo(1);

        x && y && zoomableViewRef.current?.moveTo(x, y);
      }
    }, [points, image.withImg, image?.heightImg, asset?.id, fromAsset]);

    useEffect(() => {
      convertToImg();
    }, [sourceUrl]);

    const imageBackGround = useImage(image.uri);

    const ploatActions = useMemo(
      () => [
        {
          text: 'Create New Asset',
          action: 'create',
          icon: (color: string) => <CreateAssetIcon color={color} />,
        },
        {
          text: 'Plot Existing Asset',
          action: 'choose',
          icon: (color: string) => <PlotAssetIcon color={color} />,
        },
        {
          text: 'Manage Objects',
          action: 'manageObject',
          icon: (color: string) => <ManageObjectIcon color={color} />,
        },
      ],
      [],
    );

    return (
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <ReactNativeZoomableView
            maxZoom={10}
            minZoom={0.1}
            initialZoom={initialZoom}
            initialOffsetX={image?.withImg / 2}
            initialOffsetY={image?.heightImg / 2}
            ref={zoomableViewRef}
            bindToBorders={true}
            style={zoomableViewStyle}
            contentHeight={image?.heightImg}
            contentWidth={image?.withImg}
            onPanResponderGrant={event => {
              if (isEditMode) {
                const x = +(event.nativeEvent.locationX / k).toFixed(0);
                const y = +(event.nativeEvent.locationY / k).toFixed(0);
                editCoordinate({id: selectedAsset!.id, x, y});
                setIsEditMode && setIsEditMode(false);
                setSelectedAsset && setSelectedAsset(null);
              }
            }}
            onZoomEnd={(event, gestureState, zoomableViewEventObject) => {
              refZoomLevel.current = zoomableViewEventObject.zoomLevel;
            }}
            onShouldBlockNativeResponder={() => true}>
            <View style={imgContainerStyle}>
              {image.uri && (
                <AssetsOnThePlan
                  k={k}
                  version={version}
                  image={image}
                  zoomLevel={refZoomLevel}
                  withImg={image?.withImg}
                  heightImg={image?.heightImg}
                  fromAsset={fromAsset}
                  imageBackGround={imageBackGround}
                  openEstablishRelationship={() => {
                    openBottomSheet(refEstablishRelationship);
                  }}
                  openAssetAssignments={() => {
                    openBottomSheet(refAssetAssignments, 2);
                  }}
                  setIsLoading={setIsLoading}
                />
              )}
            </View>
          </ReactNativeZoomableView>
          {isLoading && <Preloader />}
          {!fromAsset && (
            <>
              {isEditMode ? (
                <View style={styles.addAssetButton}>
                  <Pressable style={stylesModal.modalButton}>
                    <Text style={stylesModal.modalButtonText}>
                      Select a point on the plan to place the asset
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.addAssetButton}>
                  <MyButton
                    action={() => {
                      openBottomSheet(refShowAssets);
                    }}
                    text="Show / Hide"
                    style="disabled"
                  />
                  <MyButton action={toggleModal} text="Plot On Plan" />
                </View>
              )}
            </>
          )}
          <BottomSheetModal
            ref={refAddAsset}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={{backgroundColor: colors.backgroundMainColor}}>
            <ChooseAssetFromList
              pageId={version}
              onChangeAsset={addAssetOnThePlan}
            />
          </BottomSheetModal>
          <BottomSheetModal
            ref={refShowAssets}
            snapPoints={snapPoints}
            backgroundStyle={{backgroundColor: colors.backgroundMainColor}}>
            <ShowHideAssets pageId={version} />
          </BottomSheetModal>
          <BottomSheetModal
            ref={refAssetAssignments}
            snapPoints={snapPoints}
            backgroundStyle={{backgroundColor: colors.backgroundMainColor}}>
            <AssetAssignments
              pageId={version}
              showOnPlan={() => {
                wrapBottomSheet(refAssetAssignments);
                refZoomLevel.current = 1;
              }}
            />
          </BottomSheetModal>
          <BottomSheetModal
            ref={refManageObject}
            snapPoints={snapPoints}
            backgroundStyle={{backgroundColor: colors.backgroundMainColor}}>
            <ManageObject
              pageId={version}
              onChangeAssetObgect={addAssetOnThePlan}
              zoomableViewRef={zoomableViewRef}
              refManageObject={refManageObject}
            />
          </BottomSheetModal>
          <BottomSheetModal
            ref={refEstablishRelationship}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={{backgroundColor: colors.backgroundMainColor}}>
            <EstablishRelationship
              pageId={version}
              onChangeAsset={() => {
                refEstablishRelationship.current?.close();
              }}
              onChangeKeyboard={(refName, value) => {
                value
                  ? refName === 'refEstablishRelationship' &&
                    refEstablishRelationship.current?.snapToIndex(1)
                  : refName === 'refEstablishRelationship' &&
                    refEstablishRelationship.current?.snapToIndex(0);
              }}
            />
          </BottomSheetModal>
          <ModalLayout
            isModalVisible={isModalVisible}
            title="Add Asset to Plan"
            toggleModal={toggleModal}>
            <View style={stylesModal.modalContainer}>
              <View style={styles.modalContainer}>
                {ploatActions.map(el => (
                  <Pressable
                    key={el.text}
                    onPress={() => setAction(el.action)}
                    style={[
                      styles.button,
                      action === el.action && styles.buttonActive,
                    ]}>
                    {el.icon(
                      action === el.action
                        ? colors.mainActiveColor
                        : colors.textSecondColor,
                    )}
                    <Text style={styles.buttonText}>{el.text}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={[stylesModal.modalPickers]}>
                <View
                  style={[
                    stylesModal.modalButtons,
                    {position: 'relative', marginHorizontal: 0},
                  ]}>
                  <Pressable
                    onPress={() => {
                      toggleModal();
                    }}
                    style={[
                      stylesModal.modalButton,
                      stylesModal.modalButtonReset,
                    ]}>
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
                      switch (action) {
                        case 'create':
                          navigation.navigate('Plan', {
                            screen: 'AddAsset',
                            params: {planId: version},
                          });
                          break;
                        case 'choose':
                          openBottomSheet(refAddAsset);
                          break;
                        case 'manageObject':
                          openBottomSheet(refManageObject);
                          break;
                      }
                      toggleModal();
                    }}
                    style={stylesModal.modalButton}>
                    <Text style={stylesModal.modalButtonText}>Continue</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ModalLayout>
        </View>
      </BottomSheetModalProvider>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  box: {
    flex: 1,
    position: 'absolute',
  },
  imgContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  img: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    borderColor: 'red',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  addAssetButton: {
    flexDirection: 'row',
    gap: 20,
    paddingBottom: 30,
    marginHorizontal: 15,
    flex: 1,
    position: 'absolute',
    bottom: 0,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 8,
  },
  buttonActive: {
    borderWidth: 1,
    marginHorizontal: 0,
    backgroundColor: '#1b6bc02a',
    borderRadius: 12,
    borderStyle: 'solid',
    borderColor: colors.mainActiveColor,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.textColor,
  },
  modalContainer: {
    justifyContent: 'space-between',
    gap: 5,
    marginVertical: 30,
  },
});
