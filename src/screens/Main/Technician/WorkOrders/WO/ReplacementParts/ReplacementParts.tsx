import {FlatList, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {inventoriesAPI} from '../../../../../../api/inventoryApi';
import {useCallback, useEffect, useState} from 'react';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {ReplacementPartsItem} from './ReplacementPartsItem';
import {NotFound} from '../../../../../../components/NotFound';

export const ReplacementParts = () => {
  const {workOrder} = useAppSelector(state => state.wo);
  const [parts, setParts] = useState([]);
  const [count, setCount] = useState([]);

  const getInventory = useCallback(async () => {
    try {
      const res = await inventoriesAPI.getInventories({
        limit: 100,
        offset: 0,
        typeIdes: [...new Set(workOrder.assets?.map(el => el.types.id))],
      });

      setParts(res.data.payload);
      setCount(res.data.count);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  }, [workOrder.id]);

  const renderItem: ListRenderItem<any> = useCallback(
    ({item}) => {
      return <ReplacementPartsItem item={item} getInventory={getInventory} />;
    },
    [parts],
  );

  useEffect(() => {
    if (workOrder.assets?.length > 0) {
      getInventory();
    }
  }, [workOrder.id]);

  return (
    <View style={styles.container}>
      {parts.length !== 0 && (
        <Text style={styles.title}>Replacement Parts</Text>
      )}
      <FlatList
        data={parts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.content,
          parts.length === 0 && {flexGrow: 1, backgroundColor: null},
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NotFound title="Replacement Parts Not Found." />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },
  content: {
    backgroundColor: colors.backgroundLightColor,
    padding: 10,
    borderRadius: 8,
    gap: 15,
  },
});
