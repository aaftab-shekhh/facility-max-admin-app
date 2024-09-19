import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {stylesModal} from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';
import {FC, useEffect, useState} from 'react';
import {SearchIcon} from '../../../../../assets/icons/SearchIcon';
import {FilterIcon} from '../../../../../assets/icons/FilterIcon';
import {DropdownWithSearch} from '../../../../../components/DropdownWithSearch';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import {ScrollView} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {getEmergencyContactesTC} from '../../../../../bll/reducers/emergency-Reducer';
import {InfoItem} from '../../../../../components/InfoItem';
import {
  attachContactTC,
  detachContactTC,
} from '../../../../../bll/reducers/createNewEmergencyPlan';
import {regionAPI} from '../../../../../api/regionApi';
import {getBuildingsListTC} from '../../../../../bll/reducers/buildings-reducer';
import {useDebounce} from '../../../../../hooks/useDebounce';
import {ActionsButtons} from './ActionsButtons';
import {subcontractorsAPI} from '../../../../../api/subcontractorsApi';
import {useOrientation} from '../../../../../hooks/useOrientation';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../bll/icons';
import {Contact} from '../EmergencyPlan/EmergencyPlanContacts';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';

type ContactProps = {
  contact: any;
  selected: boolean;
  emergencyPlanId: string;
};

