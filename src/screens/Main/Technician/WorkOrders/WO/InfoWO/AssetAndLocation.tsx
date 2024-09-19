import {FC, useState} from 'react';
import {OrderType} from '../../../../../../types/StateType';
import {AssetCard} from './AssetCard';
import {AddNewAssetsToWO} from './AddNewAssetsToWO';
import {Pressable, Text, View} from 'react-native';
import {styles} from './WorkOrderInfo';
import {InfoItem} from '../../../../../../components/InfoItem';
import {colors} from '../../../../../../styles/colors';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {enumTypeWO} from '../../../../../../enums/workOrders';

type AssetAndLocationProps = {
  order: OrderType;
  getWO: () => void;
  numColumn: number;
};

export const AssetAndLocation: FC<AssetAndLocationProps> = ({
  order,
  getWO,
  numColumn,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.header, isOpen && styles.headerOpen]}>
        <Text style={styles.headerText}>
          {order.type === enumTypeWO.AMENITY_SPACE_BOOKING
            ? 'Location'
            : 'Asset & Location'}
        </Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpen ? (
        <View style={{marginHorizontal: 15, gap: 5}}>
          {order.building?.address && (
            <View style={{flex: 1}}>
              <InfoItem title="Address" text={order.building?.address} />
            </View>
          )}
          <View style={numColumn === 1 ? styles.column : styles.row}>
            {order.building?.region && (
              <View style={{flex: 1}}>
                <InfoItem
                  title="Region "
                  text={order.building?.region?.name || '-'}
                  hiddeBorder={!order?.room && !order?.floor}
                />
              </View>
            )}
            {order.building?.name && (
              <View style={{flex: 1}}>
                <InfoItem
                  title="Building"
                  text={(order.building && order.building?.name) || '-'}
                  hiddeBorder={!order?.room && !order?.floor}
                />
              </View>
            )}
          </View>
          <View style={numColumn === 1 ? styles.column : styles.row}>
            {order.floor && (
              <View style={{flex: 1}}>
                <InfoItem
                  title="Floor (optional) "
                  text={order.floor?.name || '-'}
                  hiddeBorder
                />
              </View>
            )}
            {order.room && (
              <View style={{flex: 1}}>
                <InfoItem
                  title="Room/Office (optional)"
                  text={order.room?.name || '-'}
                  hiddeBorder
                />
              </View>
            )}
          </View>

          {order.type !== enumTypeWO.AMENITY_SPACE_BOOKING && order.assets && (
            <View style={styles.assets}>
              {order.assets.map(asset => {
                return (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    workOrderId={order.id}
                    getWO={getWO}
                    numColumn={numColumn}
                  />
                );
              })}
            </View>
          )}

          {order.type !== enumTypeWO.AMENITY_SPACE_BOOKING && (
            <AddNewAssetsToWO
              getWO={getWO}
              workOrderId={order.id}
              buildingId={order.buildingId}
              assets={order.assets}
            />
          )}
        </View>
      ) : null}
    </View>
  );
};
