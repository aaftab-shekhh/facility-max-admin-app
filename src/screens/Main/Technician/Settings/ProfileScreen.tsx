import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useAppNavigation, useAppSelector} from '../../../../hooks/hooks';
import FastImage from 'react-native-fast-image';
import {colors} from '../../../../styles/colors';
import {useState} from 'react';
import {EditIcon} from '../../../../assets/icons/EditIcon';
import {CastleIcon} from '../../../../assets/icons/CastleIcon';
import {SettingIcon} from '../../../../assets/icons/SettingIcon';
import {InfoItem} from '../../../../components/InfoItem';
import {UserRole} from '../../../../enums/user';

export const ProfileScreen = () => {
  const navigation = useAppNavigation();

  const {firstName, lastName, avatar, role, email, phone} = useAppSelector(
    state => state.user.user,
  );

  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.info, {alignItems: 'center'}]}>
        <View>
          <FastImage
            style={styles.photo}
            source={
              avatar?.url
                ? {
                    uri: avatar?.url,
                  }
                : require('../../../../assets/img/def_ava.png')
            }
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            defaultSource={require('../../../../assets/img/def_ava.png')}
          />
          {isLoading && (
            <View style={[styles.loadingSave, styles.loading]}>
              <ActivityIndicator color={colors.mainActiveColor} />
            </View>
          )}
        </View>

        <Text style={styles.name}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.role}>{role}</Text>
      </View>
      <ScrollView style={[styles.info, {paddingVertical: 5}]}>
        <InfoItem title="Email address:" text={email} column />
        <InfoItem title="Mobile Phone:" text={phone} />
        <InfoItem title="2FA method:" text={'via email'} hiddeBorder />
      </ScrollView>
      <ScrollView contentContainerStyle={{paddingTop: 10}}>
        <Pressable
          style={styles.setting}
          onPress={() => {
            navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: 'MenuTab',
                params: {
                  screen: 'Settings',
                  params: {screen: 'PrivacySetting'},
                },
              },
            });
          }}>
          <EditIcon />
          <Text style={styles.settingText}>Edit Account Info</Text>
        </Pressable>
        <Pressable
          style={styles.setting}
          onPress={() => {
            navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: 'MenuTab',
                params: {
                  screen: 'Settings',
                  params: {screen: 'UpdatePassword'},
                },
              },
            });
          }}>
          <CastleIcon />
          <Text style={styles.settingText}>Change Password</Text>
        </Pressable>
        <Pressable
          style={styles.setting}
          onPress={() => {
            navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: 'MenuTab',
                params: {
                  screen: 'Settings',
                  params: {screen: 'NotificationSettings'},
                },
              },
            });
          }}>
          <SettingIcon />
          <Text style={styles.settingText}>Notification Settings</Text>
        </Pressable>
      </ScrollView>
      {/*<Pressable onPress={logOut} style={styles.quit}>*/}
      {/*  <QuitIcon />*/}
      {/*  <Text style={styles.quitText}>Sign Out</Text>*/}
      {/*</Pressable>*/}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // height: '100%',
    marginHorizontal: 15,
  },

  info: {
    paddingHorizontal: 15,
    marginTop: 10,
    backgroundColor: colors.backgroundLightColor,
    paddingVertical: 20,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  photo: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    position: 'relative',
  },

  name: {
    paddingVertical: 10,
    color: colors.textColor,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27,
    textAlign: 'center',
  },

  role: {
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 21,
    textAlign: 'center',
  },

  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 5,
    paddingVertical: 5,
    paddingLeft: 5,
    // height: 38,
  },

  settingText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textColor,
  },

  loadingSave: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: colors.mainActiveColor,
    borderRadius: 8,
  },

  loading: {
    backgroundColor: colors.loadBackground,
    borderRadius: 50,
    height: 100,
    width: 100,
  },
});
