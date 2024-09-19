import {FC, useEffect, useState} from 'react';
import {useAppSelector} from '../../../../../hooks/hooks';
import {InfoItem} from '../../../../../components/InfoItem';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {colors} from '../../../../../styles/colors';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../bll/icons';
import {NotFound} from '../../../../../components/NotFound';
import {subcontractorsAPI} from '../../../../../api/subcontractorsApi';

type EmergencyPlanContactsProps = {
  planId: string;
};

type SubcontractorProps = {
  subcontractor: any;
};

type ContactType = {
  contact: {
    id: string;
    phone: string;
    firstName: string;
    lastName: string;
    title: string;
    type: string;
    email: string;
    subcontractorId: string;
    customerId: string;
    buildingId: string;
    roomId: string;
    creationDate: string;
    lastUpdateDate: string;
  };
};

export const Contact: FC<ContactType> = ({contact}) => {
  return (
    <View style={styles.contactContainer}>
      <Text style={[styles.contactText, {fontWeight: '500'}]}>
        {contact.firstName} {contact.lastName}
      </Text>
      <View style={{flexDirection: 'row', gap: 10}}>
        {contact.phone && (
          <Text style={styles.contactText}>{contact.phone}</Text>
        )}
        {contact.email && (
          <Text style={styles.contactText}>{contact.email}</Text>
        )}
      </View>
    </View>
  );
};

const Subcontractor: FC<SubcontractorProps> = ({subcontractor}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      (async () => {
        const res = await subcontractorsAPI.getSubcontractorById({
          subcontractorId: subcontractor.id,
        });
        setData(res.data);
      })();
    }
  }, [isOpen]);

  return (
    <>
      <View style={[styles.section]}>
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={[styles.header, isOpen && styles.headerOpen]}>
          <Text style={styles.headerText}>{subcontractor.name}</Text>
          {isOpen ? (
            <ArrowUpIcon color={colors.textSecondColor} />
          ) : (
            <ArrowDownIcon color={colors.textSecondColor} />
          )}
        </Pressable>
        {isOpen && (
          <View style={styles.items}>
            {data.address && (
              <InfoItem
                title="Address:"
                text={data.address}
                hiddeBorder={!data.phone && !data.availability}
              />
            )}
            {data.phone && (
              <InfoItem
                title="Emergency Phone:"
                text={data.phone}
                hiddeBorder={!data.availability}
              />
            )}
            {data.availability && (
              <InfoItem title="Availability:" text={data.availability} />
            )}
            {data.responsibilities && data.responsibilities.length > 0 && (
              <InfoItem
                title="Responsibilities:"
                customRightItem={
                  <View style={styles.responsibilities}>
                    {data.responsibilities.map(el => (
                      <View key={el.id} style={styles.responsibilitie}>
                        <FastImage
                          source={
                            el.link ? {uri: el.link} : dropdownIcons[el.name]
                          }
                          style={styles.icon}
                          defaultSource={dropdownIcons[el.name]}
                        />
                        <Text style={styles.itemText}>{el.name}</Text>
                      </View>
                    ))}
                  </View>
                }
                hiddeBorder={data.contacts && data.contacts.length === 0}
              />
            )}
            {data.contacts && data.contacts.length > 0 && (
              <>
                <Text style={styles.itemTitle}>Contacts:</Text>
                <View>
                  {data.contacts.map(contact => (
                    <Contact key={contact.id} contact={contact} />
                  ))}
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </>
  );
};

export const EmergencyPlanContacts: FC<EmergencyPlanContactsProps> = () => {
  const {subcontractors} = useAppSelector(
    state => state.emergency.emergencyPlan,
  );

  return (
    <FlatList
      style={{flex: 1}}
      contentContainerStyle={styles.container}
      keyExtractor={item => item.id}
      data={subcontractors}
      renderItem={({item}) => (
        <Subcontractor subcontractor={item.subcontractor} />
      )}
      ListEmptyComponent={() => {
        return <NotFound title="Emergency Contacts Not Found" />;
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },
  items: {
    padding: 10,
    gap: 10,
  },
  itemTitle: {
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  itemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  responsibilities: {
    flex: 1,
    gap: 10,
  },
  responsibilitie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  contactContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: colors.secondInputBackground,
    borderRadius: 8,
    gap: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  contactText: {
    width: '45%',
    color: colors.textColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 21,
  },
});
