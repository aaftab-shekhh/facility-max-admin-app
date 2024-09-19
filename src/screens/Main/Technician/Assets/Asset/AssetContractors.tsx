import {FC, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ContractorType, UserType} from '../../../../../types/StateType';
import {colors} from '../../../../../styles/colors';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {NotFound} from '../../../../../components/NotFound';
import {subcontractorsAPI} from '../../../../../api/subcontractorsApi';
import {InfoItem} from '../../../../../components/InfoItem';
import {arrayToString} from '../../../../../utils/arrayToString';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';

type AssetContractorsProps = {
  assetId: string;
};

type ContractorCardProps = {
  contractor: ContractorType;
};

type ContactType = {
  contact: UserType;
};

const Contact: FC<ContactType> = ({contact}) => {
  return (
    <View style={requesterStyles.container}>
      <Text style={requesterStyles.header}>Requestor {contact.type}</Text>
      <View style={tenantStyles.row}>
        <Text style={tenantStyles.title}>User name</Text>
        <Text style={tenantStyles.text}>{contact.firstName}</Text>
      </View>
      <View style={tenantStyles.row}>
        <Text style={tenantStyles.title}>Title</Text>
        <Text style={tenantStyles.text}>{contact.title}</Text>
      </View>
      <View style={tenantStyles.row}>
        <Text style={tenantStyles.title}>Email</Text>
        <Text style={tenantStyles.text}>{contact.email}</Text>
      </View>
      <View style={tenantStyles.row}>
        <Text style={tenantStyles.title}>Phone</Text>
        <Text style={tenantStyles.text}>{contact.phone}</Text>
      </View>
    </View>
  );
};

const ContractorCard: FC<ContractorCardProps> = ({contractor}) => {
  const {subcontractor} = contractor;
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenContacts, setIsOpenContacts] = useState(false);

  return (
    <View style={tenantStyles.container}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={[tenantStyles.header, tenantStyles.headerOpen]}>
        <Text style={tenantStyles.headerText}>{subcontractor.name}</Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </TouchableOpacity>
      <View style={tenantStyles.subContainer}>
        <InfoItem
          title="Responsibilities"
          text={subcontractor.responsibilities || '-'}
        />
        <InfoItem
          title="Address"
          text={subcontractor.address || '-'}
          hiddeBorder={!isOpen}
        />
        {isOpen && (
          <>
            <InfoItem
              title="Availability"
              text={subcontractor.availability || '-'}
            />
            <InfoItem
              title="After Hours/Emergency phone"
              text={subcontractor.afterHoursPhone || '-'}
            />
            <InfoItem
              title="location"
              text={
                arrayToString([
                  subcontractor.city,
                  subcontractor.state,
                  subcontractor.zipCode,
                ]) || '-'
              }
            />
            <InfoItem
              title="Hours of Operation"
              text={subcontractor.hoursOfOperation || '-'}
            />
            <InfoItem title="Email" text={subcontractor.email || '-'} />
            <InfoItem
              title="Phone"
              text={subcontractor.phone || '-'}
              hiddeBorder
            />
            {subcontractor.contacts && (
              <TouchableOpacity
                style={tenantStyles.row}
                onPress={() => setIsOpenContacts(!isOpenContacts)}>
                <Text>Contacts({subcontractor.contacts?.length})</Text>
                {isOpenContacts ? (
                  <ArrowUpIcon color={colors.textSecondColor} />
                ) : (
                  <ArrowDownIcon color={colors.textSecondColor} />
                )}
              </TouchableOpacity>
            )}
            {isOpenContacts ? (
              <>
                {subcontractor.contacts?.map(contact => (
                  <Contact key={contact.id} contact={contact} />
                ))}
              </>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

export const AssetContractors: FC<AssetContractorsProps> = ({assetId}) => {
  const {isConnected} = useNetInfo();
  const {getLocalSubcontractorsByAssetId} = useLocalStateSelector();
  const [contractors, setContractors] = useState<ContractorType[]>([]);

  useEffect(() => {
    isConnected
      ? (async () => {
          const res = await subcontractorsAPI.getSubcontractorsByAssetId({
            assetId,
            page: 1,
            size: 100,
          });
          setContractors(res.data.rows);
        })()
      : (() => {
          setContractors(getLocalSubcontractorsByAssetId(assetId));
        })();
  }, [assetId, isConnected]);

  return (
    <FlatList
      data={contractors}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        return <ContractorCard contractor={item} />;
      }}
      contentContainerStyle={styles.flatList}
      ListEmptyComponent={() => {
        return (
          <NotFound title="There are currently no preferred contractors." />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 1,
    paddingTop: 10,
    gap: 10,
    marginHorizontal: 15,
  },
});

const requesterStyles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.disabledInputBackground,
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 8,
    gap: 4,
  },
  header: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textColor,
  },
});
const tenantStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 2.62,
    elevation: 4,
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
  subContainer: {
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
