import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {SearchIcon} from '../../../../../assets/icons/SearchIcon';
import {stylesModal} from '../../../../../styles/styles';
import {FilterIcon} from '../../../../../assets/icons/FilterIcon';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../hooks/hooks';
import {getCategoriesAssetsTC} from '../../../../../bll/reducers/assets-reducer';
import {colors} from '../../../../../styles/colors';
import {AssetFilters} from './Filters/AssetFilters';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../bll/icons';
import {AssetType, CategoryAssets} from '../../../../../types/StateType';
import {assetsAPI} from '../../../../../api/assetsApi';
import {AssetCard} from '../Asset/AssetCard';
import {
  AssetGetByEntityAttributes,
  AssetGetByEntityInclude,
} from '../../../../../enums/assets';
import {sortedBy} from '../../../../../utils/sorted';
import {useDebounce} from '../../../../../hooks/useDebounce';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import {GetAssetsByAntityParams} from '../../../../../api/ApiTypes';
import {MyButton} from '../../../../../components/MyButton';
import {UserRole} from '../../../../../enums/user';
import {getTab} from '../../../../../utils/getTab';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {NotFound} from '../../../../../components/NotFound';

type SectionProps = {
  category: CategoryAssets;
  searchString?: string;
  isExpandAll: boolean;
};
const includeCriteria = [
  AssetGetByEntityInclude.BUILDING,
  AssetGetByEntityInclude.FLOOR,
  AssetGetByEntityInclude.ROOM,
  AssetGetByEntityInclude.TYPE,
  AssetGetByEntityInclude.CATEGORY,
];
const attributeCriteria = [
  AssetGetByEntityAttributes.SERIAL_NUMBER,
  AssetGetByEntityAttributes.PAGES_COUNT,
  // AssetGetByEntityAttributes.WO_COUNT,
  AssetGetByEntityAttributes.IS_CRITICAL,
  AssetGetByEntityAttributes.EQUIPMENT_ID,
];

const limit = 30;

