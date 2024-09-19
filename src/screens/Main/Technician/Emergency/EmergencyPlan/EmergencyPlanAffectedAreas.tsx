import {FC, useEffect, useState} from 'react';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {FlatList} from 'react-native-gesture-handler';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {InfoItem} from '../../../../../components/InfoItem';
import {arrayToString} from '../../../../../utils/arrayToString';
import {AssetType, FloorType, RoomType} from '../../../../../types/StateType';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../bll/icons';
import {NotFound} from '../../../../../components/NotFound';

type EmergencyPlanAffectedAreasProps = {
  planId: string;
};

type AreaType = {
  building: {
    id: string;
    name: string;
  };
  id: string;
  assets: {asset: AssetType}[];
  floors: {floor: FloorType}[];
  rooms: {room: RoomType}[];
};

type AreaProps = {
  area: AreaType;
};

const Area: FC<AreaProps> = ({area}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [items, setItems] = useState<AreaType>({} as AreaType);

  useEffect(() => {
    if (isOpen) {
      (async () => {
        const res = await emergencyAPI.getAffectedArea({id: area.id});
        setItems(res.data);
      })();
    }
  }, [isOpen]);

  return (
    <>
      <View style={[styles.section]}>
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={[styles.header, isOpen && styles.headerOpen]}>
          <Text style={styles.headerText}>{area.building.name}</Text>
          {isOpen ? (
            <ArrowUpIcon color={colors.textSecondColor} />
          ) : (
            <ArrowDownIcon color={colors.textSecondColor} />
          )}
        </Pressable>
        {isOpen && (
          <View style={styles.items}>
            {items.floors && items.floors.length > 0 && (
              <InfoItem
                title="Floor:"
                text={arrayToString(items.floors.map(el => el.floor.name))}
                hiddeBorder={items.rooms && items.rooms.length === 0}
              />
            )}
            {items.rooms && items.rooms.length > 0 && (
              <InfoItem
                title="Office:"
                text={arrayToString(items.rooms.map(el => el.room.name))}
                hiddeBorder={items.assets && items.assets.length === 0}
              />
            )}
            {items.assets && items.assets.length > 0 && (
              <InfoItem
                title="Assets:"
                customRightItem={
                  <View style={{gap: 10, flex: 1}}>
                    {items.assets.map(el => (
                      <View key={el.id} style={styles.assetContainer}>
                        <FastImage
                          source={
                            el.asset.category?.link
                              ? {uri: el.asset.category?.link}
                              : dropdownIcons[el.asset.category.name]
                          }
                          style={styles.icon}
                          defaultSource={dropdownIcons[el.asset.category.name]}
                        />
                        <Text style={styles.itemText}>{el.asset.name}</Text>
                      </View>
                    ))}
                  </View>
                }
                hiddeBorder
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};

export const EmergencyPlanAffectedAreas: FC<
  EmergencyPlanAffectedAreasProps
> = ({planId}) => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await emergencyAPI.getAffectedAreas({
        emergencyPlanId: planId,
      });
      setAreas(res.data.areas);
    })();
  }, [planId]);
  return (
    <FlatList
      style={{flex: 1}}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
      data={areas}
      renderItem={({item}) => <Area area={item} />}
      ListEmptyComponent={() => {
        return <NotFound title="Affected Areas Not Found" />;
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
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
  items: {
    padding: 10,
  },
  itemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  assetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
