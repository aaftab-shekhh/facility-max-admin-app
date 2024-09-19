import React, {FC, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {getEmergencyPlansTC} from '../../../../../bll/reducers/emergency-Reducer';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../hooks/hooks';
import {NewEmergencyPlanType} from '../../../../../types/EmergencyTypes';
import moment from 'moment';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {FilterIcon} from '../../../../../assets/icons/FilterIcon';
import {SearchIcon} from '../../../../../assets/icons/SearchIcon';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import {stylesModal} from '../../../../../styles/styles';
import {useDebounce} from '../../../../../hooks/useDebounce';
import {EmergencyScenario, ProceduresData} from '../../../../../bll/state';
import {Procedures} from '../../../../../enums/emergency';
import {NotFound} from '../../../../../components/NotFound';
import {DropdownWithLeftIcon} from '../../../../../components/DropdownWithLeftIcon';
import {buildingsAPI} from '../../../../../api/buildingsApi';
import {UserRole} from '../../../../../enums/user';

type EmergencyPlanCardProps = {
  emergencyPlan: NewEmergencyPlanType;
};

export const EmergencyPlanCard: FC<EmergencyPlanCardProps> = ({
  emergencyPlan,
}) => {
  const navigation = useAppNavigation();
  const {ePlanEProcedureFiles} = emergencyPlan;

  const SAFETY = ePlanEProcedureFiles?.filter(
    pr => pr.file?.emergencyProcedure?.type === Procedures.SAFETY,
  );

  const COMMUNICATIONS = ePlanEProcedureFiles?.filter(
    pr => pr.file.emergencyProcedure?.type === Procedures.COMMUNICATIONS,
  );

  const RESPONSE = ePlanEProcedureFiles?.filter(
    pr => pr.file.emergencyProcedure?.type === Procedures.RESPONSE,
  );

  const RECOVERY = ePlanEProcedureFiles?.filter(
    pr => pr.file.emergencyProcedure?.type === Procedures.RECOVERY,
  );

  const MONITORING_AND_EVALUATION = ePlanEProcedureFiles?.filter(
    pr =>
      pr.file.emergencyProcedure?.type === Procedures.MONITORING_AND_EVALUATION,
  );

  const COMPLIANCE_AND_REGULATION = ePlanEProcedureFiles?.filter(
    pr =>
      pr.file.emergencyProcedure?.type === Procedures.COMPLIANCE_AND_REGULATION,
  );

  const [isOpen, setIsOpen] = useState(false);

  const togleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const EmergencyType = EmergencyScenario.find(
    el => el.value === emergencyPlan.scenario,
  );

  return (
    // <View style={emergencyPlanStyles.backing}>
    <Pressable
      style={emergencyPlanStyles.container}
      onPress={() => {
        navigation.navigate('Main', {
          screen: UserRole.TECHNICIAN,
          params: {
            screen: 'EmergencyTab',
            params: {
              screen: 'EmergencyPlan',
              params: {id: emergencyPlan.id},
            },
          },
        });
      }}>
      <View style={emergencyPlanStyles.head}>
        <View style={emergencyPlanStyles.row}>
          <View style={emergencyPlanStyles.headText}>
            <View style={emergencyPlanStyles.row}>
              {EmergencyType?.image}
              <View>
                <Text style={emergencyPlanStyles.name}>
                  {emergencyPlan.name}
                </Text>
                <Text style={emergencyPlanStyles.headText}>
                  {EmergencyType?.name}
                </Text>
              </View>
            </View>
            <Text style={emergencyPlanStyles.title}>
              Created: {moment(emergencyPlan.createdAt).format('MM/DD/YYYY')}
            </Text>
          </View>
        </View>
        <Pressable
          style={emergencyPlanStyles.button}
          onPress={togleIsOpen}
          hitSlop={15}>
          {isOpen ? (
            <ArrowUpIcon color={colors.textSecondColor} />
          ) : (
            <ArrowDownIcon color={colors.textSecondColor} />
          )}
        </Pressable>
      </View>
      <View style={emergencyPlanStyles.row}>
        <View style={emergencyPlanStyles.item}>
          <Text style={emergencyPlanStyles.title}>Affect Area:</Text>
          {emergencyPlan.affectedAreas?.map(area => (
            <Text key={area.id} style={emergencyPlanStyles.text}>
              {area.building?.name && area.building.name}
            </Text>
          ))}
        </View>
        <View style={emergencyPlanStyles.item}>
          <Text style={emergencyPlanStyles.title}>Last Reviewed:</Text>
          <View style={{flex: 1}}>
            <Text style={emergencyPlanStyles.text}>
              {moment(emergencyPlan.lastReviewed).format('MM/DD/YYYY')}
            </Text>
          </View>
        </View>
      </View>
      {isOpen && (
        <>
          <Text
            style={[
              emergencyPlanStyles.text,
              emergencyPlanStyles.proceduresHead,
            ]}>
            Assigned Procedures
          </Text>
          <View style={emergencyPlanStyles.row}>
            <View style={emergencyPlanStyles.row}>
              <Text style={emergencyPlanStyles.title}>Safety</Text>
              {SAFETY && SAFETY.length > 0 ? (
                <View
                  style={[
                    emergencyPlanStyles.check,
                    emergencyPlanStyles.checkTrue,
                  ]}>
                  <Text
                    style={[
                      emergencyPlanStyles.buttonText,
                      emergencyPlanStyles.buttonTextTrue,
                    ]}>
                    ✓
                  </Text>
                </View>
              ) : (
                <View style={emergencyPlanStyles.check}>
                  <Text style={emergencyPlanStyles.buttonText}>–</Text>
                </View>
              )}
            </View>
            <View style={emergencyPlanStyles.row}>
              <Text style={emergencyPlanStyles.title}>Response</Text>
              {RESPONSE && RESPONSE.length > 0 ? (
                <View
                  style={[
                    emergencyPlanStyles.check,
                    emergencyPlanStyles.checkTrue,
                  ]}>
                  <Text
                    style={[
                      emergencyPlanStyles.buttonText,
                      emergencyPlanStyles.buttonTextTrue,
                    ]}>
                    ✓
                  </Text>
                </View>
              ) : (
                <View style={emergencyPlanStyles.check}>
                  <Text style={emergencyPlanStyles.buttonText}>–</Text>
                </View>
              )}
            </View>
          </View>
          <View style={emergencyPlanStyles.row}>
            <View style={emergencyPlanStyles.row}>
              <Text style={emergencyPlanStyles.title}>Communication</Text>
              {COMMUNICATIONS && COMMUNICATIONS.length > 0 ? (
                <View
                  style={[
                    emergencyPlanStyles.check,
                    emergencyPlanStyles.checkTrue,
                  ]}>
                  <Text
                    style={[
                      emergencyPlanStyles.buttonText,
                      emergencyPlanStyles.buttonTextTrue,
                    ]}>
                    ✓
                  </Text>
                </View>
              ) : (
                <View style={emergencyPlanStyles.check}>
                  <Text style={emergencyPlanStyles.buttonText}>–</Text>
                </View>
              )}
            </View>
            <View style={emergencyPlanStyles.row}>
              <Text style={emergencyPlanStyles.title}>Recovery</Text>
              {RECOVERY && RECOVERY.length > 0 ? (
                <View
                  style={[
                    emergencyPlanStyles.check,
                    emergencyPlanStyles.checkTrue,
                  ]}>
                  <Text
                    style={[
                      emergencyPlanStyles.buttonText,
                      emergencyPlanStyles.buttonTextTrue,
                    ]}>
                    ✓
                  </Text>
                </View>
              ) : (
                <View style={emergencyPlanStyles.check}>
                  <Text style={emergencyPlanStyles.buttonText}>–</Text>
                </View>
              )}
            </View>
          </View>
          <View style={emergencyPlanStyles.row}>
            <View style={emergencyPlanStyles.row}>
              <Text style={emergencyPlanStyles.title}>
                Monitoring & Evaluation
              </Text>
              {MONITORING_AND_EVALUATION &&
              MONITORING_AND_EVALUATION.length > 0 ? (
                <View
                  style={[
                    emergencyPlanStyles.check,
                    emergencyPlanStyles.checkTrue,
                  ]}>
                  <Text
                    style={[
                      emergencyPlanStyles.buttonText,
                      emergencyPlanStyles.buttonTextTrue,
                    ]}>
                    ✓
                  </Text>
                </View>
              ) : (
                <View style={emergencyPlanStyles.check}>
                  <Text style={emergencyPlanStyles.buttonText}>–</Text>
                </View>
              )}
            </View>
            <View style={emergencyPlanStyles.row}>
              <Text style={emergencyPlanStyles.title}>
                Compliance & Regulation:
              </Text>
              {COMPLIANCE_AND_REGULATION &&
              COMPLIANCE_AND_REGULATION.length > 0 ? (
                <View
                  style={[
                    emergencyPlanStyles.check,
                    emergencyPlanStyles.checkTrue,
                  ]}>
                  <Text
                    style={[
                      emergencyPlanStyles.buttonText,
                      emergencyPlanStyles.buttonTextTrue,
                    ]}>
                    ✓
                  </Text>
                </View>
              ) : (
                <View style={emergencyPlanStyles.check}>
                  <Text style={emergencyPlanStyles.buttonText}>–</Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </Pressable>
    // </View>
  );
};
export const EmergencyPlans = () => {
  const dispatch = useAppDispatch();
  const {customerId} = useAppSelector(state => state.user.user);
  const {emergencyPlans} = useAppSelector(state => state.emergency);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [buildings, setBuildings] = useState([]);
  const [searchString, setSearchString] = useState<string | undefined>();
  const [scenario, setScenario] = useState<undefined | string>(undefined);
  const [procedureTypes, setProcedureTypes] = useState<undefined | string>(
    undefined,
  );
  const [buildingId, setBuildingId] = useState<undefined | string>(undefined);
  const [assetCategories, setAssetCategories] = useState<undefined | string>(
    undefined,
  );

  const debouncedKeyWord = useDebounce(searchString, 400);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const apply = () => {
    const paraams: any = {
      scenario,
      procedureTypes,
      buildingId,
    };
    if (debouncedKeyWord !== '') {
      paraams.searchString = debouncedKeyWord;
    }
    dispatch(getEmergencyPlansTC(paraams));
    toggleModal();
  };

  const reset = () => {
    setSearchString(undefined);
    setScenario(undefined);
    setProcedureTypes(undefined);
    setAssetCategories(undefined);
    setBuildingId(undefined);
    dispatch(getEmergencyPlansTC({offset: 0, limit: 100}));
    toggleModal();
  };

  useEffect(() => {
    const paraams: any = {
      scenario,
      procedureTypes,
      buildingId,
    };
    if (debouncedKeyWord !== '') {
      paraams.searchString = debouncedKeyWord;
    }
    dispatch(getEmergencyPlansTC({...paraams, offset: 0, limit: 100}));
  }, [debouncedKeyWord]);

  useEffect(() => {
    dispatch(getEmergencyPlansTC({offset: 0, limit: 100}));
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      (async () => {
        try {
          const res = await buildingsAPI.getBuildingsList({
            customerId,
            page: 1,
            size: 100,
            sortField: 'name',
            sortDirection: 'ASC',
            keySearchValue: '',
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
  }, [isModalVisible]);

  return (
    <View style={{flex: 1}}>
      <View style={styles.search}>
        <View style={styles.inputItem}>
          <SearchIcon />
          <TextInput
            placeholder="Enter plan name"
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
        data={emergencyPlans}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return <EmergencyPlanCard key={item.id} emergencyPlan={item} />;
        }}
        contentContainerStyle={styles.container}
        ListEmptyComponent={() => {
          return <NotFound title="There are currently no emergency plans" />;
        }}
      />
      <ModalLayout
        title="Filter"
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <View>
          <ScrollView contentContainerStyle={{gap: 10}}>
            <DropdownWithLeftIcon
              label="Emergency Scenario"
              startValue={scenario}
              data={EmergencyScenario}
              onChange={item => setScenario(item.id)}
            />
            <DropdownWithLeftIcon
              label="Procedure Types"
              startValue={procedureTypes}
              data={ProceduresData}
              onChange={item => setProcedureTypes(item.id)}
            />
            <DropdownWithLeftIcon
              label="Building"
              startValue={procedureTypes}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  search: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginHorizontal: 15,
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

const emergencyPlanStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headText: {
    justifyContent: 'space-around',
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  name: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  button: {
    width: 23,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
    // borderStyle: 'solid',
    // borderWidth: 1.2,
    // borderColor: colors.textSecondColor,
    // borderRadius: 3,
  },
  buttonText: {
    color: colors.textSecondColor,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  buttonTextTrue: {
    color: colors.bottomActiveTextColor,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  photo: {
    height: 45,
    width: 45,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  item: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondColor,
  },
  text: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textColor,
  },
  proceduresHead: {
    fontWeight: '500',
    fontSize: 15,
  },
  check: {
    width: 23,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundGreyColor,
    borderRadius: 5,
  },
  checkTrue: {
    backgroundColor: colors.selectCheck,
  },
});
