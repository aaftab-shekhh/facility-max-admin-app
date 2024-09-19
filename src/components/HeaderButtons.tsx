import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppNavigation, useAppSelector} from '../hooks/hooks';
import {NotificationsIcon} from '../assets/icons/MenuIcons/NotificationsIcon';
import {FC, memo} from 'react';
import {DashboardIcon} from '../assets/icons/MenuIcons/DashboardIcon';
import {Badge} from '@rneui/base';
import {colors} from '../styles/colors';
import {UserRole} from '../enums/user';

type HeaderButtonsProps = {
  fill?: string;
};

export const HeaderButtons: FC<HeaderButtonsProps> = memo(({fill}) => {
  const navigation = useAppNavigation();

  const {notificationsUnreadCount} = useAppSelector(
    state => state.notifications,
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Main', {
            screen: UserRole.TECHNICIAN,
            params: {
              screen: 'MenuTab',
              params: {
                screen: 'Dashboard',
              },
            },
          });
        }}>
        <DashboardIcon fill={fill} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Main', {
            screen: UserRole.TECHNICIAN,
            params: {
              screen: 'MenuTab',
              params: {
                screen: 'Notifications',
              },
            },
          });
        }}>
        <NotificationsIcon fill={fill} />
        {notificationsUnreadCount > 0 && (
          <Badge
            badgeStyle={{backgroundColor: colors.deleteColor}}
            value={notificationsUnreadCount}
            containerStyle={{position: 'absolute', top: -5, left: 15}}
          />
        )}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 15,
    paddingHorizontal: 7,
    gap: 10,
  },
});
