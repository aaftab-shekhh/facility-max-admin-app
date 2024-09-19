import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useAppNavigation, useAppSelector} from '../../../../hooks/hooks';
import {UserRoleType, UserType} from '../../../../types/StateType';
import {FocusAwareStatusBar} from '../../../../components/FocusAwareStatusBar';
import {colors} from '../../../../styles/colors';
import {userAPI} from '../../../../api/userApi';
import {UserRole} from '../../../../enums/user';
import {useDebounce} from '../../../../hooks/useDebounce';
import {handleServerNetworkError} from '../../../../utils/handleServerNetworkUtils';
import {SearchIcon} from '../../../../assets/icons/SearchIcon';
import {stylesModal} from '../../../../styles/styles';

type ContactProps = {contact: UserType};

const Contact: FC<ContactProps> = ({contact}) => {
  const navigation = useAppNavigation();

  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        navigation.navigate('Main', {
          screen: UserRole.TECHNICIAN,
          params: {
            screen: 'MenuTab',
            params: {
              screen: 'ContactsScreen',
              params: {
                screen: 'ContactInfo',
                params: {userId: contact.id},
              },
            },
          },
        });
      }}>
      <FastImage
        style={styles.img}
        source={
          contact.avatar?.url
            ? {
                uri: contact.avatar?.url,
              }
            : require('../../../../assets/img/def_ava.png')
        }
        // resizeMode={FastImage.resizeMode.contain}
        defaultSource={require('../../../../assets/img/def_ava.png')}
      />
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <Text style={styles.name}>
          {contact.firstName} {contact.lastName}
        </Text>
        <View style={{gap: 5}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={styles.phone}>{contact.type}</Text>
            <Text style={styles.phone}>{contact.phone}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.phone}>{contact.building?.name}</Text>
            <Text style={styles.phone}>{contact.email}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

type MeContactsProps = {
  mode: UserRoleType;
};

const size = 30;

export const MyContacts: FC<MeContactsProps> = ({mode}) => {
  const [contacts, setContacts] = useState<UserType[]>([]);
  const {customerId} = useAppSelector(state => state.user.user);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const [searchString, setSearchString] = useState('');
  const debouncedKeyWord = useDebounce(searchString, 400);

  const getUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await userAPI.getUsers({
        userRole: mode,
        sortField: 'id',
        sortDirection: 'ASC',
        page: 1,
        size,
        customerId,
        keySearchValue: debouncedKeyWord,
      });
      setContacts(res.data.rows);
    } catch (err) {
      handleServerNetworkError(err.response);
    } finally {
      setIsLoading(false);
    }
  }, [mode, debouncedKeyWord, customerId, isLoading, contacts]);

  const loadUsers = useCallback(async () => {
    if (isLoad) {
      return;
    }
    setIsLoad(true);

    try {
      const res = await userAPI.getUsers({
        userRole: mode,
        sortField: 'id',
        sortDirection: 'ASC',
        page: contacts.length / size + 1,
        size,
        customerId,
        keySearchValue: debouncedKeyWord,
      });
      setContacts(prev => [...prev, ...res.data.rows]);
    } catch (err) {
      handleServerNetworkError(err.response);
    } finally {
      setIsLoad(false);
    }
  }, [mode, debouncedKeyWord, customerId, contacts]);

  useEffect(() => {
    (async () => {
      await getUsers();
    })();
  }, [mode, debouncedKeyWord]);

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />
      <View style={{paddingHorizontal: 10}}>
        <View style={[stylesModal.inputItem, {flex: undefined, marginTop: 10}]}>
          <SearchIcon />
          <TextInput
            placeholder={`Search for ${mode}`}
            placeholderTextColor={colors.textSecondColor}
            style={stylesModal.input}
            onChangeText={val => {
              setSearchString(val);
            }}
          />
        </View>
      </View>
      <FlatList
        data={contacts}
        contentContainerStyle={{flexGrow: 1, gap: 10, paddingVertical: 10}}
        renderItem={({item}) => <Contact contact={item} />}
        keyExtractor={item => item.id}
        onEndReached={loadUsers}
        onEndReachedThreshold={0}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getUsers}
            colors={[colors.mainActiveColor]} // for android
            tintColor={colors.mainActiveColor} // for ios
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginHorizontal: 15,
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.backgroundLightColor,
    padding: 8,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignSelf: 'center',
    backgroundColor: '#FFF',
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000000',
  },
  phone: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#848A9B',
  },
});
