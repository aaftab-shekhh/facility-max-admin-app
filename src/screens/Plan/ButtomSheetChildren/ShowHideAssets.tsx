import {
  ActivityIndicator,
  Image,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colors} from '../../../styles/colors';
import {FC, memo, useEffect, useMemo, useState} from 'react';
import {SearchIcon} from '../../../assets/icons/SearchIcon';
import {useAppDispatch, useAppSelector} from '../../../hooks/hooks';
import {
  AssetType,
  AssetTypeType,
  CategoryAssets,
  RoomOnThePlanType,
} from '../../../types/StateType';
import {showHideAsset, showHideRoom} from '../../../bll/reducers/plan-Reducer';
import FastImage from 'react-native-fast-image';
import {ArrowUpIcon} from '../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../assets/icons/ArrowDownIcon';
import {dropdownIcons} from '../../../bll/icons';
import {assetsAPI} from '../../../api/assetsApi';
import {AssetGetByEntityInclude} from '../../../enums/assets';
import {sortedBy} from '../../../utils/sorted';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {handleServerNetworkError} from '../../../utils/handleServerNetworkUtils';
import {NotFound} from '../../../components/NotFound';
import {useDebounce} from '../../../hooks/useDebounce';

type TypeProps = {
  pageId: string;
  type: {assetsCount: number; id: string; name: string; newCount: number};
  category: any;
};

const Type: FC<TypeProps> = ({pageId, type, category}) => {
  const dispatch = useAppDispatch();

  const {assetsCount, name, newCount} = type;
  const buildingId = useAppSelector(state => state.buildings.building.id);
  const {hideAssets} = useAppSelector(state => state.plan);

  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [count, setCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderItem = (item: AssetTypeType) => {
    return (
      <Pressable key={item.id} style={[styles.assetContainer]}>
        <View style={styles.row}>
          <FastImage
            style={[
              styles.img,
              {position: 'relative'},
              item?.category.color && {backgroundColor: item?.category.color},
            ]}
            source={
              item?.category?.file
                ? {uri: item?.category?.file.url}
                : dropdownIcons[item?.category?.name]
            }
            defaultSource={dropdownIcons[item?.category?.name]}
          />
          {item.pointsFrom.length === 0 && <View style={styles.dotNew} />}
          <Text style={styles.assetName}>{item.name}</Text>
        </View>
        <Pressable
          onPress={() => dispatch(showHideAsset({pageId, assetId: item.id}))}
          hitSlop={15}>
          {item.pointsFrom.length > 0 && (
            <Image
              source={
                hideAssets && !hideAssets[pageId]?.some(el => el === item.id)
                  ? require('../../../assets/img/eye.png')
                  : require('../../../assets/img/eye2.png')
              }
            />
          )}
        </Pressable>
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
        offset: 0,
        limit: 100,
        includeCriteria: [AssetGetByEntityInclude.CATEGORY],
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
      getAssets();
    }
  }, [isOpen, pageId]);

  return (
    <View style={{flex: 1}}>
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
    </View>
  );
};

type SectionProps = {
  category: CategoryAssets;
  pageId: string;
};

