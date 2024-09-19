import {
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '../../../../styles/colors';
import {StarIcon} from '../../../../assets/icons/StarIcon';
import {PauseIcon} from '../../../../assets/icons/PauseIcon';
import {ProgressIcon} from '../../../../assets/icons/ProgressIcon';
import {AssignedIcon} from '../../../../assets/icons/AssignedIcon';
import React, {useCallback, useEffect, useState} from 'react';
import {WorkOrderCard} from '../WorkOrders/WO/WorkOrderCard/WorcOrderCard';
import {useAppSelector} from '../../../../hooks/hooks';
import {NotFound} from '../../../../components/NotFound';
import {
  WorkOrderManyAttributeKeys,
  WorkOrderManyIncludeKeys,
  enumStatuses,
  enumTypeWO,
} from '../../../../enums/workOrders';
import {OrderType} from '../../../../types/StateType';
import {woAPI} from '../../../../api/woApi';
import {handleServerNetworkError} from '../../../../utils/handleServerNetworkUtils';
import {PMCard} from '../WorkOrders/WO/PMCard/PMCard';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../hooks/useLocalStateSelector';
import {useOrientation} from '../../../../hooks/useOrientation';

const headerItems = [
  {
    id: '1',
    status: enumStatuses.NEW,
    label: enumStatuses.NEW,
    icon: <AssignedIcon />,
    iconActive: <AssignedIcon color="#28A745" />,
  },
  {
    id: '2',
    status: enumStatuses.IN_PROGRESS,
    label: enumStatuses.IN_PROGRESS,
    icon: <ProgressIcon />,
    iconActive: <ProgressIcon color="#28A745" />,
  },
  {
    id: '3',
    status: enumStatuses.ON_HOLD,
    label: enumStatuses.ON_HOLD,
    icon: <PauseIcon />,
    iconActive: <PauseIcon color="#28A745" />,
  },
  {
    id: '4',
    status: enumStatuses.PENDING_REVIEW,
    label: enumStatuses.PENDING_REVIEW,
    icon: <StarIcon />,
    iconActive: <StarIcon color="#28A745" />,
  },
];

const attributeCriteria = Object.values(WorkOrderManyAttributeKeys);
const includeCriteria = [
  WorkOrderManyIncludeKeys.asset,
  WorkOrderManyIncludeKeys.technicians,
  WorkOrderManyIncludeKeys.bucket,
];

const limit = 10;

export const CurrentWOs = () => {
  const {assignedBuckets} = useAppSelector(state => state.user);

  const {isConnected} = useNetInfo();
  const {getLocalWOs} = useLocalStateSelector();
  const {numColumn, onLayout} = useOrientation();

  const [workOrders, setWorkOrders] = useState<OrderType[]>([]);
  const [count, setCount] = useState(0);

  const [status, setStatus] = useState(enumStatuses.NEW);
  const [isLoading, setIsLoading] = useState(false);

  const getWOs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await woAPI.getWorkOrdersMany({
        limit,
        showPM: false,
        offset: 0,
        statuses: [status],
        attributeCriteria,
        includeCriteria,
      });
      setCount(res.data.count);
      setWorkOrders(res.data.payload);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [workOrders, status]);

  const loadWOs = useCallback(async () => {
    if (count > workOrders.length) {
      try {
        const res = await woAPI.getWorkOrdersMany({
          // byBucket: true,
          limit,
          offset: workOrders.length,
          statuses: [status],
          attributeCriteria,
          includeCriteria,
        });
        setCount(res.data.count);
        setWorkOrders(prev => [...prev, ...res.data.payload]);
      } catch (err) {
        handleServerNetworkError(err.response.data);
      }
    }
  }, [workOrders, status]);

  const renderItem: ListRenderItem<OrderType> = useCallback(({item}) => {
    return item.type === enumTypeWO.PREVENTATIVE_MAINTENANCE ? (
      <View style={{flex: 1 / numColumn}}>
        <PMCard order={item} numColumn={numColumn} />
      </View>
    ) : (
      <View style={{flex: 1 / numColumn}}>
        <WorkOrderCard
          order={item}
          refreshList={getWOs}
          numColumn={numColumn}
        />
      </View>
    );
  }, []);

  useEffect(() => {
    isConnected
      ? getWOs()
      : setWorkOrders(
          getLocalWOs({status}).filter(el => {
            if (
              assignedBuckets.length > 0 &&
              el.type !== enumTypeWO.RECURRING_MAINTENANCE
            ) {
              const idsAssignedBuckets = assignedBuckets.map(b => b.id);
              return el.buckets?.some(buck =>
                idsAssignedBuckets.includes(buck.id),
              );
            } else {
              return;
            }
          }),
        );
  }, [status, isConnected]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {headerItems.map(item => (
          <Pressable
            key={item.id}
            style={[
              styles.headerItem,
              status === item.status && styles.headerItemActive,
            ]}
            onPress={() => setStatus(item.status)}>
            <View
              style={[
                styles.headerItemBody,
                status === item.status && styles.headerItemBodyActive,
              ]}>
              {status === item.status ? item.iconActive : item.icon}
              <Text
                style={[
                  styles.headerItemText,
                  status === item.status && styles.headerItemTextActive,
                ]}>
                {item.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <FlatList
        key={numColumn}
        onLayout={event => {
          onLayout(event.nativeEvent.layout.width);
        }}
        horizontal={false}
        data={workOrders}
        numColumns={numColumn}
        contentContainerStyle={styles.flatList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        columnWrapperStyle={numColumn !== 1 && {gap: 10}}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getWOs}
            colors={[colors.mainActiveColor]} // for android
            tintColor={colors.mainActiveColor} // for ios
          />
        }
        onEndReached={loadWOs}
        onEndReachedThreshold={0}
        ListEmptyComponent={() => {
          return <NotFound title="Work orders not found" />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 15,
    gap: 5,
  },
  headerItem: {
    flex: 1,
    borderRadius: 10,
  },
  headerItemActive: {
    backgroundColor: '#28A745',
  },
  headerItemBody: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
    borderColor: colors.disabledInputBackground,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 10,
  },
  headerItemBodyActive: {
    backgroundColor: '#fffc',
    borderWidth: 0,
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
  },
  headerItemText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 15,
    color: colors.textSecondColor,
  },
  headerItemTextActive: {
    color: '#28A745',
  },
  flatList: {
    marginVertical: 10,
    paddingHorizontal: 15,
    flexGrow: 1,
    paddingBottom: 20,
    gap: 10,
  },
});
