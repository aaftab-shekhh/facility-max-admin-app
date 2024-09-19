import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {colors} from '../styles/colors';
import {FC, useCallback, useEffect, useState} from 'react';
import {CrossSmallIcon} from '../assets/icons/CrossSmallIcon';
import FastImage from 'react-native-fast-image';
import {assetsAPI} from '../api/assetsApi';

type DropdownWithSearchProps = {
  label?: string;
  data?: any[];
  onChange: (item: any) => void;
  startValue?: string | null | string[];
  border?: boolean;
  multiSelect?: boolean;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  isIcon?: boolean;
  dropdownIcons?: any;
  search?: boolean;
  keyItem?: string;
  rightLabel?: boolean;
  backgroundColor?: string;
};

export const DropdownWithSearch: FC<DropdownWithSearchProps> = ({
  label,
  startValue,
  onChange,
  data,
  border,
  multiSelect,
  placeholder,
  touched,
  error,
  isIcon,
  dropdownIcons,
  search,
  keyItem,
  rightLabel,
  backgroundColor,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[] | string>(
    startValue || [],
  );
  const [dropdownData, setDropdownData] = useState<any[]>([]);

  const renderItems = (item: any) => {
    return (
      <View style={styles.item}>
        {isIcon && (
          <FastImage
            source={
              item.file
                ? {uri: item.file.url}
                : (dropdownIcons && dropdownIcons[item.id || item.name]) ||
                  dropdownIcons['defaultSource']
            }
            style={[styles.icon, item.color && {backgroundColor: item.color}]}
            defaultSource={
              (dropdownIcons && dropdownIcons[item.name]) ||
              dropdownIcons['defaultSource']
            }
            resizeMode="cover"
          />
        )}
        <Text style={styles.textItem}>{item.name}</Text>
        {rightLabel && (
          <View
            style={{
              borderRadius: 5,
              backgroundColor: item.labelBackgroundColor,
            }}>
            <Text
              style={[
                styles.labelText,
                {color: item.labelColor, borderColor: item.labelColor},
              ]}>
              {item.labelText}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const getData = useCallback(async () => {
    if (keyItem) {
      const res = await assetsAPI.getDataFilters({
        type: keyItem,
      });

      setDropdownData(res.data.payload);
    }
  }, []);

  const renderLeftIcon = useCallback(() => {
    if (selectedItems && isIcon) {
      return (
        <FastImage
          style={styles.icon}
          source={
            selectedItems?.file
              ? {uri: selectedItems.file?.url}
              : dropdownIcons[selectedItems?.id || selectedItems?.name] ||
                dropdownIcons['defaultSource']
          }
          defaultSource={
            (dropdownIcons &&
              dropdownIcons[selectedItems?.id || selectedItems?.name]) ||
            dropdownIcons['defaultSource']
          }
        />
      );
    }
  }, [selectedItems, isIcon]);

  useEffect(() => {
    if (!data && keyItem) {
      getData();
    } else if (data) {
      setDropdownData(data);
    }

    if (startValue && !multiSelect) {
      setSelectedItems(dropdownData.find(el => el.id === startValue));
    }
    if (startValue && multiSelect) {
      setSelectedItems(startValue);
    }
    if (!startValue) {
      setSelectedItems([]);
    }
  }, [data, startValue]);

  return (
    <View style={[styles.container]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {!multiSelect ? (
        <Dropdown
          style={[
            styles.dropdown,
            border && styles.border,
            backgroundColor && {backgroundColor},
            touched && error && styles.inputError,
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          activeColor={colors.calendarBsckGround}
          containerStyle={[styles.containerStyle, border && styles.border]}
          data={dropdownData}
          search={search}
          labelField="name"
          valueField="id"
          placeholder={placeholder ? placeholder : label}
          value={
            multiSelect
              ? startValue
              : dropdownData.find(el => el.id === startValue)
          }
          searchPlaceholder={`Search ${label}...`}
          onChange={item => {
            setSelectedItems(item);
            onChange(item);
          }}
          renderItem={renderItems}
          renderLeftIcon={renderLeftIcon}
        />
      ) : (
        <MultiSelect
          style={[
            styles.dropdown,
            border && styles.border,
            touched && error && styles.inputError,
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          activeColor={colors.secondButtonColor}
          inputSearchStyle={styles.inputSearchStyle}
          containerStyle={[styles.containerStyle, border && styles.border]}
          iconStyle={styles.iconStyle}
          data={dropdownData}
          search={search}
          labelField="name"
          valueField="id"
          onFocus={() => {
            if (!data) {
              getData();
            }
          }}
          flatListProps={{
            ListEmptyComponent: () => (
              <View style={{marginVertical: 10}}>
                <ActivityIndicator color={colors.mainActiveColor} />
              </View>
            ),
          }}
          placeholder={placeholder ? placeholder : label}
          value={Array.isArray(selectedItems) ? selectedItems : null}
          searchPlaceholder={`Search ${label}...`}
          onChange={item => {
            setSelectedItems(item);
            onChange(item);
          }}
          renderItem={renderItems}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>{item.name}</Text>
                <CrossSmallIcon />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {touched && error && (
        <View style={[styles.subLabel]}>
          <View style={styles.mark}>
            <Text style={styles.markText}>!</Text>
          </View>
          <Text style={styles.labelErrorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // marginTop: 10,
  },

  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.textSecondColor,
  },

  label: {
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,

    marginBottom: 2,
  },

  dropdown: {
    height: 42,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
    borderRadius: 6,
  },

  containerStyle: {
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    paddingTop: 0,
    marginTop: -10,
    marginLeft: 1,
    marginRight: -1,
    borderTopColor: colors.backgroundLightColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  item: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: colors.backgroundGreyColor,
    borderTopWidth: 1,
    borderStyle: 'solid',
  },

  textItem: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },

  placeholderStyle: {
    fontSize: 14,
    color: colors.textColor,
  },

  selectedTextStyle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },

  iconStyle: {
    width: 25,
    height: 25,
  },

  inputSearchStyle: {
    borderRadius: 8,
    height: 40,
    fontSize: 14,
    color: colors.textColor,
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

  subLabel: {
    flexDirection: 'row',
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 2,
  },
  labelError: {
    marginTop: 5,
  },
  labelErrorText: {
    color: colors.deleteColor,
    fontSize: 12,
    lineHeight: 18,
  },
  inputError: {
    borderColor: colors.deleteColor,
    borderWidth: 0.5,
    borderStyle: 'solid',
    // backgroundColor: colors.errorBackground,
  },
  mark: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: colors.deleteColor,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: 5,
  },
  markText: {
    color: colors.deleteColor,
    fontSize: 10,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.mainActiveColor,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.mainActiveColor,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
});
