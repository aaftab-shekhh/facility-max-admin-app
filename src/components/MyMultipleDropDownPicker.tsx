import {FC, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CrossSmallIcon} from '../assets/icons/CrossSmallIcon';
import {ApprovedIcon} from '../assets/icons/ApprovedIcon';
import {MultiSelect} from 'react-native-element-dropdown';
import {colors} from '../styles/colors';

export type ItemType = {
  id: string;
  name: string;
};

type MyMultipleDropDownPickerType = {
  title: string;
  itemsArr: any[];
  startValue?: any[];
  onChangeValue: (value: any[]) => void;
};

export const MyMultipleDropDownPicker: FC<MyMultipleDropDownPickerType> = ({
  title,
  itemsArr,
  onChangeValue,
}) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={styles.containerStyle}
        iconStyle={styles.iconStyle}
        data={itemsArr}
        labelField="name"
        valueField="id"
        placeholder="Select a subcontractor from the list"
        value={selectedAssets}
        onChange={item => {
          setSelectedAssets(item);
        }}
        renderItem={item => (
          <View key={item.id}>
            <View style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.selectedTextStyle}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.itemSecondText}>{item.companyName}</Text>
              </View>
              <Text style={styles.itemSecondText}>Responsibilities</Text>
              {/* <Text style={styles.itemSecondText}>Subcontractor address</Text> */}
              {item.approved && (
                <View style={styles.isApproved}>
                  <ApprovedIcon />
                  <Text style={[styles.selectedTextStyle, styles.approved]}>
                    Approved by procurement
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>
                {item.firstName} {item.lastName}
              </Text>
              <CrossSmallIcon />
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
};
export const styles = StyleSheet.create({
  // checkboxGroup: {
  //   flexDirection: 'column',
  // },
  // checkboxText: {
  //   textDecorationLine: 'none',
  //   fontSize: 14,
  //   fontWeight: '500',
  //   lineHeight: 21,
  //   color: '#000',
  // },
  newSubcontractorButton: {
    marginTop: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondColor,
  },
  dropdown: {
    height: 45,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  containerStyle: {
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    paddingTop: 0,
    marginTop: -10,
    borderTopColor: colors.backgroundLightColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  placeholderStyle: {
    fontSize: 14,
    color: colors.textColor,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: colors.textColor,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    color: colors.textColor,
  },
  icon: {
    marginRight: 5,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    gap: 5,
  },
  itemHeader: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSecondText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondColor,
  },
  isApproved: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 5,
  },
  approved: {
    color: '#28A745',
  },
  notApproved: {
    color: '#DC3545',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    gap: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.mainActiveColor,
    backgroundColor: '#009ef72c',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 14,
    color: colors.mainActiveColor,
  },
  textButtonStyle: {
    color: colors.mainActiveColor,
  },
});
