import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {dropdownIcons} from '../../../../../../bll/icons';
import FastImage from 'react-native-fast-image';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {FC, memo, useEffect, useState} from 'react';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';

type AreaProps = {
  area: any;
};

const Area: FC<AreaProps> = ({area}) => {
  const {isConnected} = useNetInfo();
  const {getLocalAffectedFloorsRooms} = useLocalStateSelector();

  const [isOpenArea, setIsOpenArea] = useState(false);
  const [floors, setFloors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const toggleArea = () => {
    setIsOpenArea(!isOpenArea);
  };

  const getItems = () => {
    isConnected
      ? (async () => {
          const res = await assetsAPI.getAssetAffectedArea(area.id);
          setFloors(res.data.floors);
          setRooms(res.data.rooms);
        })()
      : (() => {
          const res = getLocalAffectedFloorsRooms(area.id);
          setFloors(res.floors);
          setRooms(res.rooms);
        })();
  };

  useEffect(() => {
    if (isOpenArea) {
      getItems();
    }
  }, [isOpenArea, isConnected]);

  return (
    <Pressable
      key={area.id}
      onPress={toggleArea}
      style={assetTaableStyles.assetsBlock}>
      <View style={assetTaableStyles.row}>
        <Text style={assetTaableStyles.title}>Building</Text>
        <Text style={assetTaableStyles.text}>{area.building.name}</Text>
        {isOpenArea ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </View>
      {isOpenArea && (
        <>
          {floors.length > 0 && (
            <View style={assetTaableStyles.row}>
              <Text style={assetTaableStyles.title}>Floors</Text>
              <View style={assetTaableStyles.text}>
                {floors.map(floor => (
                  <Text key={floor.id} style={assetTaableStyles.text}>
                    {floor.floor.name}
                  </Text>
                ))}
              </View>
            </View>
          )}
          {rooms.length > 0 && (
            <View style={assetTaableStyles.row}>
              <Text style={assetTaableStyles.title}>Rooms</Text>
              <View style={assetTaableStyles.text}>
                {rooms.map(room => (
                  <Text key={room.id} style={assetTaableStyles.text}>
                    {room.room.name}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

export const AssetTable = memo(() => {
  const {isConnected} = useNetInfo();
  const {getLocalAssetAffectedAreaByAssetId, getLocalAssetFeds} =
    useLocalStateSelector();

  const {id} = useAppSelector(state => state.assets.asset);

  const [isOpenTable, setIsOpenTable] = useState(false);
  const [isOpenFedFrom, setIsOpenFedFrom] = useState(true);
  const [isOpenFedTo, setIsOpenFedTo] = useState(true);
  const [isOpenAreas, setIsOpenAreas] = useState(true);

  const [fedFrom, setFedFrom] = useState<any[]>([]);
  const [fedTo, setFedTo] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  const getAssetFeds = async (fedType: string) => {
    isConnected
      ? (async () => {
          const res = await assetsAPI.getAssetFeds({id, params: {fedType}});
          fedType !== 'to'
            ? setFedTo(
                res.data.fed.filter(
                  (i, index, self) =>
                    index === self.findIndex(t => t?.to?.id === i?.to?.id),
                ),
              )
            : setFedFrom(
                res.data.fed.filter(
                  (i, index, self) =>
                    index === self.findIndex(t => t?.from?.id === i?.from?.id),
                ),
              );
        })()
      : (() => {
          fedType !== 'to'
            ? setFedTo(getLocalAssetFeds(id, fedType))
            : setFedFrom(getLocalAssetFeds(id, fedType));
        })();
  };

  const getAssetAffectedAreaByAssetId = async () => {
    isConnected
      ? setAreas(
          (await assetsAPI.getAssetAffectedAreaByAssetId(id)).data
            .affectedAreas,
        )
      : setAreas(getLocalAssetAffectedAreaByAssetId(id));
  };

  useEffect(() => {
    if (isOpenFedTo) {
      getAssetFeds('to');
    }
  }, [id, isOpenFedTo, isConnected]);

  useEffect(() => {
    if (isOpenFedFrom) {
      getAssetFeds('from');
    }
  }, [id, isOpenFedFrom, isConnected]);

  useEffect(() => {
    if (isOpenAreas) {
      getAssetAffectedAreaByAssetId();
    }
  }, [id, isOpenAreas, isConnected]);

  return (
    <>
      <View style={assetTaableStyles.tableContainer}>
        <Pressable
          style={assetTaableStyles.row}
          onPress={() => setIsOpenTable(!isOpenTable)}>
          <Text style={assetTaableStyles.headerText}>
            Affected Assets & Areas
          </Text>
          {isOpenTable ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Pressable>
        {isOpenTable && (
          <>
            <View style={assetTaableStyles.assetsContainer}>
              {fedFrom.length > 0 && (
                <>
                  <Pressable
                    style={assetTaableStyles.row}
                    onPress={() => setIsOpenFedFrom(!isOpenFedFrom)}>
                    <Text style={assetTaableStyles.assetsTitle}>Fed From</Text>
                    {isOpenFedFrom ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </Pressable>
                  {isOpenFedFrom && (
                    <View style={assetTaableStyles.assetsBlock}>
                      {fedFrom.map(item => {
                        return (
                          <Pressable
                            key={item.id}
                            style={assetTaableStyles.assetContainer}
                            onPress={() => {}}>
                            <FastImage
                              style={assetTaableStyles.img}
                              source={
                                item.fedFrom?.category?.file?.url
                                  ? {uri: item.fedFrom?.category?.file?.url}
                                  : dropdownIcons[item.fedFrom?.category?.name]
                              }
                              defaultSource={
                                dropdownIcons[item.fedFrom?.category?.name]
                              }
                            />
                            <Text style={assetTaableStyles.assetName}>
                              {item.fedFrom?.name}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </>
              )}
              {fedTo.length > 0 && (
                <>
                  <Pressable
                    style={assetTaableStyles.row}
                    onPress={() => setIsOpenFedTo(!isOpenFedTo)}>
                    <Text style={assetTaableStyles.assetsTitle}>Feeds To</Text>
                    {isOpenFedTo ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </Pressable>
                  {isOpenFedTo && (
                    <View style={assetTaableStyles.assetsBlock}>
                      {fedTo.map(item => {
                        return (
                          <Pressable
                            key={item.id}
                            style={assetTaableStyles.assetContainer}
                            onPress={() => {}}>
                            <FastImage
                              style={assetTaableStyles.img}
                              source={
                                item.to?.category?.file?.url
                                  ? {uri: item.to?.category?.file?.url}
                                  : dropdownIcons[item.to?.category?.name]
                              }
                              defaultSource={
                                dropdownIcons[item.to?.category?.name]
                              }
                            />
                            <Text style={assetTaableStyles.assetName}>
                              {item.to?.name}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </>
              )}
            </View>
            {areas.length > 0 && (
              <View style={assetTaableStyles.assetsContainer}>
                <Pressable
                  style={assetTaableStyles.row}
                  onPress={() => setIsOpenAreas(!isOpenAreas)}>
                  <Text style={assetTaableStyles.assetsTitle}>
                    Affected areas
                  </Text>
                  {isOpenAreas ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </Pressable>
                {isOpenAreas &&
                  areas.length > 0 &&
                  areas.map(area => <Area key={area.id} area={area} />)}
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
});

const assetTaableStyles = StyleSheet.create({
  tableContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.backgroundLightColor,
  },

  assetsContainer: {
    margin: 10,
  },

  headerText: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 21,
    color: colors.textColor,
  },

  assetsTitle: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  assetsBlock: {
    marginVertical: 10,
    gap: 8,
  },

  assetContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  img: {
    width: 24,
    height: 24,
  },

  assetName: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  title: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondColor,
  },

  text: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: colors.mainActiveColor,
  },
});
