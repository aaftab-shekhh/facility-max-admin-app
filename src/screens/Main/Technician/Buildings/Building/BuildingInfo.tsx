import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FC, useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {InfoItem} from '../../../../../components/InfoItem';
import {stylesModal} from '../../../../../styles/styles';
import {BuildingInfoEdit} from './BuildingInfoEdit';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../hooks/hooks';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {ContactType} from '../../../../../types/StateType';
import {colors} from '../../../../../styles/colors';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';
import {
  getBuildingByIdTC,
  setBuilding,
} from '../../../../../bll/reducers/buildings-reducer';
import {contactsAPI} from '../../../../../api/contactsApi';
import {EditIcon} from '../../../../../assets/icons/EditIcon';
import {useOrientation} from '../../../../../hooks/useOrientation';
import {UserRole} from '../../../../../enums/user';
import {getTab} from '../../../../../utils/getTab';

type BuildingContactType = {
  contact: ContactType;
};

const BuildingContact: FC<BuildingContactType> = ({contact}) => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      style={buildingContact.container}
      disabled={!contact.user}
      onPress={() => {
        navigation.getState().routeNames[0] === 'PDFPlan'
          ? navigation.navigate('Plan', {
              screen: 'ContactInfo',
              params: {userId: contact?.user?.id!},
            })
          : navigation.getState().routeNames[0] === 'Scaner'
          ? navigation.navigate('QR', {
              screen: 'ContactInfo',
              params: {userId: contact?.user?.id!},
            })
          : navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: getTab(navigation.getState().routeNames[0]),
                params: {
                  screen: 'ContactInfo',
                  params: {userId: contact?.user?.id!},
                },
              },
            });
      }}>
      {contact.user && (
        <View style={buildingContact.headerContainer}>
          <Text style={buildingContact.header}>
            {contact.type || contact?.user?.type}
          </Text>
        </View>
      )}
      <View style={buildingContact.row}>
        <Text style={buildingContact.title}>User name</Text>
        <Text style={buildingContact.text}>
          {contact.firstName || contact?.user?.firstName}{' '}
          {contact.lastName || contact?.user?.lastName}
        </Text>
      </View>
      {(contact.title || contact?.user?.title) && (
        <View style={buildingContact.row}>
          <Text style={buildingContact.title}>Title</Text>
          <Text style={buildingContact.text}>
            {contact.title || contact?.user?.title}
          </Text>
        </View>
      )}
      <View style={buildingContact.row}>
        <Text style={buildingContact.title}>Email</Text>
        <Text style={buildingContact.text}>
          {contact.email || contact?.user?.email}
        </Text>
      </View>
      <View style={buildingContact.row}>
        <Text style={buildingContact.title}>Phone</Text>
        <Text style={buildingContact.text}>
          {contact.phone || contact?.user?.phone}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const BuildingInfo = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenContacts, setIsOpenContact] = useState(false);
  const {isConnected} = useNetInfo();
  const dispatch = useAppDispatch();
  const {numColumn, onLayout} = useOrientation();

  const {building} = useAppSelector(state => state.buildings);
  const {getLocalBuilding} = useLocalStateSelector();
  const {building: localBuilding} = useAppSelector(state => state.local.db);

  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const togleIsOpenContact = () => {
    setIsOpenContact(!isOpenContacts);
  };

  const getContacts = async () => {
    setContacts(
      (await contactsAPI.getContacts({link: building.id})).data.payload,
    );
  };

  const refresh = async () => {
    setIsRefresh(true);
    !isConnected && localBuilding && localBuilding[building.id]
      ? dispatch(setBuilding(getLocalBuilding(building.id)))
      : dispatch(getBuildingByIdTC({buildingId: building.id}));
    setIsRefresh(false);
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <View
      style={{flex: 1}}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}>
      {isEdit ? (
        <BuildingInfoEdit
          building={building}
          setIsEdit={() => setIsEdit(!isEdit)}
          numColumn={numColumn}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.container,
            !isConnected && {paddingBottom: 10},
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={refresh}
              colors={[colors.mainActiveColor]} // for android
              tintColor={colors.mainActiveColor} // for ios
            />
          }
          showsVerticalScrollIndicator={false}>
          <View style={numColumn === 1 ? styles.column : styles.row}>
            {/* <View> */}
            <FastImage
              style={styles.photo}
              source={
                isConnected
                  ? {
                      uri: building.avatar?.url,
                    }
                  : require('../../../../../assets/img/Building.png')
              }
              defaultSource={require('../../../../../assets/img/Building.png')}
            />
            {/* </View> */}
            <View style={{flex: 1}}>
              <InfoItem title="Building name" text={building.name} />
              <InfoItem title="Building Type" text={building.type} />
              <InfoItem title="Region" text={building.region?.name || '-'} />
              <InfoItem title="Address" text={building.address} />
              <InfoItem
                title="Number of Floors"
                text={building.floorsNumber || '-'}
              />
            </View>
          </View>
          <View style={numColumn === 1 ? styles.column : styles.row}>
            <InfoItem title="Year Built" text={building.yearBuilt || '-'} />
            <InfoItem title="Total area" text={building.area || '-'} />
          </View>
          <View style={numColumn === 1 ? styles.column : styles.row}>
            <View style={{flex: 1}}>
              <InfoItem
                title="Description"
                text={building.description || '-'}
                column
                hiddeBorder={numColumn !== 1}
              />
            </View>
            <View style={{flex: 1}}>
              <InfoItem
                title="Building access information"
                text={building.buidingAccessInformation || '-'}
                column
                hiddeBorder
              />
            </View>
          </View>

          {contacts && contacts.length > 0 && (
            <View>
              <Pressable style={styles.contacts} onPress={togleIsOpenContact}>
                <Text style={styles.title}>Contact({contacts.length})</Text>
                <View style={styles.buttonShow}>
                  {isOpenContacts ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </View>
              </Pressable>
              {isOpenContacts ? (
                <View style={{gap: 10}}>
                  {contacts.map(contact => (
                    <BuildingContact key={contact.id} contact={contact} />
                  ))}
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>
      )}
      {!isEdit && isConnected && (
        <View style={[stylesModal.modalButtons, styles.modalButtons]}>
          <Pressable
            onPress={() => setIsEdit(!isEdit)}
            style={[stylesModal.modalButton, styles.button]}>
            <EditIcon stroke={colors.bottomActiveTextColor} />
            <Text style={stylesModal.modalButtonText}>Edit</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 5,
    paddingTop: 10,
    paddingBottom: 65,
    backgroundColor: colors.backgroundMainColor,
    marginHorizontal: 15,
  },

  modalButtons: {
    position: 'absolute',
    bottom: 0,
    marginHorizontal: 15,
    marginBottom: 10,
  },

  button: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  photo: {
    flex: 1,
    height: 200,
    width: '100%',
    borderRadius: 10,
  },

  contacts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },

  title: {
    flex: 1,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textColor,
  },

  buttonShow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    gap: 10,
  },
  row: {
    gap: 40,
    flexDirection: 'row',
  },
});

const buildingContact = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  headerContainer: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: colors.mainActiveColor,
    borderRadius: 4,
  },
  header: {
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 14,
    color: colors.mainActiveColor,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondColor,
  },
  text: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textColor,
  },
  buttonShow: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
