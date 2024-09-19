import {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../styles/colors';
import FastImage from 'react-native-fast-image';
import {SCREEN_WIDTH} from '../styles/styles';

type InfoItemProps = {
  title: string;
  customText?: JSX.Element;
  text?: string | number;
  img?: string;
  hiddeBorder?: boolean;
  column?: boolean;
  icon?: JSX.Element;
  rightIcon?: JSX.Element;
  customRightItem?: JSX.Element;
  action?: () => void;
  isLink?: boolean;
};

export const InfoItem: FC<InfoItemProps> = ({
  title,
  text,
  img,
  hiddeBorder,
  column,
  icon,
  action,
  customText,
  rightIcon,
  customRightItem,
  isLink,
}) => {
  return (
    <View
      style={[
        styles.container,
        hiddeBorder && styles.hiddeBorder,
        column && styles.column,
      ]}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1}}>
        {icon && icon}
        <Text
          style={[styles.itemTitle, !column && {maxWidth: SCREEN_WIDTH * 0.4}]}>
          {title}
        </Text>
      </View>
      {/* <View style={{flex: 1}}> */}
      {customRightItem ? (
        customRightItem
      ) : customText ? (
        <TouchableOpacity
          style={[styles.row]}
          onPress={action && action}
          disabled={!action}
          hitSlop={20}>
          {customText}
          {rightIcon && rightIcon}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.row, {flex: 1}]}
          onPress={action && action}
          disabled={!action}
          hitSlop={20}>
          {img && (
            <FastImage style={styles.icon} source={img} defaultSource={img} />
          )}
          <Text
            style={[
              styles.itemText,
              isLink && styles.link,
              !column && {maxWidth: SCREEN_WIDTH * 0.4},
            ]}>
            {text && text}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: colors.backgroundGreyColor,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    alignItems: 'flex-start',
    gap: 5,
  },

  hiddeBorder: {borderBottomWidth: 0},

  column: {
    flexDirection: 'column',
  },

  itemTitle: {
    flex: 1,
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    maxWidth: SCREEN_WIDTH,
  },

  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  icon: {
    width: 25,
    height: 25,
  },

  itemText: {
    // flex: 1,
    // width: '100%',
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },

  link: {
    color: colors.borderAssetColor,
    fontWeight: '500',
  },
});
