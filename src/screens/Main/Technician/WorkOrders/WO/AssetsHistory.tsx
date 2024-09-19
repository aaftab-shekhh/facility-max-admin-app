import {FC, useState} from 'react';
import {AssetType} from '../../../../../types/StateType';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AssetHistory} from '../../Assets/Asset/AssetsHistory/AssetHistory';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {colors} from '../../../../../styles/colors';

type AssetsHistoryProps = {
  assets?: AssetType[];
};

type AssetHistoryWOProps = {
  id: string;
  serialNumber: string;
  name: string;
};

const AssetHistoryWO = ({id, serialNumber, name}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.header, isOpen && styles.headerOpen]}>
        <Text style={styles.headerText}>{name}</Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpen && <AssetHistory id={id} serialNumber={serialNumber} />}
    </View>
  );
};

export const AssetsHistory: FC<AssetsHistoryProps> = ({assets}) => {
  const renderItem: ListRenderItem<AssetType> = ({item}) => (
    <AssetHistoryWO
      id={item.id}
      serialNumber={item.serialNumber}
      name={item.name}
    />
  );
  return (
    <FlatList
      data={assets}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },
});
