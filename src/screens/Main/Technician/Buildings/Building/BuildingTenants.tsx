import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TenantType, UserType} from '../../../../../types/StateType';
import {colors} from '../../../../../styles/colors';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {NotFound} from '../../../../../components/NotFound';
import {arrayToString} from '../../../../../utils/arrayToString';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {buildingsAPI} from '../../../../../api/buildingsApi';
import {useAppSelector} from '../../../../../hooks/hooks';
import {InfoItem} from '../../../../../components/InfoItem';
import {WOStatus} from '../../../../../components/WOStatus';

type TenantProps = {tenant: TenantType};

const Tenant: FC<TenantProps> = ({tenant}) => {
  const [isOpen, setIsOpen] = useState(false);

  const rooms = useMemo(() => {
    const obj = tenant.leases.reduce(
      (acc, el) => ({...acc, [el.room.name]: true}),
      {},
    );
    return arrayToString(Object.keys(obj)) || '';
  }, [tenant.leases]);

  return (
    <View style={tenantStyles.section}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[tenantStyles.header, isOpen && tenantStyles.headerOpen]}>
        <Text style={[tenantStyles.headerText, {flex: 1}]}>{tenant.name}</Text>
        <WOStatus status={tenant.status} />
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpen && (
        <View style={tenantStyles.container}>
          {rooms.length && <InfoItem title="Room /Office" text={rooms} />}
          <InfoItem title="Website" text={tenant.website} />
          <InfoItem
            title="Total users"
            text={tenant.totalUsersInTenantCompanyCount}
          />
          <InfoItem
            title="Total Sq Ft"
            text={tenant.totalSqFeet || 0}
            hiddeBorder
          />
        </View>
      )}
    </View>
  );
};

export const BuildingTenants = () => {
  const {id} = useAppSelector(state => state.buildings.building);

  const [tenants, setTenants] = useState([]);

  const getTenants = useCallback(async () => {
    try {
      const res = await buildingsAPI.getTenantList({
        buildingId: id,
        size: 100,
        page: 1,
      });

      setTenants(res.data.rows);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  }, [id]);

  const renderItems: ListRenderItem<TenantType> = ({item}) => {
    return <Tenant tenant={item} />;
  };

  useEffect(() => {
    if (id) {
      getTenants();
    }
  }, [id]);

  return (
    <FlatList
      data={tenants}
      renderItem={renderItems}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.flatList}
      style={styles.container}
      ListEmptyComponent={() => {
        return <NotFound title="There are currently no tenants." />;
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  flatList: {
    paddingVertical: 10,
    flexGrow: 1,
    gap: 10,
  },
});

const tenantStyles = StyleSheet.create({
  section: {
    // marginBottom: 15,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    // marginHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 10,
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
  },
  container: {
    marginLeft: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    // paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopStartRadius: 4,
    borderBottomStartRadius: 4,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
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
    color: colors.textColor,
  },
  buttonShow: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
