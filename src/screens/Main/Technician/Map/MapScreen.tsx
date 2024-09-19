import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {BuildingType, OrderType} from '../../../../types/StateType';
import {memo, useCallback, useEffect, useRef, useState} from 'react';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import {stylesModal} from '../../../../styles/styles';
import {SearchIcon} from '../../../../assets/icons/SearchIcon';
import {FilterIcon} from '../../../../assets/icons/FilterIcon';
import {WorkOrderCard} from '../WorkOrders/WO/WorkOrderCard/WorcOrderCard';
import {BuildingCard} from '../Buildings/Building/BuildingCard/BuildingCard';
import {MapPinWOIcon} from '../../../../assets/icons/MapPinWOIcon';
import {MapPinBuildingIcon} from '../../../../assets/icons/MapPinBuildingIcon';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../hooks/hooks';
import {getBuildingsByCoordinatesTC} from '../../../../bll/reducers/buildings-reducer';
import {useDebounce} from '../../../../hooks/useDebounce';
import {colors} from '../../../../styles/colors';
import {handleServerNetworkError} from '../../../../utils/handleServerNetworkUtils';
import {woAPI} from '../../../../api/woApi';
import {useNetInfo} from '@react-native-community/netinfo';
import {DashboardIcon} from '../../../../assets/icons/MenuIcons/DashboardIcon';
import {sortedBy} from '../../../../utils/sorted';
import {useOrientation} from '../../../../hooks/useOrientation';
import {UserRole} from '../../../../enums/user';
import Geolocation from '@react-native-community/geolocation';

const {height: WINDOW_HEIGHT} = Dimensions.get('window');

const FilterItems = [
  {label: 'Show Buildings', value: 'buildings'},
  {label: 'Show WOs', value: 'WO'},
];

