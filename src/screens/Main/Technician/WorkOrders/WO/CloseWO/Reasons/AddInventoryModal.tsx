import {useNetInfo} from '@react-native-community/netinfo';
import {FC, memo, useEffect, useState} from 'react';
import {useLocalStateSelector} from '../../../../../../../hooks/useLocalStateSelector';
import {assetsAPI} from '../../../../../../../api/assetsApi';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AssetType, CategoryAssets} from '../../../../../../../types/StateType';
import {useAppSelector} from '../../../../../../../hooks/hooks';
import FastImage from 'react-native-fast-image';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {dropdownIcons} from '../../../../../../../bll/icons';
import {colors} from '../../../../../../../styles/colors';
import {ArrowUpIcon} from '../../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../../assets/icons/ArrowDownIcon';
import {sortedBy} from '../../../../../../../utils/sorted';
import {stylesModal} from '../../../../../../../styles/styles';
import {inventoriesAPI} from '../../../../../../../api/inventoryApi';
import {InventoryItemStatus} from '../../../../../../../enums/assets';

type AddInventoryModalProps = {
  viewInventory: any[];
  onChange: (assets: AssetType[]) => void;
  toggleModal: () => void;
  maxCount?: number;
};

type CategoryProps = {
  category: CategoryAssets;
  selectedInventory: AssetType[];
  addInventory: (asset: AssetType) => void;
  deleteInventory: (id: string) => void;
  maxCount?: number;
};

type TypeProps = {
  type: {assetsCount: number; id: string; name: string; newCount: number};
  category: CategoryAssets;
  selectedInventory: any;
  addInventory: (asset: AssetType) => void;
  deleteInventory: (id: string) => void;
  maxCount?: number;
};

const Item = ({
  item,
  maxCount,
  selectedInventory,
  addInventory,
  deleteInventory,
}: any) => {
  const itemName = item.name || item.equipmentId || item.id.split('-')[0];
  const itemIsChecked = selectedInventory.some(el => el?.id === item.id);
  const isDisabled =
    !itemIsChecked && !!maxCount && maxCount <= selectedInventory.length;

  return (
    <View key={item.id} style={[styles.item]}>
      <View style={[styles.item, {marginVertical: 0}]}>
        <Text style={styles.itemText}>{itemName}</Text>
      </View>
      <BouncyCheckbox
        size={20}
        style={styles.checkbox}
        fillColor={colors.borderAssetColor}
        innerIconStyle={styles.borderRadius}
        iconStyle={styles.borderRadius}
        textStyle={styles.checkboxText}
        text={''}
        disabled={isDisabled}
        isChecked={itemIsChecked}
        onPress={(isChecked: boolean) => {
          isChecked ? addInventory(item) : deleteInventory(item.id);
        }}
      />
    </View>
  );
};

const Type: FC<TypeProps> = ({
  type,
  category,
  addInventory,
  deleteInventory,
  selectedInventory,
  maxCount,
}) => {
  const {name} = type;
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<any>([]);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderItem: ListRenderItem<AssetType> = ({item}) => {
    return (
      <Item
        item={item}
        maxCount={maxCount}
        selectedInventory={selectedInventory}
        addInventory={addInventory}
        deleteInventory={deleteInventory}
      />
    );
  };

  useEffect(() => {
    if (isOpen) {
      (async () => {
        const res = await inventoriesAPI.getInventories({
          typeIdes: [type.id],
          status: InventoryItemStatus.AVAILABLE,
        });
        setAssets(res.data.payload);
      })();
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
          ListEmptyComponent={() => (
            <Text style={[styles.itemText, {textAlign: 'center'}]}>
              Parts not found
            </Text>
          )}
        />
      )}
    </>
  );
};

const Category: FC<CategoryProps> = memo(
  ({category, addInventory, deleteInventory, selectedInventory, maxCount}) => {
    const {isConnected} = useNetInfo();
    const {getLocalAssetTypes} = useLocalStateSelector();
    const {id, name, file, color} = category;
    const buildingId = useAppSelector(state => state.buildings.building.id);

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
          addInventory={addInventory}
          selectedInventory={selectedInventory}
          deleteInventory={deleteInventory}
          maxCount={maxCount}
        />
      );
    };

    useEffect(() => {
      if (isOpen) {
        isConnected
          ? (async () => {
              const res = await assetsAPI.getTypesAssets({
                // buildingId,
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
          // disabled={assetsCount === 0}
        >
          <View style={[styles.row, {position: 'relative'}]}>
            <FastImage
              source={file ? {uri: file.url} : dropdownIcons[name]}
              style={[styles.icon, color && {backgroundColor: color}]}
              defaultSource={dropdownIcons[name]}
            />
            <Text style={styles.itemText}>{name}</Text>
          </View>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Pressable>
        {isOpen && (
          <FlatList
            data={sortedBy(
              'name',
              types.filter(el => el.inventoryItemsCount !== 0),
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

export const AddInventoryModal: FC<AddInventoryModalProps> = ({
  onChange,
  toggleModal,
  viewInventory,
  maxCount,
}) => {
  const {isConnected} = useNetInfo();

  const {getLocalAssetCategory} = useLocalStateSelector();

  const [selectedInventory, setSelectedInventory] = useState<any[]>(
    viewInventory || [],
  );

  const [categoriesAssets, setCategoriesAssets] = useState<any[]>([]);

  const addInventory = (asset: AssetType) => {
    setSelectedInventory(prev => [...prev, asset]);
  };

  const deleteInventory = (id: string) => {
    setSelectedInventory(prev => prev.filter(el => el.id !== id));
  };

  const renderItem: ListRenderItem<CategoryAssets> = ({item}) => (
    <Category
      category={item}
      addInventory={addInventory}
      deleteInventory={deleteInventory}
      selectedInventory={selectedInventory}
      maxCount={maxCount}
    />
  );

  useEffect(() => {
    isConnected
      ? (async () => {
          const res = await assetsAPI.getCategoriesAssets({
            offset: 0,
            limit: 25,
            // buildingId,
          });
          setCategoriesAssets(res.data.categories);
        })()
      : setCategoriesAssets(getLocalAssetCategory({}));
  }, [isConnected]);

  return (
    <>
      {categoriesAssets && categoriesAssets.length > 0 && (
        <View style={styles.flatListContainer}>
          <FlatList
            data={sortedBy(
              'name',
              categoriesAssets.filter(el => el.inventoryItemsCount !== 0),
            )}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.flatList}
          />
        </View>
      )}
      <Pressable
        onPress={() => {
          onChange(selectedInventory);
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
