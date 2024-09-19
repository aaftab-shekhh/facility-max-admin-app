import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {colors} from '../styles/colors';
import {FC, memo, useCallback, useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';

type DropdownWithSearchProps = {
  label?: string;
  data: any[];
  onChange: (item: any) => void;
  startValue?: string;
  placeholder?: string;
  handleBlur?: (e?: any) => void;
  error?: string;
  touched?: boolean;
  isIcon?: boolean;
  dropdownIcons?: any;
  backgroundColor?: string;
  disable?: boolean;
  loadData?: () => void;
};

export const DropdownWithLeftIcon: FC<DropdownWithSearchProps> = memo(
  ({
    label,
    data,
    onChange,
    startValue,
    placeholder,
    handleBlur,
    touched,
    error,
    isIcon,
    dropdownIcons,
    backgroundColor,
    disable,
    loadData,
  }) => {
    const [selectedItem, setSelectedItem] = useState<any>(
      data.find(el => el.id === startValue) || null,
    );

    const renderItems = (item: any) => {
      return (
        <View style={[styles.item]}>
          {isIcon && (item?.file?.url || dropdownIcons) && (
            <FastImage
              source={
                item.file
                  ? {uri: item.file.url}
                  : (dropdownIcons && dropdownIcons[item.id]
                      ? dropdownIcons[item.id]
                      : dropdownIcons[item.name]
                      ? dropdownIcons[item.name]
                      : dropdownIcons[item.categories?.name]) ||
                    dropdownIcons['defaultSource']
              }
              style={[styles.icon, item.color && {backgroundColor: item.color}]}
              defaultSource={
                (dropdownIcons && dropdownIcons[item.id]
                  ? dropdownIcons[item.id]
                  : dropdownIcons[item.name]
                  ? dropdownIcons[item.name]
                  : dropdownIcons[item.categories?.name]) ||
                dropdownIcons['defaultSource']
              }
              resizeMode="cover"
            />
          )}

          <Text style={styles.textItem}>{item.name}</Text>
        </View>
      );
    };

    const renderLeftIcon = useCallback(() => {
      if (selectedItem && isIcon) {
        return (
          <FastImage
            style={[
              styles.icon,
              selectedItem.color && {backgroundColor: selectedItem.color},
            ]}
            source={
              selectedItem?.file
                ? {uri: selectedItem.file.url}
                : (dropdownIcons && dropdownIcons[selectedItem.id]
                    ? dropdownIcons[selectedItem.id]
                    : dropdownIcons[selectedItem.name]
                    ? dropdownIcons[selectedItem.name]
                    : dropdownIcons[selectedItem.categories?.name]) ||
                  dropdownIcons['defaultSource']
            }
            defaultSource={
              (dropdownIcons && dropdownIcons[selectedItem.id]
                ? dropdownIcons[selectedItem.id]
                : dropdownIcons[selectedItem.name]
                ? dropdownIcons[selectedItem.name]
                : dropdownIcons[selectedItem.categories?.name]) ||
              dropdownIcons['defaultSource']
            }
          />
        );
      }
    }, [selectedItem, isIcon]);

    useEffect(() => {
      if (startValue) {
        setSelectedItem(data.find(el => el.id === startValue) || null);
      } else {
        if (data.length === 1) {
          setSelectedItem(data[0]);
          onChange(data[0]);
        } else {
          setSelectedItem(null);
        }
      }
    }, [startValue, data]);

    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Dropdown
          style={[
            styles.dropdown,
            backgroundColor && {backgroundColor},
            touched && error && styles.inputError,
            disable && {backgroundColor: colors.disabledInputBackground},
          ]}
          disable={disable}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={[styles.selectedTextStyle]}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={[styles.iconStyle, disable && {display: 'none'}]}
          activeColor={colors.calendarBsckGround}
          containerStyle={[
            styles.containerStyle,
            backgroundColor && {backgroundColor},
          ]}
          dropdownPosition="bottom"
          data={data}
          labelField="name"
          valueField="id"
          flatListProps={{
            onEndReached: loadData,
            onEndReachedThreshold: 0,
          }}
          placeholder={placeholder ? placeholder : label}
          value={selectedItem}
          onChange={item => {
            setSelectedItem(item);
            onChange(item);
          }}
          onBlur={handleBlur}
          renderItem={renderItems}
          renderLeftIcon={renderLeftIcon}
        />
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
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  label: {
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    // marginTop: 10,
    marginBottom: 2,
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
  dropdown: {
    zIndex: 1,
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
    paddingTop: 10,
    marginTop: -10,
    borderTopColor: colors.backgroundLightColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  item: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
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
});
