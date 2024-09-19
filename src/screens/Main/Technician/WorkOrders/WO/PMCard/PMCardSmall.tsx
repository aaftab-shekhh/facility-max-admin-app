import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {PMTypeIcons, dropdownIcons} from '../../../../../../bll/icons';
import {useAppNavigation} from '../../../../../../hooks/hooks';
import {getTab} from '../../../../../../utils/getTab';
import {colors} from '../../../../../../styles/colors';
import Tooltip from 'react-native-walkthrough-tooltip';
import {PMCardBig} from './PMCardBig';
import {FC, useState} from 'react';
import {OrderType} from '../../../../../../types/StateType';
import {UserRole} from '../../../../../../enums/user';

type PMCardSmallProps = {
  order: OrderType;
  setOpen: (open: boolean) => void;
  numColumn: number;
};

export const PMCardSmall: FC<PMCardSmallProps> = ({
  order,
  setOpen,
  numColumn,
}) => {
  const navigation = useAppNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');

  return (
    <Tooltip
      isVisible={isMenuOpen}
      content={
        <PMCardBig
          order={order}
          setOpen={setIsMenuOpen}
          numColumn={numColumn}
        />
      }
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
        style={styles.container}>
        <View style={[styles.row, styles.spaceBetween]}>
          <View style={[styles.gap, styles.row]}>
            <View style={[styles.row, {alignItems: 'center'}]}>
              {order.assets && order.assets.length > 0 && (
                <Pressable
                  onPress={() => {
                    navigation.navigate('Main', {
                      screen: UserRole.TECHNICIAN,
                      params: {
                        screen: getTab(navigation.getState().routeNames[0]),
                        params: {
                          screen: 'Asset',
                          params: {id: order.assets[0].id},
                        },
                      },
                    });
                  }}>
                  <FastImage
                    source={
                      order.assets[0].category?.link
                        ? {uri: order.assets[0].category?.link}
                        : dropdownIcons[order.assets[0].category?.name]
                    }
                    style={styles.assetIcon}
                    defaultSource={
                      dropdownIcons[order.assets[0].category?.name]
                    }
                  />
                </Pressable>
              )}
              <FastImage
                source={PMTypeIcons[order.subType]}
                style={styles.assetIcon}
                defaultSource={PMTypeIcons[order.subType]}
              />
              <View style={styles.row}>
                <Text style={styles.itemText}>{order.title || '-'}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'baseline',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#fff',
    minHeight: 65,
    borderColor: colors.mainActiveColor,
    gap: 7,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  spaceBetween: {
    justifyContent: 'space-between',
    backgroundColor: '#44B8FF1A',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
  },

  gap: {
    flex: 1,
    gap: 5,
  },
  assetIcon: {
    width: 36,
    height: 36,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },
});
