import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {MessageIcon} from '../../../../assets/icons/MessageIcon';
import {EmailIcon} from '../../../../assets/icons/EmailIcon';
import {CallIcon} from '../../../../assets/icons/CallIcon';
import {InfoItem} from '../../../../components/InfoItem';
import {colors} from '../../../../styles/colors';
import {useEffect, useState} from 'react';
import {contactsAPI} from '../../../../api/contactsApi';
import {userAPI} from '../../../../api/userApi';
import {UserType} from '../../../../types/StateType';
import {ContactInfoProps} from '../../../../types/NavTypes/TechnicianNavTypes';

export const ContactInfo = ({route}: ContactInfoProps) => {
  const {userId} = route.params;
  const [contact, setContact] = useState<UserType | null>(null);
  const [buckets, setBuckets] = useState([]);

  useEffect(() => {
    (async () => {
      const resUser = await userAPI.getUserById({id: userId});
      setContact(resUser.data);

      const res = await contactsAPI.getBucketsContact({
        userId,
        page: 1,
        size: 10,
      });
      setBuckets(res.data.rows);
    })();
  }, []);

  if (contact) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.info, {paddingVertical: 21}]}>
          <FastImage
            style={styles.photo}
            source={
              contact.avatar?.url
                ? {
                    uri: contact.avatar?.url,
                  }
                : require('../../../../assets/img/def_ava.png')
            }
            defaultSource={require('../../../../assets/img/def_ava.png')}
          />

          <Text style={styles.name}>
            {contact.firstName} {contact.lastName}
          </Text>
          <Text style={styles.role}>{contact.role}</Text>
        </View>

        <View style={styles.icons}>
          <Pressable
            style={styles.icon}
            onPress={async () => {
              await Linking.openURL(`sms://${contact.phone}`);
            }}>
            <MessageIcon fill={colors.mainActiveColor} />
            <Text style={styles.iconText}>Messages</Text>
          </Pressable>
          <Pressable
            style={styles.icon}
            onPress={async () => {
              await Linking.openURL(`mailto://${contact.email}`);
            }}>
            <EmailIcon fill={colors.mainActiveColor} />
            <Text style={styles.iconText}>Email</Text>
          </Pressable>
          <Pressable
            style={styles.icon}
            onPress={async () => {
              await Linking.openURL(`tel://${contact.phone}`);
            }}>
            <CallIcon fill={colors.mainActiveColor} />
            <Text style={styles.iconText}>Call</Text>
          </Pressable>
        </View>

        <View style={styles.info}>
          <View style={{width: '100%'}}>
            <InfoItem title="Mobile Phone:" text={contact.phone} />
            <InfoItem
              title="Email Address:"
              text={contact.email}
              hiddeBorder={!contact.companyName && !contact.title}
            />
            {contact.companyName && (
              <InfoItem
                title="Company Name:"
                text={contact.companyName}
                hiddeBorder={!contact.title}
              />
            )}
            {contact.title && (
              <InfoItem title="Title:" text={contact.title} hiddeBorder />
            )}
          </View>
        </View>
        {buckets && buckets.length > 0 && (
          <View style={{gap: 10}}>
            <Text style={[styles.role, {textAlign: 'left'}]}>
              Work Order Team(s)
            </Text>
            {buckets.map(el => (
              <View key={el.id} style={[styles.info, styles.team]}>
                <FastImage
                  style={styles.avatar}
                  source={
                    el.avatar?.url
                      ? {
                          uri: el.avatar?.url,
                        }
                      : require('../../../../assets/img/def_ava.png')
                  }
                  defaultSource={require('../../../../assets/img/def_ava.png')}
                />
                <View style={{gap: 3}}>
                  <Text style={[styles.role, {textAlign: 'left'}]}>
                    {el.name || 'Team name'}
                  </Text>
                  <Text style={{color: colors.textSecondColor}}>
                    Availability:{' '}
                    <Text style={styles.role}>{el.availability}</Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  }
};

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 20,
  },
  info: {
    alignItems: 'center',
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    backgroundColor: colors.bottomActiveTextColor,
  },
  name: {
    paddingVertical: 10,
    color: '#000',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 36,
    textAlign: 'center',
  },
  role: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    textAlign: 'center',
  },
  editName: {
    borderColor: colors.textColor,
    color: colors.textColor,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 3 : 10,
    paddingBottom: Platform.OS === 'ios' ? 15 : 8,
    justifyContent: 'center',
  },
  text: {
    backgroundColor: '#4543a100',
    paddingHorizontal: 0,
    paddingVertical: 10,
    color: colors.textColor,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  icon: {
    alignItems: 'center',
    width: '30%',
    gap: 4,
    backgroundColor: colors.calendarBsckGround,
    paddingVertical: 8,
    borderRadius: 8,
  },
  iconText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
  },
  save: {
    position: 'absolute',
    right: 15,
    width: 64,
    height: 29,
  },
  edit: {
    position: 'absolute',
    right: 15,
    width: 64,
    height: 29,
    backgroundColor: '#4543a100',
    borderColor: colors.mainActiveColor,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  editText: {
    color: colors.mainActiveColor,
  },
  team: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
});
