import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowRightIcon} from '../../assets/icons/ArrowRightIcon';
import {colors} from '../../styles/colors';
import {FC, memo} from 'react';
import {FloorType} from '../../types/StateType';
import {Dropdown} from 'react-native-element-dropdown';
import {useAppSelector} from '../../hooks/hooks';
import {sortedBy} from '../../utils/sorted';
import {useNetInfo} from '@react-native-community/netinfo';

type PlanNavButtonProps = {
  dropdownItems?: FloorType[];
  placeholder?: string;
  onChange: (planId: string) => void;
};

export const PlanNavButton: FC<PlanNavButtonProps> = memo(
  ({placeholder, onChange, dropdownItems}) => {
    // const memoizedValue = useMemo(() => renderItem, []);
    const {isConnected} = useNetInfo();

    const {floors} = useAppSelector(state => state.buildings);
    const {plan} = useAppSelector(state => state.local.db);

    const data = isConnected
      ? dropdownItems
      : floors &&
        floors.map(floor => {
          const floorPlans = Object.values(plan || {}).filter(
            pl => pl.floorId === floor.id,
          );
          return {...floor, floorPlans};
        });

    const renderItem = (item: FloorType) => {
      return (
        <View style={styles.item}>
          {/* <PdfPlanFileIcon /> */}
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemCountPlans}>
            Plans: {item.floorPlans?.length}
          </Text>
        </View>
      );
    };

    return (
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        containerStyle={styles.containerStyle}
        itemContainerStyle={styles.itemContainerStyle}
        selectedTextStyle={styles.placeholderStyle}
        flatListProps={{
          style: {
            minWidth: 250,
            maxWidth: 250,
            backgroundColor: colors.backgroundLightColor,
            borderRadius: 10,
          },
        }}
        data={sortedBy('name', data)}
        dropdownPosition="auto"
        labelField="name"
        valueField="id"
        inverted
        placeholder={placeholder}
        onChange={item => {
          if (item.floorPlans[0]) {
            onChange(item.floorPlans[0].id);
          }
        }}
        renderRightIcon={() => (
          <Pressable style={{height: 30}}>
            <ArrowRightIcon />
          </Pressable>
        )}
        renderItem={renderItem}
      />
    );
  },
);

const styles = StyleSheet.create({
  dropdown: {
    marginHorizontal: 10,
  },
  itemContainerStyle: {
    // flex: 1,
    maxWidth: 250,
  },
  containerStyle: {
    maxWidth: 250,
    minWidth: 250,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 14,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  itemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  itemCountPlans: {
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  placeholderStyle: {
    marginRight: 10,
    color: colors.bottomActiveTextColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 10,
  },
});
