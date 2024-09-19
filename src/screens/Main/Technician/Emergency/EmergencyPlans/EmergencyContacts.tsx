import {FC, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {getEmergencyContactesTC} from '../../../../../bll/reducers/emergency-Reducer';
import {InfoItem} from '../../../../../components/InfoItem';
import {CamponyIcon} from '../../../../../assets/icons/CompanyIcon';
import {colors} from '../../../../../styles/colors';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {FilterIcon} from '../../../../../assets/icons/FilterIcon';
import {SearchIcon} from '../../../../../assets/icons/SearchIcon';
import {stylesModal} from '../../../../../styles/styles';
import {DropdownWithSearch} from '../../../../../components/DropdownWithSearch';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import {useDebounce} from '../../../../../hooks/useDebounce';
import {regionAPI} from '../../../../../api/regionApi';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../bll/icons';
import {NotFound} from '../../../../../components/NotFound';
import {EmergencyContactType} from '../../../../../types/EmergencyTypes';

type EmergencyContactProps = {
  contact: EmergencyContactType;
};

export const EmergencyContact: FC<EmergencyContactProps> = ({contact}) => {
  const [isOpen, setIsopen] = useState(false);
  const togleOpen = () => {
    setIsopen(!isOpen);
  };

  return (
    <View style={emergencyContactStyles.card}>
      <Pressable
        style={emergencyContactStyles.headerContainer}
        onPress={togleOpen}>
        <View style={emergencyContactStyles.company}>
          <CamponyIcon />
          <Text style={emergencyContactStyles.companyName}>{contact.name}</Text>
        </View>
        <View style={emergencyContactStyles.company}>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </View>
      </Pressable>
      {isOpen && <InfoItem title="Address:" text={contact.address} />}
      {/* <View style={emergencyContactStyles.row}> */}
      <InfoItem title="Emergency Phone:" text={contact.phone} />
      <InfoItem
        title="Availability:"
        text={`${contact.hoursOfOperation} h`}
        hiddeBorder={!isOpen}
      />
      {/* </View> */}
      {isOpen && contact.responsibilities.length > 0 && (
        <>
          <Text style={emergencyContactStyles.title}>Responsibilities:</Text>
          {contact.responsibilities && contact.responsibilities.length > 0 && (
            <View style={emergencyContactStyles.responsibilities}>
              {contact.responsibilities.map(el => (
                <View style={emergencyContactStyles.responsibilitie}>
                  <FastImage
                    key={el.id}
                    source={el.link ? {uri: el.link} : dropdownIcons[el.name]}
                    style={emergencyContactStyles.icon}
                    defaultSource={dropdownIcons[el.name]}
                    resizeMode="cover"
                  />
                  <Text style={emergencyContactStyles.responsibilitieText}>
                    {el.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

export const EmergencyContacts = () => {
  const dispatch = useAppDispatch();
  const {customerId} = useAppSelector(state => state.user.user);

  const [buildings, setBuildings] = useState([]);

  const {emergencyContactes} = useAppSelector(state => state.emergency);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [regions, setRegions] = useState([]);

  const [searchString, setSearchString] = useState<string | undefined>();
  const [regionId, setRegionId] = useState<undefined | string>(undefined);
  const [buildingId, setBuildingId] = useState<undefined | string>(undefined);

  const debouncedKeyWord = useDebounce(searchString, 400);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const apply = () => {
    dispatch(getEmergencyContactesTC({searchString, regionId, buildingId}));
    toggleModal();
  };

  const reset = () => {
    setSearchString(undefined);
    setRegionId(undefined);
    setBuildingId(undefined);
    dispatch(getEmergencyContactesTC({}));
    toggleModal();
  };

  useEffect(() => {
    const paraams: any = {
      regionId,
      buildingId,
    };
    if (debouncedKeyWord !== '') {
      paraams.searchString = debouncedKeyWord;
    }
    dispatch(
      getEmergencyContactesTC({
        ...paraams,
        page: 1,
        size: 100,
        customerId,
        sortField: 'name',
        sortDirection: 'ASC',
        isEmergency: true,
      }),
    );
  }, [debouncedKeyWord, regionId, buildingId]);

  useEffect(() => {
    dispatch(
      getEmergencyContactesTC({
        page: 1,
        size: 100,
        customerId,
        sortField: 'name',
        sortDirection: 'ASC',
        isEmergency: true,
      }),
    );
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      (async () => {
        try {
          const res = await buildingsAPI.getBuildingsList({
            regionId,
            buildingId,
            page: 1,
            size: 100,
            sortField: 'name',
            sortDirection: 'ASC',
          });
          setBuildings(
            res.data.rows.map(el => ({
              ...el,
              file: el.avatar,
            })),
          );
        } catch (err) {}
      })();
      (async () => {
        const res = await regionAPI.getRegionsByCustomerId({
          customerId,
          page: 1,
          size: 100,
          sortField: 'name',
          sortDirection: 'ASC',
        });
        setRegions(res.data.rows);
      })();
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (isModalVisible) {
      (async () => {
        try {
          const res = await buildingsAPI.getBuildingsList({
            regionId,
            buildingId,
            page: 1,
            size: 100,
            sortField: 'name',
            sortDirection: 'ASC',
          });
          setBuildings(
            res.data.rows.map(el => ({
              ...el,
              file: el.avatar,
            })),
          );
        } catch (err) {}
      })();
    }
  }, [regionId]);

  return (
    <>
      <View style={styles.search}>
        <View style={styles.inputItem}>
          <SearchIcon />
          <TextInput
            placeholder="Enter name"
            placeholderTextColor={colors.textSecondColor}
            onChangeText={setSearchString}
            style={styles.input}
          />
        </View>
        <Pressable style={styles.filter} onPress={toggleModal}>
          <FilterIcon />
        </Pressable>
      </View>
      <FlatList
        data={emergencyContactes}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return <EmergencyContact contact={item} />;
        }}
        contentContainerStyle={styles.flatList}
        ListEmptyComponent={() => {
          return <NotFound title="There are currently no emergency contacts" />;
        }}
      />
      <ModalLayout
        title="Filter"
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <View>
          <ScrollView contentContainerStyle={{gap: 10}}>
            <DropdownWithSearch
              label="Region"
              startValue={regionId}
              data={regions}
              onChange={item => setRegionId(item.id)}
            />
            <DropdownWithSearch
              label="Building"
              startValue={buildingId}
              data={buildings}
              onChange={item => setBuildingId(item.id)}
              isIcon
              dropdownIcons={{
                defaultSource: require('../../../../../assets/img/Building.png'),
              }}
            />
          </ScrollView>
          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <Pressable
              onPress={reset}
              style={[stylesModal.modalButton, stylesModal.modalButtonReset]}>
              <Text
                style={[
                  stylesModal.modalButtonText,
                  stylesModal.modalButtonTextReset,
                ]}>
                Reset All
              </Text>
            </Pressable>
            <Pressable onPress={apply} style={stylesModal.modalButton}>
              <Text style={stylesModal.modalButtonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </ModalLayout>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  search: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 15,
    marginTop: 10,
  },

  modalButtons: {
    position: 'relative',
    marginTop: 20,
  },

  inputItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.backgroundLightColor,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: colors.textColor,
  },

  filter: {
    width: 42,
    height: 42,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const emergencyContactStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundLightColor,
    marginHorizontal: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  company: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  companyName: {
    color: colors.textColor,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 21,
  },
  contact: {
    // paddingHorizontal: 10,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#848A9B',
  },
  text: {
    flex: 0.5,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: '#202534',
  },
  responsibilities: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  responsibilitie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  responsibilitieText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textColor,
  },
  icon: {
    width: 25,
    height: 25,
  },
});
