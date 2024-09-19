import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {arrayToString} from '../../../../../../utils/arrayToString';
import FastImage from 'react-native-fast-image';
import {FC} from 'react';
import {useAppNavigation} from '../../../../../../hooks/hooks';
import {BuildingType} from '../../../../../../types/StateType';
import {getTab} from '../../../../../../utils/getTab';
import {UserRole} from '../../../../../../enums/user';

type BuildingCardBigProps = {
  building: BuildingType;
  setOpen: (open: boolean) => void;
};

export const BuildingCardBig: FC<BuildingCardBigProps> = ({
  building,
  setOpen,
}) => {
  const navigation = useAppNavigation();

  return (
    <Pressable onPress={() => setOpen(false)} style={[styles.container]}>
      <View style={[styles.row, styles.spaceBetween]}>
        <View style={[styles.gap, styles.row]}>
          <View style={[styles.row]}>
            <FastImage
              style={styles.photo}
              source={
                building.avatar
                  ? {
                      uri: building.avatar.url,
                    }
                  : require('../../../../../../assets/img/Building.png')
              }
              defaultSource={require('../../../../../../assets/img/Building.png')}
            />
            <View style={{flex: 1}}>
              <Text style={styles.itemText}>{building.name}</Text>
              <Text
                style={styles.address}
                numberOfLines={1}
                ellipsizeMode="tail">
                {arrayToString([building.address]) || '-'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.line]} />

      <View>
        <Text
          style={styles.descriptionItemText}
          numberOfLines={1}
          ellipsizeMode="tail">
          {arrayToString([building.address]) || '-'}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={styles.gap}>
          <Text style={styles.itemTextHeader}>Sq. Ft.:</Text>
          <Text style={styles.descriptionItemText}>{building.area || '-'}</Text>
        </View>
        <View style={[styles.gap]}>
          <Text style={styles.itemTextHeader}>Number of Assets:</Text>
          <Text style={styles.descriptionItemText}>
            {building.totalAssetsCount || 0}
          </Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={[styles.row]}>
        <View style={styles.gap}>
          <Text style={[styles.itemTextHeader, {color: colors.deleteColor}]}>
            Past due WO(s):
          </Text>
          <Text style={[styles.itemText, {color: colors.deleteColor}]}>
            {building.pastDueWOCount || 0} WOs
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          setOpen(false);
          navigation.navigate('Main', {
            screen: UserRole.TECHNICIAN,
            params: {
              screen: getTab(navigation.getState().routeNames[0]),
              params: {
                screen: 'Building',
                params: {id: building.id},
              },
            },
          });
        }}
        style={[styles.moreButton]}>
        <Text style={styles.moreButtonText}>View Building Info</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 300,
    maxWidth: 500,
    // marginHorizontal: 15,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.buildingCardButton,
    backgroundColor: colors.bottomActiveTextColor,
    paddingHorizontal: 15,
    gap: 7,
    paddingTop: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  body: {
    flexDirection: 'row',
    gap: 10,
  },
  photo: {
    width: 36,
    height: 36,
    borderRadius: 5,
  },
  description: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  descriptionItemText: {
    flex: 1,
    flexWrap: 'wrap',
    color: colors.textColor,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
  },
  address: {
    flexWrap: 'wrap',
    color: colors.textSecondColor,
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 15,
  },

  gap: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  line: {
    height: 1,
    marginHorizontal: -15,
    backgroundColor: colors.backgroundGreyColor,
  },
  hiddeLine: {
    height: 0,
  },
  moreButton: {
    flex: 1,
    height: 30,
    backgroundColor: colors.buildingCardButton,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    marginHorizontal: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  itemText: {
    flexWrap: 'wrap',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    color: colors.textColor,
  },

  light: {
    lineHeight: 14,
    color: colors.textSecondColor,
  },
  itemTextHeader: {
    color: colors.textSecondColor,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});
