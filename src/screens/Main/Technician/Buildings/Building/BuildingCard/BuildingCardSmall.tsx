import {FC, useState} from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import {BuildingCardBig} from './BuildingCardBig';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {BuildingType} from '../../../../../../types/StateType';
import {colors} from '../../../../../../styles/colors';
import FastImage from 'react-native-fast-image';
import {arrayToString} from '../../../../../../utils/arrayToString';

type BuildingCardSmallProps = {
  numColumn?: number;
  building: BuildingType;
  setOpen: (open: boolean) => void;
};

export const BuildingCardSmall: FC<BuildingCardSmallProps> = ({
  building,
  numColumn,
  setOpen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  return (
    <Tooltip
      isVisible={isMenuOpen}
      content={<BuildingCardBig building={building} setOpen={setIsMenuOpen} />}
      placement={placement}
      closeOnContentInteraction={true}
      contentStyle={{padding: 0, borderRadius: 10}}
      useInteractionManager={true}
      arrowSize={{width: 0, height: 0}}
      disableShadow
      onClose={() => setIsMenuOpen(false)}>
      <Pressable
        onPress={event => {
          numColumn && numColumn === 1
            ? setOpen(true)
            : (() => {
                event.nativeEvent.pageY < Dimensions.get('window').height / 2
                  ? setPlacement('bottom')
                  : setPlacement('top');
                setIsMenuOpen(true);
              })();
        }}
        style={[styles.container]}>
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
                <Text
                  style={styles.itemText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {building.name}
                </Text>
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
      </Pressable>
    </Tooltip>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'baseline',
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
    height: 0,
    marginHorizontal: -15,
    backgroundColor: colors.backgroundGreyColor,
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
