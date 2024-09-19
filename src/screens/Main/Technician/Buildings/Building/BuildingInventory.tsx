import {FC} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import {useAppSelector} from '../../../../../hooks/hooks';
import {InventoryType} from '../../../../../types/StateType';
import {NotFound} from '../../../../../components/NotFound';

type InventaryProps = {
  inv: InventoryType;
};

const Inventary: FC<InventaryProps> = ({inv}) => {
  return (
    <View style={inventoryStyles.backing}>
      <View style={inventoryStyles.container}>
        <View style={inventoryStyles.row}>
          <Text style={inventoryStyles.title}>Part #</Text>
          <Text style={inventoryStyles.text}>{inv.part}</Text>
        </View>
        <View style={inventoryStyles.row}>
          <Text style={inventoryStyles.title}>Date Added</Text>
          <Text style={inventoryStyles.text}>
            {moment(inv.dateAdd).format('MM/DD/YYYY')}
          </Text>
        </View>
        <View style={inventoryStyles.row}>
          <Text style={inventoryStyles.title}>Manufacturer Part #</Text>
          <Text style={inventoryStyles.text}>{inv.manufacturerPart}</Text>
        </View>
        <View style={inventoryStyles.row}>
          <Text style={inventoryStyles.title}>Qty</Text>
          <Text style={inventoryStyles.text}>{inv.Qty}</Text>
        </View>
        <View style={inventoryStyles.row}>
          <Text style={inventoryStyles.title}>Stock Age</Text>
          <Text style={inventoryStyles.text}>{inv.age}</Text>
        </View>
        <View style={inventoryStyles.row}>
          <Text style={inventoryStyles.title}>Allocated for WO</Text>
          <Text style={inventoryStyles.text}>{inv.allocatedForWO}</Text>
        </View>
      </View>
    </View>
  );
};

export const BuildingInventory = () => {
  const {inventary} = useAppSelector(state => state.buildings.building);

  return (
    <>
      {inventary && inventary.length > 0 ? (
        <FlatList
          data={inventary}
          renderItem={({item}) => {
            return <Inventary inv={item} />;
          }}
          contentContainerStyle={styles.container}
        />
      ) : (
        <NotFound title="There is currently no inventory located at this location" />
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 15,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
  },
  notFoundText: {
    maxWidth: 206,
    paddingHorizontal: 10,
    color: '#202534',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

const inventoryStyles = StyleSheet.create({
  backing: {
    backgroundColor: '#848A9B',
    marginBottom: 10,
    borderRadius: 10,
  },
  container: {
    marginLeft: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    gap: 10,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopStartRadius: 4,
    borderBottomStartRadius: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#848A9B',
  },
  text: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#202534',
  },
});
