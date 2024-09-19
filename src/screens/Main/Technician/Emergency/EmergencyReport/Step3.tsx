import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {stylesModal} from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../hooks/hooks';
import {EmergencyReportStep3Props} from '../../../../../types/NavTypes/TechnicianNavTypes';
import {EmergencyScenario} from '../../../../../bll/state';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import {useEffect, useState} from 'react';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {incOrDecEmergencyReportTC} from '../../../../../bll/reducers/createNewEmergencyReport';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {InfoIcon} from '../../../../../assets/icons/InfoIcon';
import {EmergencyReportGetPlanEnum} from '../../../../../enums/emergency';
import {RelatedPlans} from './RelatedPlans';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {Procedure} from '../EmergencyPlans/ManageProcedures';
import {UserRole} from '../../../../../enums/user';

const RELATED_PLANS = [
  {
    status: EmergencyReportGetPlanEnum.BY_SCENARIO,
    title: 'Related To The Type Of Emergency',
  },
  {
    status: EmergencyReportGetPlanEnum.BY_AFFECTED_AREA,
    title: 'Related To The Affected Area(s)',
  },
  {
    status: EmergencyReportGetPlanEnum.INFRASTRUCTURE_FAILURES,
    title: 'Related To The Affected Equipment',
  },
];

export const Step3 = ({navigation}: EmergencyReportStep3Props) => {
  const nav = useAppNavigation();
  const dispatch = useAppDispatch();
  const {scenario, currentLevel} = useAppSelector(
    state => state.createNewEmergencyResport.newEmergencyReport,
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [procedures, setProcedures] = useState([]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const action = async (type: string) => {
    setIsLoading(true);
    try {
      await dispatch(incOrDecEmergencyReportTC({type}));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const submitIncedent = async () => {
    try {
      await action('increment');
      nav.navigate('Main', {
        screen: UserRole.TECHNICIAN,
        params: {
          screen: 'EmergencyTab',
          params: {
            screen: 'EmergencyTabScreen',
          },
        },
      });
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  };

  // const getReportContacts = async () => {
  //   const res = await emergencyAPI.getReportContacts();
  //   setContacts(res.data.contacts);
  // };

  useEffect(() => {
    (async () => {
      setProcedures((await emergencyAPI.getReportProcedures()).data.payload);
    })();
    if (!currentLevel || currentLevel === 0) {
      navigation.navigate('EmergencyReportStep1');
    }
    if (currentLevel === 1) {
      navigation.navigate('EmergencyReportStep2');
    }
  }, [currentLevel]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.notifContainer}>
          <InfoIcon stroke={colors.deleteColor} />
          <Text style={styles.notifText}>
            A critical work order has been created and all emergency personnel
            have been notified!
          </Text>
        </View>
        <Text style={styles.subTitle}>
          The following Emergency Plans and Procedures have been selected based
          on the reported emergency. Please review these for crucial response
          information
        </Text>
        {RELATED_PLANS.map(el => (
          <RelatedPlans key={el.status} title={el.title} status={el.status} />
        ))}
        {procedures.length > 0 && (
          <View style={styles.section}>
            <Pressable
              onPress={() => setIsOpen(!isOpen)}
              style={[styles.header, isOpen && styles.headerOpen]}>
              <Text style={styles.headerText}>Related Procedures</Text>
              {isOpen ? (
                <ArrowUpIcon color={colors.textSecondColor} />
              ) : (
                <ArrowDownIcon color={colors.textSecondColor} />
              )}
            </Pressable>
            {isOpen && (
              <View style={styles.sectionContainer}>
                {procedures.map(el => (
                  <Procedure key={el.id} procedure={el} />
                ))}
              </View>
            )}
          </View>
        )}
        {/* <Text style={styles.procedures}>Companies</Text>

        {contacts.length > 0 ? (
          contacts.map(item => (
            <EmergencyContact key={item.id} contact={item} />
          ))
        ) : (
          <NotFound title="Companies not found" />
        )}
        <Text style={styles.procedures}>Procedures</Text>
        {procedures.length > 0 ? (
          procedures.map(item => (
            <EmergencyContact key={item.id} contact={item} />
          ))
        ) : (
          <NotFound title="Procedures not found" />
        )} */}
      </ScrollView>
      <View style={stylesModal.modalButtons}>
        <Pressable
          onPress={() => action('decrement')}
          disabled={isLoading}
          style={[stylesModal.modalButton, styles.previous]}>
          {isLoading ? (
            <ActivityIndicator color={colors.bottomActiveTextColor} />
          ) : (
            <Text style={stylesModal.modalButtonText}>Previous</Text>
          )}
        </Pressable>
        <Pressable
          disabled={isLoading}
          onPress={toggleModal}
          style={[stylesModal.modalButton, styles.button]}>
          {isLoading ? (
            <ActivityIndicator color={colors.bottomActiveTextColor} />
          ) : (
            <Text style={stylesModal.modalButtonText}>Submit</Text>
          )}
        </Pressable>
      </View>
      <ModalLayout
        title="Submit Incident"
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <View>
          <Text style={styles.modalText}>
            An emergency work order will be created using the information you
            provided. Click continue to view crucial Emergency Contacts and
            Procedures for
            <Text style={styles.modalTextType}>
              {` ${EmergencyScenario.find(el => el.value === scenario)?.name}`}
            </Text>
          </Text>

          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <Pressable
              onPress={submitIncedent}
              disabled={isLoading}
              style={[stylesModal.modalButton, styles.button]}>
              {isLoading ? (
                <ActivityIndicator color={colors.bottomActiveTextColor} />
              ) : (
                <Text style={stylesModal.modalButtonText}>
                  Submit Incident & Continue
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ModalLayout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 60,
  },
  notifContainer: {
    gap: 15,
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 12,
    borderColor: colors.deleteColor,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#DC354533',
  },
  notifText: {
    flex: 1,
    color: colors.textColor,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
  },
  subTitle: {
    flex: 1,
    paddingVertical: 5,
    color: colors.textColor,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
  },

  // card: {
  //   backgroundColor: colors.backgroundLightColor,
  //   paddingHorizontal: 6,
  //   paddingVertical: 12,
  //   borderRadius: 10,
  // },
  // row: {
  //   flexDirection: 'row',
  // },
  // company: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 10,
  //   paddingHorizontal: 10,
  // },
  // companyName: {
  //   color: colors.textColor,
  //   fontWeight: '400',
  //   fontSize: 16,
  //   lineHeight: 21,
  // },
  // contact: {
  //   paddingHorizontal: 10,
  //   marginBottom: 10,
  // },
  // title: {
  //   color: colors.textSecondColor,
  //   fontSize: 14,
  //   fontWeight: '500',
  //   lineHeight: 21,
  //   marginBottom: 5,
  // },
  // text: {
  //   flex: 1,
  //   color: colors.textColor,
  //   fontSize: 14,
  //   fontWeight: '500',
  //   lineHeight: 21,
  // },
  // procedures: {
  //   marginHorizontal: 15,
  //   color: colors.textSecondColor,
  //   fontSize: 14,
  //   fontWeight: '500',
  //   lineHeight: 21,
  //   marginVertical: 20,
  // },
  // proceduresContainer: {
  //   flexDirection: 'row',
  //   gap: 15,
  //   borderRadius: 8,
  // },
  // proceduresIcon: {},
  // proceduresHeader: {
  //   flex: 1,
  //   justifyContent: 'space-between',
  // },
  // proceduresTitle: {
  //   fontWeight: '500',
  //   fontSize: 16,
  //   lineHeight: 24,
  //   color: '#202534',
  // },
  // proceduresDescription: {
  //   fontWeight: '400',
  //   fontSize: 12,
  //   lineHeight: 18,
  //   color: '#6C757D',
  // },
  // proceduresActions: {
  //   justifyContent: 'center',
  // },
  button: {
    backgroundColor: colors.deleteColor,
    borderColor: colors.deleteColor,
  },
  modalText: {
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 20,
  },
  modalTextType: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  previous: {
    backgroundColor: colors.textSecondColor,
    borderColor: colors.textSecondColor,
  },
  modalButtons: {
    position: 'relative',
  },
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
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
  sectionContainer: {
    padding: 10,
    gap: 10,
  },
});
