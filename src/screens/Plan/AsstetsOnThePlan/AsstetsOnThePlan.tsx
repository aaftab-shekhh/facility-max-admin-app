import {ConnectionLine} from './ConnectionLine';
import {useAppDispatch, useAppSelector} from '../../../hooks/hooks';
import {
  FC,
  MutableRefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {AssetOnThePlan} from './AssetOnThePlan';
import {getPointsByPageIdTC} from '../../../bll/reducers/point-reducer';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../hooks/useLocalStateSelector';
import {Canvas, Image} from '@shopify/react-native-skia';
import {setNewModuleItem} from '../../../bll/reducers/local-reducer';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {RoomsOnThePlan} from '../RoomsOnThePlan/RoomsOnThePlan';
import {persistor, store} from '../../../bll/store';
import {RoomsButton} from '../RoomsOnThePlan/RoomsButton';
import {useIsFocused} from '@react-navigation/native';

type AssetsOnThePlanProps = {
  zoomLevel: MutableRefObject<number>;
  withImg: number;
  heightImg: number;
  openEstablishRelationship?: () => void;
  openAssetAssignments?: () => void;
  fromAsset?: boolean;
  version: string;
  k: number;
  imageBackGround: any;
  image: any;
  setIsLoading?: (val: boolean) => void;
};

export const AssetsOnThePlan: FC<AssetsOnThePlanProps> = memo(
  ({
    zoomLevel,
    withImg,
    heightImg,
    openEstablishRelationship,
    openAssetAssignments,
    fromAsset,
    version,
    k,
    imageBackGround,
    image,
    setIsLoading,
  }) => {
    const isFocus = useIsFocused();
    const dispatch = useAppDispatch();
    const {isConnected} = useNetInfo();

    const {points: netPoints} = useAppSelector(state => state.points);
    const {points: localPoints} = useAppSelector(state => state.local.db);

    const {hideAssets} = useAppSelector(state => state.plan);
    const {asset} = useAppSelector(state => state.assets);

    const {getLocalPoints} = useLocalStateSelector();

    const [points, setPoints] = useState(
      isConnected ? netPoints : getLocalPoints(version),
    );

    const [UIPoints, setUIPoints] = useState<any>({});
    const UIAssets = useRef<any>({});

    const removeAsset = useCallback((id: string) => {
      delete UIAssets.current[id];
    }, []);

    const setNewUIPoints = useCallback(() => {
      points.forEach(el => {
        if (el.type === 'ARROW') {
          if (el.toId) {
            if (
              !hideAssets[version]?.some(
                ha => ha === el.from?.id || ha === el.to?.id,
              )
            ) {
              setUIPoints((prev: any) => {
                return {
                  ...prev,
                  [el.id]: {...el},
                };
              });
              if (fromAsset) {
                UIAssets.current[el.to.id] = {
                  ...el,
                  pointId: el.id,
                  id: el.toId,
                  name: el.to.name,
                  x: el.toX,
                  y: el.toY,
                  category: el.to.category,
                };
                UIAssets.current[el.from.id] = {
                  ...el,
                  pointId: el.id,
                  id: el.fromId,
                  name: el.from.name,
                  x: el.fromX,
                  y: el.fromY,
                  category: el.from.category,
                };
              }
            }
          }
        } else if (el.type === 'POINT') {
          if (!hideAssets[version]?.some(ha => ha === el.from.id)) {
            UIAssets.current[el.from.id] = {
              ...el,
              pointId: el.id,
              id: el.fromId,
              name: el.from.name,
              x: el.fromX,
              y: el.fromY,
              category: el.from.category,
            };
          }
        }
      });
    }, [version, points, hideAssets, UIAssets, fromAsset]);

    useEffect(() => {
      UIAssets.current = {};
      setUIPoints({});
      setNewUIPoints();
    }, [version, points, hideAssets]);

    useEffect(() => {
      setPoints(isConnected ? netPoints : getLocalPoints(version));
    }, [netPoints, localPoints, isConnected]);

    const getPoints = useCallback(async () => {
      setIsLoading && setIsLoading(true);
      fromAsset && version
        ? await dispatch(
            getPointsByPageIdTC({
              pageId: version,
              params: {
                offset: 0,
                limit: 100,
                rightIncludeAssetId: asset.id,
              },
            }),
          )
        : version &&
          (await dispatch(
            getPointsByPageIdTC({
              pageId: version,
              params: {offset: 0, limit: 1000},
            }),
          ));
      setIsLoading && setIsLoading(false);
    }, [fromAsset, version]);

    useEffect(() => {
      if (isConnected) {
        getPoints();
      } else {
        setPoints(getLocalPoints(version));
      }
    }, [fromAsset, localPoints, isConnected, version, isFocus]);

    const onChange = useCallback(
      ({id, x, y}: {id: string; x: number; y: number}) => {
        setUIPoints((prev: any) => {
          const copy = JSON.parse(JSON.stringify(prev));

          for (let key of Object.keys(copy)) {
            if (copy[key].fromId === id) {
              copy[key] = {
                ...copy[key],
                fromX: x,
                fromY: y,
              };
            } else if (copy[key].toId === id) {
              copy[key] = {
                ...copy[key],
                toX: x,
                toY: y,
              };
            }
          }

          return copy;
        });
      },
      [],
    );

    const onEndChange = useCallback(
      ({id, x, y}: {id: string; x: number; y: number}) => {
        const model = 'points';

        for (let key of Object.keys(UIPoints)) {
          if (UIPoints[key].fromId === id) {
            dispatch(
              setNewModuleItem({
                model,
                id: key,
                body: {
                  fromX: x,
                  fromY: y,
                },
              }),
            );
          } else if (UIPoints[key].toId === id) {
            dispatch(
              setNewModuleItem({
                model,
                id: key,
                body: {
                  toX: x,
                  toY: y,
                },
              }),
            );
          }
        }
      },
      [UIPoints],
    );

    return (
      <>
        <Canvas
          style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
          <Image
            image={imageBackGround}
            fit="contain"
            x={0}
            y={0}
            width={image.withImg}
            height={image.heightImg}
          />
          <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
              <RoomsOnThePlan
                version={version}
                width={image?.withImg}
                height={image?.heightImg}
              />
            </PersistGate>
          </Provider>
          {Object.values(UIPoints).length > 0 &&
            Object.values(UIPoints).map((point: any) => {
              if (point.toId) {
                return (
                  <ConnectionLine
                    key={point?.id}
                    // k={k}
                    point={point}
                    zoomLevel={zoomLevel}
                    removeAsset={removeAsset}
                    pageId={version}
                    width={withImg}
                    height={heightImg}
                    UIPoints={UIPoints}
                    fromX={point?.fromX * k}
                    fromY={point?.fromY * k}
                    toX={point?.toX * k}
                    toY={point?.toY * k}
                    color={point.color}
                  />
                );
              }
            })}
        </Canvas>
        <RoomsButton pageId={version} />

        {UIAssets?.current &&
          Object.values(UIAssets?.current)?.length > 0 &&
          Object.values(UIAssets?.current)?.map((asset: any) => {
            return (
              <AssetOnThePlan
                k={k}
                key={asset.id}
                innerRef={UIAssets}
                asset={asset}
                onEndChange={onEndChange}
                zoomLevel={zoomLevel}
                removeAsset={removeAsset}
                openEstablishRelationship={openEstablishRelationship}
                openAssetAssignments={openAssetAssignments}
                onChange={onChange}
                onChangeDelete={getPoints}
                fromAsset={fromAsset}
                version={version}
              />
            );
          })}
      </>
    );
  },
);
