import {FC, useCallback, useEffect, useState} from 'react';
import {assetsAPI} from '../api/assetsApi';
import {objectGroupsAPI} from '../api/objectGroups';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {colors} from '../styles/colors';
import {SCREEN_HEIGHT, stylesModal} from '../styles/styles';
import {useAppSelector} from '../hooks/hooks';

type AddObjectGroupModalProps = {
  pageId?: string;
  values: any[];
  onChange: (objectGroups: any[]) => void;
  toggleModal: () => void;
  maxCount?: number;
  currentCount: number;
};

export const AddObjectGroupModal: FC<AddObjectGroupModalProps> = ({
  pageId,
  maxCount,
  currentCount,
  values,
  onChange,
  toggleModal,
}) => {
  const {asset} = useAppSelector(state => state.assets);
  const [pages, setPages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState(values || []);

  const getPages = async () => {
    const res = await assetsAPI.getAssetPagesByAssetId(asset.id);
    setPages(res.data.pages.map(el => el.id));
  };

  const getGroups = useCallback(async () => {
    const res = await objectGroupsAPI.getManyGroups({
      pageIdes: pageId ? [pageId] : pages,
    });
    setGroups(res.data.payload);
  }, []);

  const addGroup = (group: any) => {
    setSelectedGroups(prev => [...prev, group]);
  };

  const deleteGroup = (id: string) => {
    setSelectedGroups(prev => prev.filter(el => el.id !== id));
  };

  const renderItem: ListRenderItem<any> = ({item}) => {
    const itemIsChecked = selectedGroups.some(el => el?.id === item.id);

    return (
      <View key={item.id} style={[styles.item]}>
        <View style={[styles.item, {marginVertical: 0}]}>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
        <BouncyCheckbox
          size={20}
          style={styles.checkbox}
          fillColor={colors.borderAssetColor}
          innerIconStyle={styles.borderRadius}
          iconStyle={styles.borderRadius}
          textStyle={styles.checkboxText}
          text={''}
          disabled={
            !itemIsChecked &&
            !!maxCount &&
            maxCount <= currentCount + selectedGroups.length
          }
          isChecked={
            groups.length > 0 && selectedGroups.some(el => el?.id === item.id)
          }
          onPress={(isChecked: boolean) => {
            isChecked ? addGroup(item) : deleteGroup(item.id);
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    if (!pageId) {
      getPages();
    } else {
      getGroups();
    }
  }, [pageId, asset]);

  useEffect(() => {
    if (pages.length > 0) {
      getGroups();
    }
  }, [pages]);

  useEffect(() => {
    setSelectedGroups(values || []);
  }, [values]);

  return (
    <>
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={[styles.flatList, {maxHeight: undefined}]}
      />
      {maxCount && currentCount + selectedGroups.length >= maxCount && (
        <View style={[styles.subLabel]}>
          <View style={styles.mark}>
            <Text style={styles.markText}>!</Text>
          </View>
          <Text style={styles.labelErrorText}>You have selected 5 items</Text>
        </View>
      )}
      <Pressable
        onPress={() => {
          onChange(selectedGroups);
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
    maxHeight: SCREEN_HEIGHT * 0.65,
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
    color: colors.heighPriority,
    fontSize: 12,
    lineHeight: 18,
  },
  mark: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: colors.heighPriority,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: 5,
  },
  markText: {
    color: colors.heighPriority,
    fontSize: 10,
  },
});