const Category: FC<SectionProps> = memo(({category, pageId}) => {
  const {id, name, color, file, assetsCount, newCount} = category;
  const buildingId = useAppSelector(state => state.buildings.building.id);

  const [isOpen, setIsOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [typesCount, setTypesCount] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderItem = item => {
    return (
      <Type key={item.id} type={item} pageId={pageId} category={category} />
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
      getTypes();
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
            source={file?.url ? {uri: file.url} : dropdownIcons[name]}
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

type ShowHideAssetsProps = {
  pageId: string;
};

export const ShowHideAssets: FC<ShowHideAssetsProps> = ({pageId}) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const {rooms} = useAppSelector(state => state.plan);
  const {hideAssets} = useAppSelector(state => state.plan);
  const buildingId = useAppSelector(state => state.buildings.building.id);

  const [mode, setMode] = useState('assets');
  const [keyWord, setKeyWord] = useState<string>('');

  const [categoriesAssets, setCategoriesAssets] = useState([]);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [assets, setAssets] = useState<AssetType[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const debouncedKeyWord = useDebounce(keyWord, 400);

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

  const ListHeaderComponent = () => {
    return (
      <View style={styles.header}>
        <Pressable
          onPress={() => setMode('assets')}
          style={[
            styles.headerButton,
            mode === 'assets' && styles.headerButtonActive,
          ]}>
          <Text style={styles.headerButtonText}>Assets</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('rooms')}
          style={[
            styles.headerButton,
            mode === 'rooms' && styles.headerButtonActive,
          ]}>
          <Text style={styles.headerButtonText}>Rooms</Text>
        </Pressable>
      </View>
    );
  };

  const renderAssets: ListRenderItem<CategoryAssets> = ({item}) => {
    return <Category category={item} pageId={pageId} />;
  };

  const renderRooms: ListRenderItem<RoomOnThePlanType> = ({item}) => {
    return (
      <View style={styles.row}>
        <View style={styles.row}>
          <Image source={require('../../../assets/img/room.png')} />
          <Text>{item.name}</Text>
        </View>
        <Pressable onPress={() => dispatch(showHideRoom(item.id))} hitSlop={15}>
          <Image
            source={
              item.show
                ? require('../../../assets/img/eye.png')
                : require('../../../assets/img/eye2.png')
            }
          />
        </Pressable>
      </View>
    );
  };

  useEffect(() => {
    getCategories();
  }, [buildingId]);

  const data = useMemo(() => {
    switch (mode) {
      case 'assets':
        if (debouncedKeyWord) {
          return assets;
        } else {
          return sortedBy(
            'name',
            categoriesAssets.filter(el => el.assetsCount > 0),
          );
        }
      case 'rooms':
        return sortedBy('name', rooms);
    }
  }, [mode, categoriesAssets, rooms, assets, debouncedKeyWord]);

  useEffect(() => {
    if (debouncedKeyWord) {
      mode === 'assets' ? getAssets() : getCategories();
    } else {
      setAssets([]);
    }
  }, [debouncedKeyWord]);

  const renderItem: ListRenderItem<AssetType> = ({item}) => {
    return (
      <Pressable key={item.id} style={[styles.assetContainer]}>
        <View style={styles.row}>
          <FastImage
            style={[
              styles.img,
              {position: 'relative'},
              item?.category?.color && {backgroundColor: item?.category?.color},
            ]}
            source={
              item?.category?.file
                ? {uri: item?.category?.file.url}
                : dropdownIcons[item?.category?.name]
            }
            defaultSource={dropdownIcons[item?.category?.name]}
          />
          {item.pointsFrom.length === 0 && <View style={styles.dotNew} />}
          <Text style={styles.assetName}>{item.name}</Text>
        </View>
        {item.pointsFrom.length > 0 && (
          <Pressable
            onPress={() => dispatch(showHideAsset({pageId, assetId: item.id}))}
            hitSlop={15}>
            <Image
              source={
                hideAssets && !hideAssets[pageId]?.some(el => el === item.id)
                  ? require('../../../assets/img/eye.png')
                  : require('../../../assets/img/eye2.png')
              }
            />
          </Pressable>
        )}
      </Pressable>
    );
  };

  return (
    <NativeViewGestureHandler disallowInterruption={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Show/hide assets</Text>
        <Text style={styles.subTitle}>
          Choose assets to show/hide from the list
        </Text>
        <View style={styles.containerSearch}>
          <View style={styles.inputItem}>
            <SearchIcon />
            <TextInput
              placeholder={
                mode === 'assets' ? 'Search for Assets' : 'Search for Rooms'
              }
              placeholderTextColor={colors.textSecondColor}
              onChangeText={setKeyWord}
              style={styles.input}
            />
          </View>
        </View>
        <BottomSheetFlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={val => {
            switch (mode) {
              case 'assets':
                if (debouncedKeyWord) {
                  return renderItem(val);
                } else {
                  return renderAssets(val);
                }
              case 'rooms':
                return renderRooms(val);
            }
          }}
          style={[
            styles.flatList,
            {
              marginHorizontal: 0,
              paddingBottom: 15,
              marginBottom: insets.bottom,
            },
          ]}
          onEndReached={() => {
            !debouncedKeyWord && mode === 'assets' ? loadCategories : undefined;
          }}
          onEndReachedThreshold={0}
          contentContainerStyle={styles.contentContainerStyle}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={() => {
            if (isLoading) {
              return <ActivityIndicator color={colors.mainActiveColor} />;
            } else {
              return <NotFound />;
            }
          }}
          ListFooterComponent={() => {
            if (isLoad) {
              return <ActivityIndicator color={colors.mainActiveColor} />;
            }
          }}
        />
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
    marginHorizontal: 15,
    borderRadius: 8,
    paddingVertical: 10,
  },
  contentContainerStyle: {
    paddingVertical: 10,
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
  },
  headerButton: {
    flex: 1,
    marginVertical: 12,
    borderRadius: 10,
  },
  headerButtonActive: {
    backgroundColor: colors.backgroundButtonGreyColor,
  },
  headerButtonText: {
    color: colors.textColor,
    textAlign: 'center',
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    // marginVertical: 3,
  },

  assetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    gap: 10,
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
  deleteText: {
    marginBottom: 10,
    marginRight: 22,
    marginLeft: 11,
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
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
  viewMore: {
    textAlign: 'center',
    color: colors.mainActiveColor,
  },
});
