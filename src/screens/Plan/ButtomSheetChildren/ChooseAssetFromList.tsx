import {
  ActivityIndicator,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colors} from '../../../styles/colors';
import {FC, memo, useEffect, useState} from 'react';
import {SearchIcon} from '../../../assets/icons/SearchIcon';
import {useAppSelector} from '../../../hooks/hooks';
import FastImage from 'react-native-fast-image';
import {AssetType, CategoryAssets} from '../../../types/StateType';
import {dropdownIcons} from '../../../bll/icons';
import {AssetGetByEntityInclude} from '../../../enums/assets';
import {ArrowUpIcon} from '../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../assets/icons/ArrowDownIcon';
import {assetsAPI} from '../../../api/assetsApi';
import {sortedBy} from '../../../utils/sorted';
import {useLocalStateSelector} from '../../../hooks/useLocalStateSelector';
import {useNetInfo} from '@react-native-community/netinfo';
import {useDebounce} from '../../../hooks/useDebounce';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {handleServerNetworkError} from '../../../utils/handleServerNetworkUtils';

type TypeProps = {
  pageId: string;
  type: {assetsCount: number; id: string; name: string; newCount: number};
  category: any;
  onChangeAsset: (asset: AssetType) => void;
};

const Type: FC<TypeProps> = ({pageId, type, category, onChangeAsset}) => {
  const {points} = useAppSelector(state => state.points);
  const {isConnected} = useNetInfo();

  const {assetsCount, name, newCount} = type;
  const buildingId = useAppSelector(state => state.buildings.building.id);
  const {
    asset,
    assetcategory,
    points: localPoints,
  } = useAppSelector(state => state.local.db);

  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [count, setCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderItem = item => {
    return (
      <Pressable
        key={item.id}
        style={[
          styles.assetContainer,
          item.pointsFrom?.length !== 0 && {opacity: 0.3},
        ]}
        onPress={() => {
          onChangeAsset(item);
        }}
        disabled={item.pointsFrom?.length !== 0}>
        <FastImage
          style={[
            styles.img,
            item.category.color && {backgroundColor: item.category.color},
          ]}
          source={
            item?.category?.file
              ? {uri: item?.category?.file.url}
              : dropdownIcons[item?.category?.name]
          }
          defaultSource={dropdownIcons[item?.category?.name]}
        />
        <Text style={styles.assetName}>{item.name}</Text>
      </Pressable>
    );
  };

  const getAssets = async () => {
    try {
      setIsLoading(true);
      const res = await assetsAPI.getAssetsByAntity({
        assignedForPageId: pageId,
        typeIdes: [type.id],
        buildingIdes: [buildingId],
        includeCriteria: [AssetGetByEntityInclude.CATEGORY],
        offset: 0,
        limit: 100,
      });
      setAssets(res.data.assets);
      setCount(res.data.count);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssets = async () => {
    try {
      setIsLoad(true);
      const res = await assetsAPI.getAssetsByAntity({
        assignedForPageId: pageId,
        typeIdes: [type.id],
        buildingIdes: [buildingId],
        includeCriteria: [AssetGetByEntityInclude.CATEGORY],
        offset: assets.length,
        limit: 100,
      });
      setAssets(prev => [...prev, ...res.data.assets]);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      isConnected
        ? getAssets()
        : setAssets(
            Object.values(asset)
              .filter(a => a.buildingId === buildingId && a.typeId === type.id)
              .map(el => ({
                ...el,
                category: assetcategory[el.categoryId],
                pointsFrom: Object.values(localPoints).filter(
                  point => point.fromId === el.id && point.pageId === pageId,
                ),
              })),
          );
    }
  }, [isOpen, pageId, points]);

  return (
    <>
      <Pressable style={styles.item} onPress={toggleIsOpen}>
        <View style={styles.row}>
          <FastImage
            source={
              category.file
                ? {uri: category.file.url}
                : dropdownIcons[category.name]
            }
            style={[
              styles.icon,
              category.color && {backgroundColor: category.color},
            ]}
            defaultSource={dropdownIcons[category.name]}
          />
          {newCount !== 0 && (
            <View style={[styles.dotNew, {top: 0}]}>
              <Text style={styles.countText}>{newCount}</Text>
            </View>
          )}

          <View>
            <Text style={styles.itemText}>{name}</Text>
            <Text style={styles.itemCountText}>{assetsCount} assets</Text>
          </View>
        </View>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </Pressable>
      {isOpen && (
        <View style={[styles.flatList]}>
          {!isLoading ? (
            sortedBy('name', assets).map(renderItem)
          ) : (
            <ActivityIndicator color={colors.mainActiveColor} />
          )}
          {count > assets.length ? (
            isLoad ? (
              <ActivityIndicator color={colors.mainActiveColor} />
            ) : (
              <Text onPress={loadAssets} style={styles.viewMore}>
                View More
              </Text>
            )
          ) : null}
        </View>
      )}
    </>
  );
};

type SectionProps = {
  category: CategoryAssets;
  pageId: string;
  onChangeAsset: (asset: AssetType) => void;
};

const Category: FC<SectionProps> = memo(({category, pageId, onChangeAsset}) => {
  const {isConnected} = useNetInfo();
  const {getLocalAssetTypes} = useLocalStateSelector();
  const {id, name, file, color, assetsCount, newCount} = category;
  const buildingId = useAppSelector(state => state.buildings.building.id);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [types, setTypes] = useState<any[]>([]);
  const [typesCount, setTypesCount] = useState<number>(0);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderItem = item => {
    return (
      <Type
        key={item.id}
        type={item}
        pageId={pageId}
        category={category}
        onChangeAsset={onChangeAsset}
      />
    );
  };

  const getTypes = async () => {
    try {
      setIsLoading(true);
      const res = await assetsAPI.getTypesAssets({
        buildingId,
        categoryIdes: [id],
        offset: 0,
        limit: 100,
      });
      setTypes(res.data.types);
      setTypesCount(res.data.count);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTypes = async () => {
    if (typesCount > types.length) {
      try {
        setIsLoad(true);
        const res = await assetsAPI.getTypesAssets({
          buildingId,
          categoryIdes: [id],
          offset: types.length,
          limit: 100,
        });
        setTypes(prev => [...prev, ...res.data.types]);
      } catch (err) {
        handleServerNetworkError(err.response.data);
      } finally {
        setIsLoad(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      isConnected
        ? getTypes()
        : setTypes(getLocalAssetTypes({categoryId: id, buildingId}));
    }
  }, [isOpen, pageId]);

  return (
    <>
      <Pressable
        style={styles.item}
        onPress={toggleIsOpen}
        disabled={assetsCount === 0}>
        <View style={[styles.row, {position: 'relative'}]}>
          <FastImage
            source={file ? {uri: file.url} : dropdownIcons[name]}
            style={[styles.icon, color && {backgroundColor: color}]}
            defaultSource={dropdownIcons[name]}
          />
          {newCount > 0 && (
            <View style={[styles.dotNew, {top: 0}]}>
              <Text style={styles.countText}>{newCount}</Text>
            </View>
          )}
          <View>
            <Text style={styles.itemText}>{name}</Text>
            <Text style={styles.itemCountText}>{assetsCount} assets</Text>
          </View>
        </View>
        {assetsCount !== 0 && (
          <>{isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</>
        )}
      </Pressable>
      {isOpen && (
        <View style={[styles.flatList]}>
          {!isLoading ? (
            sortedBy(
              'name',
              types.filter(el => el.assetsCount !== 0),
            ).map(renderItem)
          ) : (
            <ActivityIndicator color={colors.mainActiveColor} />
          )}
          {typesCount > types.length ? (
            isLoad ? (
              <ActivityIndicator color={colors.mainActiveColor} />
            ) : (
              <Text onPress={loadTypes} style={styles.viewMore}>
                View More
              </Text>
            )
          ) : null}
        </View>
      )}
    </>
  );
});

type ChooseAssetFromListProps = {
  pageId: string;
  onChangeAsset: (asset: AssetType) => void;
  onChangeKeyboard?: (refName: string, value: boolean) => void;
};

export const ChooseAssetFromList: FC<ChooseAssetFromListProps> = ({
  pageId,
  onChangeAsset,
  onChangeKeyboard,
}) => {
  const {isConnected} = useNetInfo();
  const insets = useSafeAreaInsets();
  const {getLocalAssetCategory} = useLocalStateSelector();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [categoriesAssets, setCategoriesAssets] = useState<any[]>([]);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const buildingId = useAppSelector(state => state.buildings.building.id);

  const [assets, setAssets] = useState<AssetType[]>([]);

  const [keyWord, setKeyWord] = useState<string>('');

  const debouncedKeyWord = useDebounce(keyWord, 400);

  const renderItem: ListRenderItem<CategoryAssets> = ({item}) => (
    <Category category={item} pageId={pageId} onChangeAsset={onChangeAsset} />
  );

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const res = await assetsAPI.getCategoriesAssets({
        offset: 0,
        limit: 100,
        buildingId,
      });
      setCategoriesAssets(res.data.categories);
      setCategoriesCount(res.data.count);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    if (categoriesAssets.length < categoriesCount) {
      try {
        setIsLoad(true);
        const res = await assetsAPI.getCategoriesAssets({
          offset: categoriesAssets.length,
          limit: 100,
          buildingId,
        });
        setCategoriesAssets(prev => [...prev, ...res.data.categories]);
      } catch (err) {
        handleServerNetworkError(err.response.data);
      } finally {
        setIsLoad(false);
      }
    }
  };

  const getAssets = async () => {
    try {
      setIsLoading(true);
      const res = await assetsAPI.getAssetsByAntity({
        assignedForPageId: pageId,
        searchString: debouncedKeyWord,
        buildingIdes: [buildingId],
        includeCriteria: [AssetGetByEntityInclude.CATEGORY],
      });
      setAssets(res.data.assets);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isConnected
      ? getCategories()
      : setCategoriesAssets(getLocalAssetCategory({buildingId}));
  }, [buildingId, isConnected]);

  useEffect(() => {
    if (debouncedKeyWord) {
      getAssets();
    } else {
      setAssets([]);
    }
  }, [debouncedKeyWord]);

  return (
    <NativeViewGestureHandler disallowInterruption={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Asset from the list</Text>
        <Text style={styles.subTitle}>Pinch the desired asset</Text>
        <View style={styles.containerSearch}>
          <View style={styles.inputItem}>
            <SearchIcon />
            <TextInput
              placeholder={'Search for asset'}
              onChangeText={setKeyWord}
              placeholderTextColor={colors.textSecondColor}
              onFocus={() =>
                onChangeKeyboard && onChangeKeyboard('refAddAsset', true)
              }
              style={styles.input}
            />
          </View>
        </View>

        {assets?.length > 0 ? (
          <BottomSheetFlatList
            nestedScrollEnabled={true}
            data={assets}
            style={[{marginBottom: insets.bottom}]}
            contentContainerStyle={[styles.flatList, {gap: 5}]}
            renderItem={({item}) => {
              return (
                <Pressable
                  key={item.id}
                  style={styles.assetContainer}
                  onPress={() => onChangeAsset(item)}>
                  <FastImage
                    style={[
                      styles.icon,
                      item.category.color && {
                        backgroundColor: item.category.color,
                      },
                    ]}
                    source={
                      item.category?.file
                        ? {uri: item.category?.file.url}
                        : dropdownIcons[item.category?.name]
                    }
                    defaultSource={require('../../../assets/img/assets/asset.png')}
                  />
                  <Text style={styles.assetName}>{item.name}</Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={() => {
              if (isLoading) {
                return <ActivityIndicator color={colors.mainActiveColor} />;
              }
            }}
          />
        ) : (
          categoriesAssets &&
          categoriesAssets.length > 0 && (
            <BottomSheetFlatList
              showsVerticalScrollIndicator={false}
              onScrollBeginDrag={() => {
                return;
              }}
              onEndReached={loadCategories}
              onEndReachedThreshold={0}
              data={categoriesAssets.filter(el => el.assetsCount > 0)}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              style={[{marginBottom: insets.bottom}]}
              contentContainerStyle={[styles.flatList]}
              nestedScrollEnabled={true}
              ListEmptyComponent={() => {
                if (isLoading) {
                  return <ActivityIndicator color={colors.mainActiveColor} />;
                }
              }}
              ListFooterComponent={() => {
                if (isLoad) {
                  return <ActivityIndicator color={colors.mainActiveColor} />;
                }
              }}
            />
          )
        )}
      </View>
    </NativeViewGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  subTitle: {
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 21,
  },
  containerSearch: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.backgroundGreyColor,
    borderRadius: 8,
    marginVertical: 8,
  },
  inputItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.backgroundMainColor,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: colors.textColor,
  },
  flatList: {
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  assetContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 10,
    gap: 10,
  },
  img: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  assetName: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textColor,
    lineHeight: 20,
  },
  itemCountText: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.textSecondColor,
    lineHeight: 15,
  },
  dotNew: {
    position: 'absolute',
    top: -5,
    left: 18,
    width: 15,
    height: 15,
    backgroundColor: 'red',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.bottomActiveTextColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.bottomActiveTextColor,
  },
  viewMore: {
    textAlign: 'center',
    color: colors.mainActiveColor,
  },
});
