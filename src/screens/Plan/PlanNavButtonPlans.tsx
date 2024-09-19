import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../styles/colors';
import {Dropdown} from 'react-native-element-dropdown';
import {FC} from 'react';
import {PlanType} from '../../types/StateType';
import {ArrowRightIcon} from '../../assets/icons/ArrowRightIcon';
import {useAppSelector} from '../../hooks/hooks';
import {sortedBy} from '../../utils/sorted';
import {useNetInfo} from '@react-native-community/netinfo';

type PlanNavButtonPlansProps = {
  dropdownItems?: PlanType[];
  placeholder?: string;
  onChange: (planId: string) => void;
};

export const PlanNavButtonPlans: FC<PlanNavButtonPlansProps> = ({
  onChange,
  dropdownItems,
}) => {
  const {isConnected} = useNetInfo();

  const {plan} = useAppSelector(state => state.plan);
  const {plan: localPlan} = useAppSelector(state => state.local.db);

  const data = isConnected
    ? dropdownItems
    : Object.values(localPlan || {}).filter(pl => pl.floorId === plan.floorId);

  const renderItem = (item: PlanType) => {
    return (
      <View style={styles.item}>
        {/* <PdfPlanFileIcon /> */}

        <Text style={styles.itemText}>{item.name}</Text>
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
          // backgroundColor: colors.backgroundLightColor,
          borderRadius: 10,
        },
      }}
      data={sortedBy('name', data)}
      dropdownPosition="auto"
      labelField="name"
      valueField="id"
      inverted
      placeholder={plan.name}
      onChange={item => {
        onChange(item.id);
      }}
      renderRightIcon={() => (
        <Pressable style={{height: 30}}>
          <ArrowRightIcon />
        </Pressable>
      )}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    marginHorizontal: 10,
  },
  itemContainerStyle: {
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
    paddingBottom: 0,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },

  itemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  placeholderStyle: {
    marginRight: 10,
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    lineHeight: 18,
  },
});
