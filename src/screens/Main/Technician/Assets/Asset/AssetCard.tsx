import {FC, memo, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {AssetType} from '../../../../../types/StateType';
import {getTab} from '../../../../../utils/getTab';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../bll/icons';
import {UserRole} from '../../../../../enums/user';
import {useAppNavigation} from '../../../../../hooks/hooks';

type AssetCardProps = {
  asset: AssetType;
  isExpandAll?: boolean;
};

export const AssetCard: FC<AssetCardProps> = memo(({asset, isExpandAll}) => {
  const {
    id,
    name,
    types,
    category,
    pagesCount,
    building,
    room,
    serialNumber,
    equipmentId,
  } = asset;

  const navigation = useAppNavigation();

  const [isOpen, setIsOpen] = useState<boolean>(isExpandAll || false);

  useEffect(() => {
    setIsOpen(isExpandAll || false);
  }, [isExpandAll]);

  return (
    <View style={styles.assetsContainer}>
      <View style={styles.header}>
        <FastImage
          source={
            category?.file
              ? {uri: category?.file.url}
              : dropdownIcons[category?.name]
          }
          style={[
            styles.icon,
            category.color && {backgroundColor: category.color},
          ]}
          defaultSource={dropdownIcons[category?.name]}
        />
        <View style={{flex: 1}}>
          <Text style={[styles.text, styles.name]}>{name}</Text>
          <Text style={styles.type}>Type: {types ? types?.name : '-'}</Text>
        </View>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)} hitSlop={15}>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </TouchableOpacity>
      </View>
      {isOpen && (
        <View style={styles.openItem}>
          <View style={styles.row}>
            <Text style={styles.title}>Equipment ID</Text>
            <Text style={styles.text}>{equipmentId ? equipmentId : '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Serial #</Text>
            <Text style={styles.text}>{serialNumber ? serialNumber : '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Building/Room</Text>
            {building || room ? (
              <Text style={styles.text}>
                {building?.name} {room?.name}
              </Text>
            ) : (
              <Text style={styles.text}>-</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Plans</Text>
            <Text style={styles.text}>
              {pagesCount ? `${pagesCount} plans` : '-'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Main', {
                screen: UserRole.TECHNICIAN,
                params: {
                  screen: getTab(navigation.getState().routeNames[0]),
                  params: {
                    screen: 'Asset',
                    params: {id},
                  },
                },
              });
            }}
            style={[styles.button]}>
            <Text style={[styles.buttonText]}>View Asset Info</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  assetsContainer: {
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundAssetCard,
  },

  openItem: {
    marginHorizontal: -10,
    marginBottom: 15,
    paddingTop: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.backgroundLightColor,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  header: {
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },

  row: {
    flex: 0.5,
    alignContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },

  title: {
    alignItems: 'center',
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondColor,
  },

  type: {
    alignItems: 'center',
    flex: 0.5,
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondColor,
  },

  text: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textColor,
  },

  name: {
    flex: 1,
  },

  icon: {
    alignSelf: 'center',
    width: 25,
    height: 25,
    borderRadius: 6,
  },

  button: {
    alignItems: 'center',
    marginHorizontal: -12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: colors.backgroundGreyColor,
    borderTopWidth: 1,
    borderStyle: 'solid',
  },

  buttonText: {
    paddingVertical: 5,
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 20,
    color: colors.mainActiveColor,
  },
});