export const MapScreen = memo(() => {
  const {isConnected} = useNetInfo();
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapView>(null);
  const navigation = useAppNavigation();
  const {customerId} = useAppSelector(state => state.user.user);
  const {numColumn, onLayout} = useOrientation();

  const localbuildings = useAppSelector(state => state.local.db.building);
  const netBuildings = useAppSelector(state => state.buildings.buildings);

  const buildings = isConnected
    ? netBuildings
    : sortedBy('name', Object.values(localbuildings || {}));

  const [workOrders, setWorkOrders] = useState([]);

  const workOrderCards: any[] = workOrders.reduce(
    (acc, el) => [...acc, ...el.workOrders],
    [],
  );

  const initialRegion = {
    latitude: 33.303333,
    longitude: -111.839444,
    latitudeDelta: 0.282,
    longitudeDelta: 0.181,
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      const newRegion = {
        ...initialRegion,
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      };
      mapRef.current?.animateToRegion(newRegion, 500);
    });
  }, []);

  const [polygon, setPolygon] = useState({
    minLat: initialRegion.latitude - initialRegion.latitudeDelta * 0.5,
    maxLat: initialRegion.latitude + initialRegion.latitudeDelta * 0.5,
    minLong: initialRegion.longitude - initialRegion.longitudeDelta * 0.5,
    maxLong: initialRegion.longitude + initialRegion.longitudeDelta * 0.5,
  });

  const [isFiltersVisible, setFiltersVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('WO');
  const [selectedWO, setSelectedWO] = useState();
  const [selectedBuilding, setSelectedBuilding] = useState();
  const [keyWord, setKeyWord] = useState<string>('');

  const toggleFilters = () => {
    setFiltersVisible(!isFiltersVisible);
  };

  const goHome = () => {
    navigation.navigate('Main', {
      screen: UserRole.TECHNICIAN,
      params: {
        screen: 'MenuTab',
        params: {
          screen: 'Dashboard',
        },
      },
    });
  };

  const debouncedKeyWord = useDebounce(keyWord, 400);

  const renderWO: ListRenderItem<OrderType> = useCallback(
    ({item}) => {
      return (
        <View style={{flex: 1 / numColumn}}>
          <WorkOrderCard key={item.id} order={item} numColumn={numColumn} />
        </View>
      );
    },
    [numColumn],
  );

  const renderBuilding: ListRenderItem<BuildingType> = useCallback(
    ({item}) => {
      return (
        <View style={{flex: 1 / numColumn}}>
          <BuildingCard key={item.id} building={item} numColumn={numColumn} />
        </View>
      );
    },
    [numColumn],
  );

  const getWOs = useCallback(async () => {
    try {
      const params: {keySearchValue: string} = {};
      if (debouncedKeyWord && debouncedKeyWord !== '') {
        params.keySearchValue = debouncedKeyWord;
      }
      const res = await woAPI.getWObyCoordinates({
        customerId,
        minLat: polygon.minLat,
        maxLat: polygon.maxLat,
        minLong: polygon.minLong,
        maxLong: polygon.maxLong,
        ...params,
      });
      setWorkOrders(res.data);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  }, [selectedFilter, debouncedKeyWord, polygon]);

  useEffect(() => {
    if (isConnected && selectedFilter === 'WO') {
      getWOs();
    } else if (isConnected && selectedFilter === 'buildings') {
      const params = {};
      if (debouncedKeyWord && debouncedKeyWord !== '') {
        params.keySearchValue = debouncedKeyWord;
      }
      dispatch(
        getBuildingsByCoordinatesTC({
          customerId,
          minLat: polygon.minLat,
          maxLat: polygon.maxLat,
          minLong: polygon.minLong,
          maxLong: polygon.maxLong,
          ...params,
        }),
      );
    }
  }, [selectedFilter, debouncedKeyWord, polygon, isConnected]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsCompass={false}
        clusterColor="#4A5369"
        onRegionChangeComplete={region => {
          setPolygon({
            minLat: region.latitude - region.latitudeDelta * 0.5,
            maxLat: region.latitude + region.latitudeDelta * 0.5,
            minLong: region.longitude - region.longitudeDelta * 0.5,
            maxLong: region.longitude + region.longitudeDelta * 0.5,
          });
        }}
        showsUserLocation
        userLocationCalloutEnabled
        scrollDuringRotateOrZoomEnabled={false}>
        {workOrders &&
          workOrders.length > 0 &&
          selectedFilter === 'WO' &&
          workOrders.map((item: any) => {
            return (
              <Marker
                key={item.id}
                tracksViewChanges={false}
                onDeselect={() => {
                  selectedFilter === 'WO'
                    ? setSelectedWO(undefined)
                    : setSelectedBuilding(undefined);
                }}
                coordinate={{
                  latitude: +item.lat || 33.303333,
                  longitude: +item.long || -111.839444,
                }}
                title={item.name}
                description={item.description || item.address}
                onPress={() => {
                  setTimeout(() => {
                    if (selectedFilter === 'WO') {
                      setSelectedWO(item);
                    } else {
                      setSelectedBuilding(item);
                    }
                  }, 700);
                }}>
                {selectedFilter === 'WO' && (
                  <MapPinWOIcon
                    count={item.workOrders?.length}
                    fill={selectedWO?.id === item.id && colors.mainActiveColor}
                  />
                )}
                {selectedFilter === 'buildings' && (
                  <MapPinBuildingIcon
                    fill={
                      selectedBuilding?.id === item.id && colors.mainActiveColor
                    }
                  />
                )}
                {selectedFilter === 'WO' && (
                  <View style={styles.countContaintr}>
                    <Text style={styles.countText}>
                      {item.workOrders?.length}
                    </Text>
                  </View>
                )}
              </Marker>
            );
          })}
        {buildings.length > 0 &&
          selectedFilter === 'buildings' &&
          buildings.map((item: any) => {
            return (
              <Marker
                key={item.id}
                tracksViewChanges={false}
                onDeselect={() => {
                  setSelectedBuilding(undefined);
                }}
                coordinate={{
                  latitude: +item.lat || 33.303333,
                  longitude: +item.long || -111.839444,
                }}
                title={item.name}
                description={item.description || item.address}
                onPress={() => {
                  setTimeout(() => {
                    setSelectedBuilding(item);
                  }, 700);
                }}>
                {selectedFilter === 'buildings' && (
                  <MapPinBuildingIcon
                    fill={
                      selectedBuilding?.id === item.id && colors.mainActiveColor
                    }
                  />
                )}
              </Marker>
            );
          })}
        {/* <Polygon coordinates={polygon} /> */}
      </MapView>

      <SafeAreaView style={styles.subcontainer}>
        <View style={stylesModal.container}>
          <View style={stylesModal.inputItem}>
            <SearchIcon />
            <TextInput
              placeholderTextColor={colors.textSecondColor}
              placeholder={
                selectedFilter === 'WO'
                  ? 'Search for work orders'
                  : 'Search for buildings'
              }
              onChangeText={setKeyWord}
              style={stylesModal.input}
            />
          </View>
          <Pressable style={stylesModal.filter} onPress={toggleFilters}>
            <FilterIcon />
          </Pressable>
          <Pressable style={stylesModal.filter} onPress={goHome}>
            <DashboardIcon />
          </Pressable>
        </View>
        {isFiltersVisible && (
          <View style={styles.filtersContainer}>
            {FilterItems.map(i => {
              return (
                <Pressable
                  key={i.value}
                  onPress={() => {
                    setSelectedFilter(i.value);
                    toggleFilters();
                  }}
                  style={[
                    styles.filtersItem,
                    selectedFilter === i.value && styles.selectedFilter,
                  ]}>
                  <Text style={styles.filtersItemText}>{i.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </SafeAreaView>
      {selectedFilter === 'WO' &&
        workOrderCards &&
        workOrderCards.length > 0 &&
        (selectedWO ? (
          <SafeAreaView style={styles.workOrderContainer}>
            <FlatList
              key={numColumn}
              numColumns={numColumn}
              onLayout={event => {
                onLayout(event.nativeEvent.layout.width);
              }}
              columnWrapperStyle={
                numColumn !== 1 && {
                  gap: 10,
                }
              }
              data={selectedWO.workOrders}
              style={styles.workOrders}
              contentContainerStyle={{gap: 10, paddingBottom: 10}}
              keyExtractor={item => item.id}
              renderItem={renderWO}
            />
          </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.workOrdersContainer}>
            <FlatList
              key={numColumn}
              numColumns={numColumn}
              onLayout={event => {
                onLayout(event.nativeEvent.layout.width);
              }}
              columnWrapperStyle={
                numColumn !== 1 && {
                  gap: 10,
                }
              }
              data={workOrderCards}
              style={styles.workOrders}
              contentContainerStyle={{gap: 10, paddingBottom: 10}}
              keyExtractor={item => item.id}
              renderItem={renderWO}
            />
          </SafeAreaView>
        ))}
      {selectedFilter === 'buildings' &&
        buildings &&
        buildings.length > 0 &&
        (selectedBuilding ? (
          <SafeAreaView style={styles.workOrderContainer}>
            <View
              style={{
                flex: 1 / numColumn,
                paddingHorizontal: 15,
                marginBottom: 10,
              }}>
              <BuildingCard
                building={selectedBuilding}
                numColumn={numColumn}
                isOpen={true}
              />
            </View>
          </SafeAreaView>
        ) : (
          <SafeAreaView
            style={[
              styles.workOrdersContainer,
              // !isConnected && {maxHeight: SCREEN_HEIGHT},
            ]}>
            <FlatList
              key={numColumn}
              numColumns={numColumn}
              data={buildings}
              onLayout={event => {
                onLayout(event.nativeEvent.layout.width);
              }}
              columnWrapperStyle={
                numColumn !== 1 && {
                  gap: 10,
                }
              }
              contentContainerStyle={{gap: 10, paddingBottom: 10}}
              style={[styles.workOrders]}
              keyExtractor={item => item.id}
              renderItem={renderBuilding}
            />
          </SafeAreaView>
        ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  subcontainer: {
    marginHorizontal: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  filtersContainer: {
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'flex-end',
    width: 252,
    backgroundColor: '#FFF',
  },
  filtersItem: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  filtersItemText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: '#1B6BC0',
  },
  selectedFilter: {
    backgroundColor: '#EAEFFF',
  },
  workOrdersContainer: {
    // flex: 1,
    bottom: 0,
    maxHeight: WINDOW_HEIGHT * 0.55,
    position: 'absolute',
    width: '100%',
  },
  workOrderContainer: {
    // alignSelf: 'center',
    width: '100%',
    // position: 'absolute',
    // bottom: 0,
    flex: 1,
    bottom: 0,
    maxHeight: WINDOW_HEIGHT * 0.55,
    position: 'absolute',
  },
  workOrders: {
    height: 220,
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  countContaintr: {
    backgroundColor: colors.deleteColor,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  countText: {
    color: colors.bottomActiveTextColor,
    fontSize: 10,
  },
});
