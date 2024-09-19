import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ListRenderItem,
  Pressable,
} from 'react-native';
import {FC, memo, useEffect, useState} from 'react';
import {colors} from '../../../../../../styles/colors';
import {useNetInfo} from '@react-native-community/netinfo';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';
import {AssetType, CategoryAssets} from '../../../../../../types/StateType';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {sortedBy} from '../../../../../../utils/sorted';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../../bll/icons';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {AssetGetByEntityInclude} from '../../../../../../enums/assets';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {CreateWOForm} from '../../../../../../types/FormTypes';
import {stylesModal} from '../../../../../../styles/styles';

type AddAssetsModalProps = {
  buildingId: string;
  values: CreateWOForm;
  assetId?: string;
  onChange: (assets: AssetType[]) => void;
  toggleModal: () => void;
};

type CategoryProps = {
  assetId?: string;
  buildingId: string;
  category: CategoryAssets;
  selectedAssets: AssetType[];
  addAsset: (asset: AssetType) => void;
  deleteAsset: (id: string) => void;
};

type TypeProps = {
  assetId?: string;
  type: {assetsCount: number; id: string; name: string; newCount: number};
  category: CategoryAssets;
  selectedAssets: AssetType[];
  addAsset: (asset: AssetType) => void;
  deleteAsset: (id: string) => void;
  buildingId: string;
};

const Type: FC<TypeProps> = ({
  type,
  category,
  addAsset,
  deleteAsset,
  selectedAssets,
  assetId,
  buildingId,
}) => {
  const {isConnected} = useNetInfo();

  const {name} = type;
  const {asset, assetcategory} = useAppSelector(state => state.local.db);

  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<any>([]);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderItem: ListRenderItem<AssetType> = ({item}) => {
    return (
      <View key={item.id} style={[styles.item]}>
        <View style={[styles.item, {marginVertical: 0}]}>
          <FastImage
            style={[
              styles.icon,
              item?.category?.color && {backgroundColor: item?.category?.color},
            ]}
            source={
              item?.category?.file
                ? {uri: item?.category?.file.url}
                : dropdownIcons[item?.category?.name]
            }
            defaultSource={dropdownIcons[item?.category?.name]}
          />
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
        <BouncyCheckbox
          size={20}
          style={styles.checkbox}
          fillColor={
            assetId === item.id
              ? colors.textSecondColor
              : colors.borderAssetColor
          }
          innerIconStyle={styles.borderRadius}
          iconStyle={styles.borderRadius}
          textStyle={styles.checkboxText}
          text={''}
          disabled={assetId === item.id}
          isChecked={
            selectedAssets.length > 0 &&
            selectedAssets.some(el => el?.id === item.id)
          }
          onPress={(isChecked: boolean) => {
            isChecked ? addAsset(item) : deleteAsset(item.id);
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    if (isOpen) {
      isConnected
        ? (async () => {
            const res = await assetsAPI.getAssetsByAntity({
              typeIdes: [type.id],
              buildingIdes: [buildingId],
              includeCriteria: [AssetGetByEntityInclude.CATEGORY],
            });
            setAssets(res.data.assets);
          })()
        : setAssets(
            Object.values(asset)
              .filter(a => a.buildingId === buildingId && a.typeId === type.id)
              .map(el => ({
                ...el,
                category: assetcategory[el.categoryId],
              })),
          );
    }
  }, [isOpen]);

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
          <Text style={styles.itemText}>{name}</Text>
        </View>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </Pressable>
      {isOpen && (
        <FlatList
          data={sortedBy('name', assets)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.flatList, {maxHeight: undefined}]}
        />
      )}
    </>
  );
};

const Category: FC<CategoryProps> = memo(
  ({category, addAsset, deleteAsset, selectedAssets, assetId, buildingId}) => {
    const {isConnected} = useNetInfo();
    const {getLocalAssetTypes} = useLocalStateSelector();
    const {id, name, color, file, assetsCount} = category;

    const [isOpen, setIsOpen] = useState(false);
    const [types, setTypes] = useState<any[]>([]);

    const toggleIsOpen = () => {
      setIsOpen(!isOpen);
    };

    const renderItem: ListRenderItem<any> = ({item}) => {
      return (
        <Type
          type={item}
          category={category}
          addAsset={addAsset}
          assetId={assetId}
          buildingId={buildingId}
          selectedAssets={selectedAssets}
          deleteAsset={deleteAsset}
        />
      );
    };

    useEffect(() => {
      if (isOpen) {
        isConnected
          ? (async () => {
              const res = await assetsAPI.getTypesAssets({
                buildingId,
                categoryIdes: [id],
              });
              setTypes(res.data.types);
            })()
          : setTypes(getLocalAssetTypes({categoryId: id, buildingId}));
      }
    }, [isOpen]);

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
            <Text style={styles.itemText}>{name}</Text>
          </View>
          {assetsCount !== 0 && (
            <>{isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</>
          )}
        </Pressable>
        {isOpen && (
          <FlatList
            data={sortedBy(
              'name',
              types.filter(el => el.assetsCount !== 0),
            )}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            style={[styles.flatList, {maxHeight: undefined}]}
          />
        )}
      </>
    );
  },
);

export const AddAssetsModal: FC<AddAssetsModalProps> = ({
  buildingId,
  assetId,
  onChange,
  toggleModal,
  values,
}) => {
  const {isConnected} = useNetInfo();

  const {getLocalAssetCategory} = useLocalStateSelector();

  const [selectedAssets, setSelectedAssets] = useState<any[]>(
    values?.assetsId ? values.assetsId : [],
  );

  const [categoriesAssets, setCategoriesAssets] = useState<any[]>([]);

  const addAsset = (asset: AssetType) => {
    setSelectedAssets(prev => [...prev, asset]);
  };

  const deleteAsset = (id: string) => {
    if (id !== assetId) {
      setSelectedAssets(prev => prev.filter(el => el.id !== id));
    }
  };

  const renderItem: ListRenderItem<CategoryAssets> = ({item}) => (
    <Category
      category={item}
      addAsset={addAsset}
      assetId={assetId}
      buildingId={buildingId}
      deleteAsset={deleteAsset}
      selectedAssets={selectedAssets}
    />
  );

  useEffect(() => {
    isConnected
      ? (async () => {
          const res = await assetsAPI.getCategoriesAssets({
            offset: 0,
            limit: 25,
            buildingId,
          });
          setCategoriesAssets(res.data.categories);
        })()
      : setCategoriesAssets(getLocalAssetCategory({buildingId}));
  }, [buildingId, isConnected]);

  return (
    <>
      {categoriesAssets && categoriesAssets.length > 0 && (
        <View style={styles.flatListContainer}>
          <FlatList
            data={categoriesAssets.filter(el => el.assetsCount > 0)}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.flatList}
          />
        </View>
      )}
      <Pressable
        onPress={() => {
          onChange(selectedAssets);
          toggleModal();
        }}
        style={[stylesModal.modalButton, {flex: undefined, marginTop: 10}]}>
        <Text style={stylesModal.modalButtonText}>Add</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    maxHeight: Dimensions.get('screen').height * 0.65,
  },
  flatList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
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
  assetContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 10,
    gap: 10,
  },
  checkbox: {
    marginRight: -15,
  },
  borderRadius: {
    borderRadius: 5,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },
});
