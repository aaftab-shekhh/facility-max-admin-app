import {StyleSheet, Switch, Text, View} from 'react-native';
import {FC, memo, useState} from 'react';
import {colors} from '../styles/colors';
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import {updateSettingNotificationTC} from '../bll/reducers/user-reducer';
import {NotificationSettingType} from '../screens/Main/Technician/Settings/NotificationSettings';

type NotificationSettingProps = {
  setting: NotificationSettingType;
};

export const NotificationSetting: FC<NotificationSettingProps> = memo(
  ({setting}) => {
    const dispatch = useAppDispatch();
    const {userNotificationSettings} = useAppSelector(state => state.user.user);
    const [isChecked, setIsChecked] = useState(
      userNotificationSettings && userNotificationSettings[setting.id],
    );

    const toggleSwitch = async () => {
      setIsChecked(!isChecked);
      dispatch(
        updateSettingNotificationTC({
          ...userNotificationSettings,
          [setting.id]: !userNotificationSettings[setting.id],
        }),
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.description}>{setting.description}</Text>
        </View>

        <Switch
          trackColor={{false: '#6C757D', true: '#1B6BC0'}}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#3e3e3e"
          onChange={toggleSwitch}
          value={isChecked}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    gap: 10,
  },

  header: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 10,
  },

  description: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondColor,
  },
});
