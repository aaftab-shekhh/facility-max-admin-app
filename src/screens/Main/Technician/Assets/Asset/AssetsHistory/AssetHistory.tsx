import {FC, useEffect, useState} from 'react';
import {HistoryType} from '../../../../../../types/StateType';
import {ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {historyAPI} from '../../../../../../api/historyApi';
import moment from 'moment';
import {historyConfig} from '../../../../../../bll/history';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';
import {FlatList} from 'react-native-gesture-handler';

type AssetHistoryProps = {
  id: string;
  serialNumber: string;
};

export const AssetHistory: FC<AssetHistoryProps> = ({id, serialNumber}) => {
  const [history, setHistory] = useState<HistoryType[]>([]);
  const {isConnected} = useNetInfo();
  const {getLocalAssetHistory} = useLocalStateSelector();

  useEffect(() => {
    if (id && serialNumber) {
      isConnected
        ? (async () => {
            const res = await historyAPI.getHistory({
              searchString: [id, serialNumber],
            });
            setHistory(res.data.histories);
          })()
        : setHistory(getLocalAssetHistory(id, serialNumber));
    }
  }, [isConnected]);

  const renderItem: ListRenderItem<any> = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row', gap: 20}}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor:
                index === 0 ? colors.mainActiveColor : colors.textColor,
            },
          ]}
        />
        <View style={styles.step}>
          <Text
            style={[
              styles.title,
              {color: index === 0 ? colors.mainActiveColor : colors.textColor},
            ]}>
            {historyConfig.subObjects[item.subObject].title}{' '}
            {historyConfig.subObjects[item.subObject].actions[item.action]}
          </Text>
          <Text style={styles.dateText}>
            {moment(item.createdAt).format('L LT')}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <FlatList
      data={history}
      renderItem={renderItem}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
      }}
      ItemSeparatorComponent={() => <View style={styles.line} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  step: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    top: 5,
  },
  line: {
    position: 'absolute',
    top: 18,
    height: '100%',
    width: 2,
    backgroundColor: colors.textColor,
    left: 6,
  },
  title: {
    color: colors.textColor,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  dateText: {
    color: colors.textSecondColor,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
  },
  flatList: {
    flexGrow: 1,
    paddingTop: 10,
  },
});