const Category: FC<SectionProps> = memo(
  ({category, searchString, isExpandAll}) => {
    const {id, name, file, color, assetsCount} = category;
    const {regionId} = useAppSelector(state => state.user.user);
    const {asset: localAsset} = useAppSelector(state => state.local.db);
    const [isOpen, setIsOpen] = useState(isExpandAll);
    const [assets, setAssets] = useState<AssetType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const {isConnected} = useNetInfo();
    const {getLocalAssetsByCategoryId} = useLocalStateSelector();

    const [count, setCount] = useState(assets.length);
    const {assetFilters} = useAppSelector(state => state.filters);

    const toggleIsOpen = () => {
      setIsOpen(!isOpen);
    };

    const renderItem: ListRenderItem<AssetType> = ({item}) => {
      return <AssetCard asset={item} isExpandAll={isExpandAll} />;
    };

    const getAssets = async () => {
      setIsLoading(true);
      try {
        const params = {
          ...assetFilters,
          searchString: searchString !== '' ? searchString : null,
          categoryIdes: [id],
          regionIdes: [regionId],
          limit,
          offset: 0,
          includeCriteria,
          attributeCriteria,
        };
        if (assetFilters.hasPlans) {
          params.includeCriteria = [
            ...includeCriteria,
            AssetGetByEntityInclude.FED_FROM,
          ];
          params.isRequiredInclude = true;
        }
        const res = await assetsAPI.getAssetsByAntity(params);
        setCount(res.data.count);

        setAssets(res.data.assets);
      } catch (err) {
        handleServerNetworkError(err.response.data);
      } finally {
        setIsLoading(false);
      }
    };

    const loadAssets = useCallback(async () => {
      if (isConnected) {
        setIsLoadingMore(true);
        try {
          const res = await assetsAPI.getAssetsByAntity({
            ...assetFilters,
            searchString: searchString !== '' ? searchString : null,
            categoryIdes: [id],
            limit,
            offset: assets.length,
            includeCriteria,
            attributeCriteria,
          });
          setCount(res.data.count);
          setAssets(prev => [...prev, ...res.data.assets]);
        } catch (err) {
          handleServerNetworkError(err.response.data);
        } finally {
          setIsLoadingMore(false);
        }
      }
    }, [assets, isConnected]);

    useEffect(() => {
      if (isOpen) {
        isConnected
          ? getAssets()
          : setAssets(getLocalAssetsByCategoryId(id) as AssetType[]);
      }
    }, [isOpen, searchString, isConnected, localAsset]);

    useEffect(() => {
      setIsOpen(isExpandAll);
    }, [isExpandAll]);

    return (
      <>
        <Pressable
          style={styles.item}
          onPress={toggleIsOpen}
          disabled={assetsCount === 0}>
          <View style={styles.row}>
            <FastImage
              source={file?.url ? {uri: file.url} : dropdownIcons[name]}
              style={[styles.icon, color && {backgroundColor: color}]}
              defaultSource={dropdownIcons[name]}
            />
            <View>
              <Text style={styles.itemText}>{name}</Text>
              <Text style={styles.itemCountText}>{assetsCount} assets</Text>
            </View>
          </View>
          {assetsCount !== 0 && (
            <>{isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</>
          )}
        </Pressable>
        {isLoading && (
          <View style={{marginBottom: 10}}>
            <ActivityIndicator color={colors.mainActiveColor} />
          </View>
        )}
        {isOpen && (
          <FlatList
            data={assets}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={getAssets}
                colors={[colors.mainActiveColor]} // for android
                tintColor={colors.mainActiveColor} // for ios
              />
            }
            ListFooterComponent={() => (
              <>
                {count > assets.length && (
                  <TouchableOpacity onPress={loadAssets}>
                    {isLoadingMore ? (
                      <ActivityIndicator color={colors.mainActiveColor} />
                    ) : (
                      <Text style={styles.more}>More</Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          />
        )}
      </>
    );
  },
);

export const AssetsScreen = () => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const navigation = useAppNavigation();
  const {assetFilters} = useAppSelector(state => state.filters);

  const {categoriesAssets} = useAppSelector(state => state.assets);
  const {regionId} = useAppSelector(state => state.user.user);

  const [isExpandAll, setIsExpandAll] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {getLocalAssetCategory} = useLocalStateSelector();
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [count, setCount] = useState(assets.length);

  const [searchString, setSearchString] = useState('');
  const [filteredCategories, setFilteredCategories] =
    useState(categoriesAssets);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const debouncedKeyWord = useDebounce(searchString, 400);

  const renderAsset: ListRenderItem<AssetType> = ({item}) => {
    return <AssetCard asset={item} isExpandAll={isExpandAll} />;
  };

  const renderItem: ListRenderItem<CategoryAssets> = ({item}) => (
    <Category
      category={item}
      searchString={debouncedKeyWord}
      isExpandAll={isExpandAll}
    />
  );

  useEffect(() => {
    setFilteredCategories(
      assetFilters?.categoryIdes?.length > 0
        ? categoriesAssets.filter(cat =>
            assetFilters?.categoryIdes.some(el => el === cat.id),
          )
        : categoriesAssets,
    );
  }, [assetFilters?.categoryIdes, categoriesAssets]);

  const getCategories = async () => {
    setIsLoading(true);
    await dispatch(
      getCategoriesAssetsTC({...assetFilters, regionIdes: [regionId]}),
    );
    setIsLoading(false);
  };

  const debounsed = useDebounce(searchString, 400);

  const params = useMemo(() => {
    const res: GetAssetsByAntityParams = {
      searchString: debounsed || null,
      regionIdes: [regionId],
      limit,
      offset: 0,
      sortField: 'name',
      sortDirection: 'ASC',
      includeCriteria,
      attributeCriteria,
    };
    if (assetFilters.categoryIdes) {
      res.categoryIdes = assetFilters.categoryIdes;
    }
    if (assetFilters.typeIdes) {
      res.typeIdes = assetFilters.typeIdes;
    }
    if (assetFilters.installDate) {
      res.installDate = assetFilters.installDate;
    }
    if (assetFilters.lastServiceDate) {
      res.lastServiceDate = assetFilters.lastServiceDate;
    }
    if (assetFilters.maxCost) {
      res.maxCost = assetFilters.maxCost;
    }
    if (assetFilters.minCost) {
      res.minCost = assetFilters.minCost;
    }
    if (assetFilters.isArhived) {
      res.isArhived = assetFilters.isArhived;
    }
    if (assetFilters.isCritical) {
      res.isCritical = assetFilters.isCritical;
    }
    return res;
  }, [assetFilters, debounsed]);

  const getAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await assetsAPI.getAssetsByAntity(params);
      setCount(res.data.count);
      setAssets(res.data.assets);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const loadAssets = useCallback(async () => {
    if (count > assets.length) {
      setIsLoading(true);
      try {
        const res = await assetsAPI.getAssetsByAntity({
          ...params,
          offset: assets.length,
        });
        setCount(res.data.count);
        setAssets(prev => [...prev, ...res.data.assets]);
      } catch (err) {
        handleServerNetworkError(err.response.data);
      } finally {
        setIsLoading(false);
      }
    }
  }, [params, assets.length, count]);

  useEffect(() => {
    if (Object.keys(assetFilters).length !== 0) {
      getAssets();
    } else {
      setAssets([]);
      setCount(0);
      getCategories();
    }
  }, [assetFilters, debounsed]);

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <View style={stylesModal.inputItem}>
          <SearchIcon />
          <TextInput
            placeholder="Search for assets"
            placeholderTextColor={colors.textSecondColor}
            style={stylesModal.input}
            onChangeText={setSearchString}
          />
        </View>
        <Pressable style={stylesModal.filter} onPress={toggleModal}>
          <FilterIcon />
        </Pressable>
      </View>
      <BouncyCheckbox
        size={20}
        style={styles.checkbox}
        fillColor={colors.borderAssetColor}
        innerIconStyle={styles.borderRadius}
        iconStyle={styles.borderRadius}
        textStyle={styles.checkboxText}
        text="Expand all"
        isChecked={isExpandAll}
        onPress={(isChecked: boolean) => {
          setIsExpandAll(isChecked);
        }}
      />
      {Object.keys(assetFilters).length !== 0 ? (
        <FlatList
          data={assets}
          renderItem={renderAsset}
          keyExtractor={item => item.id}
          onEndReached={loadAssets}
          onEndReachedThreshold={0}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={getAssets}
              colors={[colors.mainActiveColor]} // for android
              tintColor={colors.mainActiveColor} // for ios
            />
          }
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={() => (
            <>{!isLoading && <NotFound title="Assets not found" />}</>
          )}
        />
      ) : (
        <FlatList
          data={
            isConnected
              ? categoriesAssets
                ? sortedBy(
                    'name',
                    categoriesAssets.filter(cat => cat.assetsCount !== 0),
                  )
                : []
              : getLocalAssetCategory({})
          }
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.flatlist}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={getCategories}
              colors={[colors.mainActiveColor]} // for android
              tintColor={colors.mainActiveColor} // for ios
            />
          }
          ListEmptyComponent={() => (
            <>{!isLoading && <NotFound title="Assets not found" />}</>
          )}
        />
      )}
      <View style={styles.buttonContainer}>
        <MyButton
          action={() => {
            navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: getTab(navigation.getState().routeNames[0]),
                params: {
                  screen: 'RootAssets',
                  params: {
                    screen: 'AddAsset',
                  },
                },
              },
            });
          }}
          text="+ Create new Asset"
        />
      </View>
      <ModalLayout
        title="Filter"
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <AssetFilters toggleModal={toggleModal} />
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },
  search: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    gap: 10,
  },
  flatlist: {
    backgroundColor: colors.backgroundLightColor,
    marginRight: 15,
    marginLeft: 10,
    borderRadius: 8,
    gap: 10,
    paddingVertical: 10,
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
  more: {
    textAlign: 'center',
    color: colors.mainActiveColor,
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
    paddingHorizontal: 15,
  },
  checkbox: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: -15,
    paddingHorizontal: 15,
  },
  borderRadius: {
    borderRadius: 5,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textColor,
  },
});
