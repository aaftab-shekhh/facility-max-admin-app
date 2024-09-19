import {FC, memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {RoomType} from '../../../../../../types/StateType';
import {RoomIcon} from '../../../../../../assets/icons/assets/RoomIcon';
import {useAppNavigation} from '../../../../../../hooks/hooks';
import {UserRole} from '../../../../../../enums/user';
import {getTab} from '../../../../../../utils/getTab';

type RoomProps = {
  room: RoomType;
  getRooms: () => void;
};

export const Room: FC<RoomProps> = memo(({room, getRooms}) => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      style={styles.section}
      onPress={() => {
        navigation.getState().routeNames[0] === 'PDFPlan'
          ? navigation.navigate('Plan', {
              screen: 'RoomDetailsScreen',
              params: {roomId: room.id, getRooms},
            })
          : navigation.getState().routeNames[0] === 'Scaner'
          ? navigation.navigate('QR', {
              screen: 'RoomDetailsScreen',
              params: {roomId: room.id, getRooms},
            })
          : navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: getTab(navigation.getState().routeNames[0]),
                params: {
                  screen: 'RoomDetailsScreen',
                  params: {roomId: room.id, getRooms},
                },
              },
            });
      }}>
      <View style={styles.header}>
        <RoomIcon />
        <Text style={styles.headerText}>{room.name}</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  section: {},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },

  headerText: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    flex: 0.9,
  },
});