const ContactSubcontractor: FC<ContactProps> = ({
  contact,
  selected,
  emergencyPlanId,
}) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const {numColumn, onLayout} = useOrientation();

  const togleOpen = () => {
    setIsOpen(!isOpen);
  };

  const attachOrDetach = async () => {
    if (!selected) {
      dispatch(
        attachContactTC({
          emergencyPlanId,
          subcontractorId: contact.id,
        }),
      );
    } else {
      dispatch(
        detachContactTC({
          emergencyPlanId,
          subcontractorId: contact.id,
        }),
      );
    }
  };

  return (
    <Pressable
      style={[
        emergencyContactStyles.backing,
        selected && emergencyContactStyles.selectedBacking,
      ]}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}
      onPress={attachOrDetach}>
      <View style={emergencyContactStyles.section}>
        <Pressable
          hitSlop={25}
          style={emergencyContactStyles.arrow}
          onPress={togleOpen}>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Pressable>
        <View style={emergencyContactStyles.column}>
          {contact.availability && (
            <InfoItem title="Name:" text={contact.name} />
          )}
          {contact.phone && <InfoItem title="Phone:" text={contact.phone} />}
        </View>
        <View style={emergencyContactStyles.column}>
          {contact.responsibilities && contact.responsibilities.length > 0 && (
            <InfoItem
              title="Responsibilities:"
              customRightItem={
                <View style={emergencyContactStyles.responsibilities}>
                  {contact.responsibilities.map(el => (
                    <View
                      key={el.id}
                      style={[emergencyContactStyles.responsibilitie]}>
                      <FastImage
                        source={
                          el.file?.url
                            ? {uri: el.file?.url}
                            : dropdownIcons[el.name]
                        }
                        style={[
                          emergencyContactStyles.icon,
                          {backgroundColor: el.color},
                        ]}
                        defaultSource={dropdownIcons[el.name]}
                      />
                      {/* <Text style={styles.itemText}>{el.name}</Text> */}
                    </View>
                  ))}
                </View>
              }
            />
          )}
          {contact.address && (
            <InfoItem
              title="Address:"
              text={contact.address}
              hiddeBorder={
                (!contact.afterHoursPhone && !contact.availability) || !isOpen
              }
            />
          )}
        </View>
        {isOpen && (
          <>
            <View style={emergencyContactStyles.column}>
              {contact.availability && (
                <InfoItem
                  title="Availability:"
                  text={contact.availability}
                  hiddeBorder={
                    !contact.contacts || contact.contacts.length === 0
                  }
                />
              )}
              {contact.afterHoursPhone && (
                <InfoItem
                  title="After Hours/Emergency phone:"
                  text={contact.afterHoursPhone}
                  hiddeBorder={
                    !contact.contacts || contact.contacts.length === 0
                  }
                />
              )}
            </View>
            {contact.contacts && contact.contacts.length > 0 && (
              <>
                <Text style={emergencyContactStyles.itemTitle}>
                  Contacts({contact.contacts.length})
                </Text>
                <View style={emergencyContactStyles.rowCards}>
                  {contact.contacts.map(c => (
                    <Contact key={c.id} contact={c} />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
};

const emergencyContactStyles = StyleSheet.create({
  backing: {
    backgroundColor: colors.textSecondColor,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  selectedBacking: {
    backgroundColor: colors.mainActiveColor,
  },
  arrow: {
    top: 10,
    right: 15,
    zIndex: 100,
    position: 'absolute',
  },

  container: {
    flex: 1,
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius: 8,
  },
  section: {
    marginLeft: 6,
    marginVertical: 2,
    marginRight: 2,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom: 0,
  },

  responsibilities: {
    gap: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  responsibilitie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemTitle: {
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  modalText: {
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 20,
  },
  modalButtons: {
    position: 'relative',
  },
  modalTextType: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  column: {
    paddingBottom: 10,
    gap: 10,
  },
  row: {
    gap: 25,
    flexDirection: 'row',
  },
  rowCards: {
    gap: 10,
    flexDirection: 'row',
    paddingBottom: 10,
  },
});

export const CreateEmergencyStep5 = ({navigation}: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {buildings} = useAppSelector(state => state.buildings);

  const {newEmergencyPlan} = useAppSelector(
    state => state.createNewEmergencyPlan,
  );
  const {id, currentLevel, subcontractors} = newEmergencyPlan;

  const [regions, setRegions] = useState([]);

  const [searchString, setSearchString] = useState<string | undefined>();
  const [regionId, setRegionId] = useState<undefined | string>(undefined);
  const [buildingId, setBuildingId] = useState<undefined | string>(undefined);

  const debouncedKeyWord = useDebounce(searchString, 400);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const dispatch = useAppDispatch();
  const {customerId} = useAppSelector(state => state.user.user);

  const [emergencyContactes, setEmergencyContactes] = useState([]);

  useEffect(() => {
    if (!currentLevel) {
      navigation.navigate('CreateEmergencyStep1');
    }
    if (currentLevel === 3) {
      navigation.navigate('CreateEmergencyStep4');
    }
    if (currentLevel === 5) {
      navigation.navigate('CreateEmergencyStep6');
    }
  }, [currentLevel]);

  const getSubcontractors = async () => {
    const res = await subcontractorsAPI.getSubcontractors({
      regionIds: [regionId],
      page: 1,
      size: 1000,
      // buildingId,
    });
    setEmergencyContactes(res.data.rows);
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
    (async () => {
      await getSubcontractors();
    })();
  }, [debouncedKeyWord]);

  useEffect(() => {
    if (isModalVisible) {
      dispatch(getEmergencyContactesTC({}));
      dispatch(
        getBuildingsListTC({
          customerId,
          page: 1,
          size: 10,
          sortField: 'id',
          sortDirection: 'ASC',
        }),
      );
      (async () => {
        const res = await regionAPI.getRegionsByCustomerId({
          customerId,
          page: 1,
          size: 100,
        });
        setRegions(res.data.rows);
      })();
    }
  }, [isModalVisible]);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Step 5. Add Emergency Contacts</Text>
        <View style={styles.search}>
          <View style={styles.inputItem}>
            <SearchIcon />
            <TextInput
              placeholder="Enter contact"
              style={styles.input}
              placeholderTextColor={colors.textSecondColor}
            />
          </View>
          <Pressable style={styles.filter} onPress={toggleModal}>
            <FilterIcon />
          </Pressable>
        </View>
        <View style={styles.head}>
          <Text style={styles.headTitle}>Emergency contact</Text>
          <Pressable hitSlop={15}>
            <Text style={styles.headButtonText}>+ Add Contact</Text>
          </Pressable>
        </View>
        <FlatList
          data={emergencyContactes}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <ContactSubcontractor
                contact={item}
                selected={
                  subcontractors &&
                  subcontractors.some(c => c.subcontractor.id === item.id)
                }
                emergencyPlanId={id}
              />
            );
          }}
          style={styles.container}
          contentContainerStyle={styles.content}
        />
        <ActionsButtons />
      </View>
      <ModalLayout
        title="Filter"
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <>
          <ScrollView contentContainerStyle={{gap: 10}}>
            <DropdownWithSearch
              label="Region"
              startValue={regionId}
              data={regions}
              onChange={item => setRegionId(item.id)}
              border
            />
            {/* <DropdownWithSearch
              label="Building"
              startValue={buildingId}
              data={buildings}
              onChange={item => setBuildingId(item.id)}
              border
            /> */}
          </ScrollView>
          <View style={[stylesModal.modalButtons, styles.buttonsModal]}>
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
        </>
      </ModalLayout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 10,
    paddingHorizontal: 15,
    paddingBottom: 65,
  },
  title: {
    color: colors.textColor,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    marginVertical: 10,
    paddingHorizontal: 15,
  },

  search: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
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

  body: {
    flex: 1,
  },

  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },

  headTitle: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  buttons: {
    marginHorizontal: 15,
  },

  headButtonText: {
    color: colors.mainActiveColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  previous: {
    backgroundColor: colors.textSecondColor,
    borderColor: colors.textSecondColor,
  },
  buttonsModal: {
    position: 'relative',
    marginTop: 20,
  },
});
