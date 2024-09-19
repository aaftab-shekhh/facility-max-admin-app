import {useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {woAPI} from '../../../../../../api/woApi';
import {colors} from '../../../../../../styles/colors';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {subcontractorsAPI} from '../../../../../../api/subcontractorsApi';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {InfoItem} from '../../../../../../components/InfoItem';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../../bll/icons';
import {Contact} from '../../../Emergency/EmergencyPlan/EmergencyPlanContacts';
import {DeleteIcon} from '../../../../../../assets/icons/DeleteIcon';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {AddSubcontractor} from './AddSubcontractor';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {stylesModal} from '../../../../../../styles/styles';
import {useOrientation} from '../../../../../../hooks/useOrientation';
import {AssignnmentsTeam} from './AssigmentsTeam';
import {MyButton} from '../../../../../../components/MyButton';
import {enumTypeWO} from '../../../../../../enums/workOrders';
import {DotsIcon} from '../../../../../../assets/icons/DotsIcon';
import SendDetailsIcon from '../../../../../../assets/icons/SendDetailsIcon';
import {ActionsMenu} from '../../../../../../components/ActionsMenu';
import {SendWODetails} from './SendWODetails';

type ResponsibilityType = {
  id: string;
  name: string;
  color: string;
  customerId: string;
  SubcontractorResponsibilities: {
    id: string;
    subcontractorId: string;
    assetCategoryId: string;
  };
};

type SubcontractorType = {
  id: string;
  name: string;
  availability: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  hoursOfOperation: string;
  phone: string;
  afterHoursPhone: string;
  approvedByProcurement: boolean;
  isEmergency: boolean;
  customerId: string;
  regionId: string;
  creationDate: string;
  lastUpdateDate: string;
  contacts: any[];
  region: {
    id: string;
    name: string;
  };
  responsibilities: ResponsibilityType[];
};

export const WorkOrderAssigments = () => {
  const {workOrder} = useAppSelector(state => state.wo);
  const {subcontractorId, id: workOrderId} = workOrder;
  const {numColumn, onLayout} = useOrientation();

  const [subcontractor, setSubcontractor] = useState<SubcontractorType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenSubcontractor, setIsOpenSubcontractor] = useState(true);
  const [isModalSendWODetails, setIsModalSendWODetails] = useState(false);
  const [isModalAddSubcontractor, setIsModalAddSubcontractor] = useState(false);
  const [isModalRemoveSubcontractor, setIsModalRemoveSubcontractor] =
    useState(false);

  const toggleAddSubcontrModal = () => {
    setIsModalAddSubcontractor(!isModalAddSubcontractor);
  };

  const toggleSendWODetailsModal = () => {
    setIsModalSendWODetails(!isModalSendWODetails);
  };

  const toggleRemoveSubcontrModal = () => {
    setIsModalRemoveSubcontractor(!isModalRemoveSubcontractor);
  };

  const getSubcontractor = async () => {
    setIsLoading(true);
    if (subcontractorId) {
      try {
        const res = await subcontractorsAPI.getSubcontractorById({
          subcontractorId,
        });
        setSubcontractor(res.data);
      } catch (err) {
        handleServerNetworkError(err?.response?.data);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeSubcontractor = async () => {
    try {
      await woAPI.deleteEntitiesFromWO({workOrderId, subcontractorId: null});
      toggleRemoveSubcontrModal();
      setSubcontractor(null);
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    }
  };

  const menuConfig = useMemo(
    () => ({
      menuButton: (
        <DotsIcon
          color={colors.calendarBsckGround}
          fill={colors.textSecondColor}
        />
      ),
      items: [
        {
          icon: <SendDetailsIcon />,
          text: 'Send WO Details',
          action: toggleSendWODetailsModal,
        },
        {
          icon: <DeleteIcon />,
          text: 'Remove from WO',
          action: toggleRemoveSubcontrModal,
        },
      ] as any[],
    }),
    [],
  );

  useEffect(() => {
    (async () => {
      subcontractorId ? await getSubcontractor() : setSubcontractor(null);
    })();
  }, [workOrder]);

  return (
    <View
      style={styles.container}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}>
      <ScrollView contentContainerStyle={styles.flatList}>
        <AssignnmentsTeam />
        {workOrder.type !== enumTypeWO.AMENITY_SPACE_BOOKING && (
          <View style={{gap: 10}}>
            <Text style={styles.itemTitle}>Subcontractor</Text>
            {subcontractor ? (
              <View style={styles.section}>
                <Pressable
                  onPress={() => setIsOpenSubcontractor(!isOpenSubcontractor)}
                  style={[
                    styles.header,
                    isOpenSubcontractor && styles.headerOpen,
                  ]}>
                  <View style={styles.headerSubContainer}>
                    <Text style={styles.headerText}>{subcontractor.name}</Text>
                    <ActionsMenu menuConfig={menuConfig} />
                  </View>
                  {isOpenSubcontractor ? (
                    <ArrowUpIcon color={colors.textSecondColor} />
                  ) : (
                    <ArrowDownIcon color={colors.textSecondColor} />
                  )}
                </Pressable>
                {isOpenSubcontractor && (
                  <View
                    style={{marginHorizontal: 15, paddingVertical: 10, gap: 5}}>
                    <View style={numColumn === 1 ? styles.column : styles.row}>
                      {subcontractor.responsibilities &&
                        subcontractor.responsibilities.length > 0 && (
                          <View style={{flex: 1}}>
                            <InfoItem
                              title="Responsibilities:"
                              customRightItem={
                                <View style={styles.responsibilities}>
                                  {subcontractor.responsibilities.map(el => (
                                    <View
                                      key={el.id}
                                      style={styles.responsibilitie}>
                                      <FastImage
                                        source={
                                          el.link
                                            ? {uri: el.link}
                                            : dropdownIcons[el.name]
                                        }
                                        style={styles.icon}
                                        defaultSource={dropdownIcons[el.name]}
                                      />
                                      {/* <Text style={styles.itemText}>{el.name}</Text> */}
                                    </View>
                                  ))}
                                </View>
                              }
                            />
                          </View>
                        )}
                      {subcontractor.address && (
                        <View style={{flex: 1}}>
                          <InfoItem
                            title="Address:"
                            text={subcontractor.address}
                            hiddeBorder={
                              !subcontractor.afterHoursPhone &&
                              !subcontractor.availability
                            }
                          />
                        </View>
                      )}
                    </View>
                    <View style={numColumn === 1 ? styles.column : styles.row}>
                      {subcontractor.availability && (
                        <View style={{flex: 1}}>
                          <InfoItem
                            title="Availability:"
                            text={subcontractor.availability}
                          />
                        </View>
                      )}
                      {subcontractor.afterHoursPhone && (
                        <View style={{flex: 1}}>
                          <InfoItem
                            title="After Hours/Emergency phone:"
                            text={subcontractor.afterHoursPhone}
                            hiddeBorder={
                              !subcontractor.contacts ||
                              subcontractor.contacts.length === 0
                            }
                          />
                        </View>
                      )}
                    </View>
                    {subcontractor.contacts &&
                      subcontractor.contacts.length > 0 && (
                        <View>
                          <Text style={styles.itemTitle}>
                            Contacts({subcontractor.contacts.length})
                          </Text>
                          <View
                            style={
                              numColumn === 1 ? styles.column : styles.rowCards
                            }>
                            {subcontractor.contacts.map(contact => (
                              <Contact key={contact.id} contact={contact} />
                            ))}
                          </View>
                        </View>
                      )}
                    {/* <MyButton
                      text="Remove"
                      action={toggleRemoveSubcontrModal}
                      leftIcon={<DeleteIcon fill={colors.deleteColor} />}
                      style="primaryRemove"
                    /> */}
                  </View>
                )}
              </View>
            ) : (
              <MyButton
                action={toggleAddSubcontrModal}
                text="+ Add Subcontractor"
                style="primary"
              />
            )}
          </View>
        )}
      </ScrollView>
      <ModalLayout
        toggleModal={toggleAddSubcontrModal}
        isModalVisible={isModalAddSubcontractor}
        title="Add Subcontractor">
        <AddSubcontractor toggleModal={toggleAddSubcontrModal} />
      </ModalLayout>
      <ModalLayout
        toggleModal={toggleSendWODetailsModal}
        isModalVisible={isModalSendWODetails}
        title="Select the Contact(s) of the Subcontractor to Whom You Want to Send WO Details by Email">
        <SendWODetails
          toggleModal={toggleSendWODetailsModal}
          subcontractorId={subcontractorId}
        />
      </ModalLayout>
      <ModalLayout
        toggleModal={toggleRemoveSubcontrModal}
        isModalVisible={isModalRemoveSubcontractor}
        title="Remove from Work Order">
        <View>
          <Text style={styles.modalText}>
            Are you sure you want to remove{' '}
            <Text style={styles.modalTextType}>{`${subcontractor?.name}`}</Text>{' '}
            subcontractor from this Work Order?
          </Text>

          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <MyButton
              text="Remove"
              action={removeSubcontractor}
              style="remove"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        </View>
      </ModalLayout>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    gap: 10,
    paddingVertical: 10,
    flexGrow: 1,
    paddingHorizontal: 10,
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
  headerSubContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
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
    // flex: 0.9,
  },
  responsibilities: {
    gap: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 0.8,
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
