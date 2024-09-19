import {ChangeEvent, FC, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {buildingsAPI} from '../../../../../../api/buildingsApi';
import {woAPI} from '../../../../../../api/woApi';
import {InputItem} from '../../../../../../components/InputItam';
import {CreateWOForm} from '../../../../../../types/FormTypes';
import {FormikErrors, FormikProps} from 'formik';
import {DropdownWithSearch} from '../../../../../../components/DropdownWithSearch';
import {AddNewSubcontractorDropdown} from '../../AddNewSubcontractor/AddNewSubcontractorDropdown';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {colors} from '../../../../../../styles/colors';
import {DropdownWithLeftIcon} from '../../../../../../components/DropdownWithLeftIcon';
import {enumPriority, enumTypeWO} from '../../../../../../enums/workOrders';
import {FREQUENCY_WO, Priority} from '../../../../../../bll/state';
import {sortedBy} from '../../../../../../utils/sorted';
import {AddAssetsToWO} from './AddAssetsToWO';
import {AssetType, BuildingType} from '../../../../../../types/StateType';
import {DateTimeInput} from '../../../../../../components/DateTimeInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useOrientation} from '../../../../../../hooks/useOrientation';
import {checkboxStyles} from '../../../../../../styles/styles';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';
import {useNetInfo} from '@react-native-community/netinfo';
import {GetRoomsParams} from '../../../../../../api/ApiTypes';
import CheckIcon from '../../../../../../assets/icons/CheckIcon';
import {contactsAPI} from '../../../../../../api/contactsApi';
import {UserRole} from '../../../../../../enums/user';

export const SubcontractorContact = ({contact, subcontractorsForm}) => {
  const {values, setFieldValue} = subcontractorsForm;
  const selected = values.emails.some(el => el === contact.email);

  const changeValues = () => {
    selected
      ? setFieldValue(
          'emails',
          values.emails.filter(el => el !== contact.email),
        )
      : setFieldValue('emails', [...values.emails, contact.email]);
  };

  return (
    <TouchableOpacity style={contactStyle.container} onPress={changeValues}>
      <View style={contactStyle.subContainer}>
        <Text style={contactStyle.name}>
          {contact.firstName} {contact.lastName}
          <Text style={contactStyle.type}> • {contact.type}</Text>
        </Text>
        <Text style={contactStyle.type}>{contact.email}</Text>
      </View>
      <View
        style={[
          contactStyle.check,
          selected && {
            backgroundColor: colors.borderAssetColor,
            borderColor: colors.borderAssetColor,
          },
        ]}>
        {selected && <CheckIcon />}
      </View>
    </TouchableOpacity>
  );
};

const contactStyle = StyleSheet.create({
  container: {
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subContainer: {
    gap: 1,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderColor: colors.textSecondColor,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: colors.textColor,
    lineHeight: 20,
  },
  type: {
    color: colors.textSecondColor,
    lineHeight: 20,
  },
});

type CreateWOStep2Props = {
  errors: FormikErrors<CreateWOForm>;
  values: CreateWOForm;
  handleChange: {
    (e: ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent<any>) => void;
  };
  handleBlur: any;
  submitCount: number;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => Promise<void> | Promise<FormikErrors<CreateWOForm>>;
  clearFields: (fields: string[]) => void;
  assetId?: string;
  subcontractorsForm: FormikProps<any>;
};

export const CreateWOStep2: FC<CreateWOStep2Props> = ({
  errors,
  values,
  handleChange,
  handleBlur,
  submitCount,
  setFieldValue,
  clearFields,
  assetId,
  subcontractorsForm,
}) => {
  const {isConnected} = useNetInfo();
  const {getLocalBuildings} = useLocalStateSelector();
  const {numColumn, onLayout} = useOrientation();

  const {asset} = useAppSelector(state => state.assets);
  const {customerId, regionId, role} = useAppSelector(state => state.user.user);
  const {assignedBuckets} = useAppSelector(state => state.user);

  const [buildings, setBuildings] = useState<BuildingType[]>([]);

  const [selectedBuilding, setSelectedBuilding] = useState<
    string | undefined
  >();
  const [selectedFloors, setSelectedFloors] = useState<string[] | undefined>(
    [],
  );

  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [teams, setTeams] = useState([]);
  const [viewStartWorkOrder, setViewStartWorkOrder] = useState(false);
  const [isAddSubconstractors, setIsAddSubconstractors] = useState(
    values.subcontractorId !== undefined,
  );
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<
    any | null
  >(null);

  const onChange = (assets: AssetType[]) => {
    if (assets.length > 0) {
      setFieldValue('assetsId', assets);
    } else {
      clearFields(['assetsId']);
    }
  };

  const DescriptionLabel: {[key: string]: string} = useMemo(
    () => ({
      [enumTypeWO.AMENITY_SPACE_BOOKING]:
        'Include dates, times, and additional details about your booking request',
      [enumTypeWO.EVENT_SUPPORT]:
        'Include dates, times, details and any special requests needed to support your event',
    }),
    [],
  );

  useEffect(() => {
    isConnected
      ? (async () => {
          try {
            const res = await buildingsAPI.getBuildingsListByRegion({
              customerId,
              regionIds: [regionId],
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
        })()
      : setBuildings(getLocalBuildings({regionId}).payload as BuildingType[]);

    (async () => {
      const params = {
        customerId,
        sortField: 'name',
        sortDirection: 'ASC',
        page: 1,
        size: 100,
      };

      if (role === UserRole.SUPERVISOR) {
        params.regionIds = [regionId];
      }

      const res = await woAPI.getBucketsList(params);
      setTeams(
        res.data.rows.map(el => ({
          ...el,
          labelColor:
            el.workInProgress !== 0
              ? colors.mainActiveColor
              : el.workOnHold !== 0
              ? colors.heighPriority
              : el.workPendingReview !== 0
              ? colors.pandingReview
              : colors.textSecondColor,
          labelText:
            el.workInProgress !== 0
              ? `${el.workInProgress} In Progress`
              : el.workOnHold !== 0
              ? `${el.workOnHold} On Hold`
              : el.workPendingReview !== 0
              ? `${el.workPendingReview} Pending Review`
              : 'No active work orders',
          labelBackgroundColor:
            el.workInProgress !== 0
              ? '#1b6bc025'
              : el.workOnHold !== 0
              ? '#ff7e0722'
              : el.workPendingReview !== 0
              ? '#ffc10723'
              : '#6c757d24',
        })),
      );
    })();
    if (values.buildingId) {
      setSelectedBuilding(values.buildingId);
    }
    if (values.type === enumTypeWO.AMENITY_SPACE_BOOKING) {
      clearFields(['floorId']);
    } else if (values.floorId) {
      setSelectedFloors([values.floorId]);
    }
  }, [isConnected]);

  useEffect(() => {
    if (
      (values.type === enumTypeWO.AMENITY_SPACE_BOOKING &&
        rooms.length > 0 &&
        !rooms.some(el => el.id === values.roomId)) ||
      (!values.floorId && values.type !== enumTypeWO.AMENITY_SPACE_BOOKING)
    ) {
      clearFields(['roomId']);
    }
  }, [rooms]);

  useEffect(() => {
    if (selectedBuilding) {
      (async () => {
        if (values.type !== enumTypeWO.AMENITY_SPACE_BOOKING) {
          const res = await buildingsAPI.getFloorsByBuildingId({
            buildingId: selectedBuilding,
            page: 1,
            size: 10,
            sortField: 'name',
            sortDirection: 'ASC',
            // keySearchValue: '',
          });
          setFloors(res.data.rows);
        } else {
          const params: GetRoomsParams = {
            buildingId: selectedBuilding,
            isAmenity: true,
            page: 1,
            size: 10,
            sortField: 'name',
            sortDirection: 'ASC',
            keySearchValue: '',
          };
          const res = await buildingsAPI.getRoomsByEntity(params);
          setRooms(res.data.rows);
        }
      })();
    }
  }, [selectedBuilding]);

  const check = () => {
    let a = false;

    assignedBuckets.forEach(el => {
      const res =
        values.bucketsId && values.bucketsId.some(bucket => bucket === el.id);
      if (res) {
        setViewStartWorkOrder(true);
        a = true;
      }
    });
    return a;
  };

  useEffect(() => {
    setViewStartWorkOrder(false);
    const rescheck = check();

    if (!rescheck) {
      clearFields([
        'startWorkOrder',
        'startDate',
        'expectedDuration',
        'estimatedLaborHours',
        'expectedCompletionDate',
      ]);
    }
  }, [values.bucketsId]);

  useEffect(() => {
    if (selectedFloors && selectedFloors?.length > 0) {
      (async () => {
        const params: GetRoomsParams = {
          floorIdes: [selectedFloors[0]],
          page: 1,
          size: 10,
          sortField: 'name',
          sortDirection: 'ASC',
          keySearchValue: '',
        };
        const res = await buildingsAPI.getRoomsByEntity(params);
        setRooms(res.data.rows);
      })();
    }
  }, [selectedFloors]);

  useEffect(() => {
    setContacts([]);
    subcontractorsForm.setFieldValue('emails', []);
    if (values?.subcontractorId) {
      (async () => {
        const res = await contactsAPI.getContacts({
          link: values.subcontractorId,
        });
        setContacts(res.data.payload);
      })();
    }
  }, [values.subcontractorId]);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}>
      <InputItem
        label="Title"
        defaultValue={values.title}
        handleChange={handleChange('title')}
        error={errors.title}
        placeholder={
          values.type === enumTypeWO.AMENITY_SPACE_BOOKING
            ? 'Enter the title for this booking'
            : 'Enter a title for this work order'
        }
        touched={submitCount > 0}
        handleBlur={handleBlur('title')}
      />

      {/* <View style={styles.line} /> */}
      <View style={numColumn === 1 ? styles.column : styles.row}>
        {values.type !== enumTypeWO.RECURRING_MAINTENANCE && (
          <DropdownWithLeftIcon
            label="Priority"
            onChange={item => setFieldValue('priority', item.id)}
            startValue={values.priority}
            data={Priority.filter(el => el.id !== enumPriority.SCHEDULED)}
            error={errors.priority}
            touched={submitCount > 0}
          />
        )}
        {teams.length > 0 && (
          <DropdownWithSearch
            label="WO Team(s)"
            data={teams}
            onChange={item => {
              setFieldValue('bucketsId', item);
            }}
            multiSelect
            startValue={values.bucketsId}
            placeholder="Select WO Team(s)"
            error={errors.bucketsId}
            touched={submitCount > 0}
            rightLabel
          />
        )}
      </View>
      {viewStartWorkOrder && (
        <>
          <BouncyCheckbox
            size={20}
            style={checkboxStyles.checkbox}
            fillColor={colors.borderAssetColor}
            innerIconStyle={checkboxStyles.borderRadius}
            iconStyle={checkboxStyles.borderRadius}
            textStyle={checkboxStyles.checkboxText}
            isChecked={values.startWorkOrder}
            text={'Would you like to begin this work order now?'}
            onPress={(isChecked: boolean) => {
              setFieldValue('startWorkOrder', isChecked);
              clearFields([
                'startDate',
                'expectedDuration',
                'estimatedLaborHoursTech',
                'expectedCompletionDateTech',
              ]);
            }}
          />

          {values.startWorkOrder && (
            <View style={numColumn === 1 ? styles.column : styles.row}>
              {values.type === enumTypeWO.RECURRING_MAINTENANCE ? (
                <></>
              ) : (
                <>
                  <DateTimeInput
                    labelDate="Expected Completion Date"
                    labelTime="Time"
                    startValue={values.expectedCompletionDate}
                    onChange={value => {
                      setFieldValue(
                        'expectedCompletionDate',
                        new Date(value).toISOString(),
                      );
                    }}
                    error={errors.expectedCompletionDate}
                    touched={submitCount > 0}
                  />
                </>
              )}
              <InputItem
                numeric
                label="Estimated labor hours"
                defaultValue={values.estimatedLaborHours}
                handleChange={handleChange('estimatedLaborHours')}
                error={errors.estimatedLaborHours}
                touched={submitCount > 0}
                handleBlur={handleBlur('estimatedLaborHours')}
              />
            </View>
          )}
        </>
      )}

      {values.type === enumTypeWO.RECURRING_MAINTENANCE && (
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <DateTimeInput
            labelDate="Start Date"
            labelTime="Time"
            startValue={values.startDate}
            onChange={value => {
              setFieldValue('startDate', new Date(value).toISOString());
            }}
            error={errors.startDate}
            touched={submitCount > 0}
          />
          <DropdownWithLeftIcon
            label="Frequency"
            data={FREQUENCY_WO}
            startValue={values.frequency}
            onChange={item => {
              setFieldValue('frequency', item.name);
            }}
            placeholder="Select a Frequency"
            error={errors.frequency}
            touched={submitCount > 0}
          />
        </View>
      )}
      {!assetId ? (
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <DropdownWithLeftIcon
            label="Building"
            onChange={item => {
              setFieldValue('buildingId', item.id);
              setSelectedBuilding(item.id);
              clearFields(['floorId', 'roomId', 'assetsId']);
            }}
            data={buildings}
            isIcon
            dropdownIcons={{
              defaultSource: require('../../../../../../assets/img/Building.png'),
            }}
            startValue={values.buildingId}
            placeholder="Select a Building"
            error={errors.buildingId}
            touched={submitCount > 0}
          />
          {values.buildingId &&
            floors?.length > 0 &&
            values.type !== enumTypeWO.AMENITY_SPACE_BOOKING && (
              <DropdownWithLeftIcon
                label="Floor (Optional)"
                onChange={item => {
                  setFieldValue('floorId', item.id);
                  setSelectedFloors([item.id]);
                  clearFields(['roomId']);
                }}
                data={sortedBy('name', floors)}
                startValue={values.floorId}
                placeholder="Select a Floor"
              />
            )}
          {(values.floorId ||
            values.type === enumTypeWO.AMENITY_SPACE_BOOKING) &&
            rooms?.length > 0 && (
              <DropdownWithLeftIcon
                label={
                  values.type === enumTypeWO.AMENITY_SPACE_BOOKING
                    ? 'Amenity Space'
                    : 'Room/Office (Optional)'
                }
                onChange={item => {
                  setFieldValue('roomId', item.id);
                }}
                data={sortedBy('name', rooms)}
                startValue={values.roomId}
                placeholder={
                  values.type === enumTypeWO.AMENITY_SPACE_BOOKING
                    ? 'Select Amenity Space'
                    : 'Select Room/Office'
                }
                error={errors.roomId}
                touched={submitCount > 0}
              />
            )}
        </View>
      ) : (
        <>
          <View style={[numColumn === 1 ? styles.column : styles.row]}>
            {asset.building && (
              <>
                <InputItem
                  disabled
                  label="Building"
                  defaultValue={asset.building?.name}
                  error={errors.buildingId}
                  touched={submitCount > 0}
                />
                {asset.floor && (
                  <InputItem
                    disabled
                    label="Floor"
                    defaultValue={asset.floor?.name}
                  />
                )}
                {asset.room && (
                  <InputItem
                    disabled
                    label="Room/office"
                    defaultValue={asset.room?.name}
                  />
                )}
              </>
            )}
          </View>
        </>
      )}
      {values.type !== enumTypeWO.AMENITY_SPACE_BOOKING && (
        <>
          {values.buildingId && (
            <AddAssetsToWO
              buildingId={values.buildingId}
              values={values}
              assetId={assetId}
              onChange={onChange}
            />
          )}
          <BouncyCheckbox
            size={20}
            style={checkboxStyles.checkbox}
            fillColor={colors.borderAssetColor}
            innerIconStyle={checkboxStyles.borderRadius}
            iconStyle={checkboxStyles.borderRadius}
            textStyle={checkboxStyles.checkboxText}
            text={'Assign Subcontractor?'}
            isChecked={isAddSubconstractors}
            onPress={(isChecked: boolean) => {
              setIsAddSubconstractors(isChecked);
              clearFields(['subcontractorId']);
            }}
          />
          {isAddSubconstractors && (
            <>
              <AddNewSubcontractorDropdown
                onChangeSubcontractors={item =>
                  setFieldValue('subcontractorId', item)
                }
                startValue={values.subcontractorId}
              />
              <BouncyCheckbox
                size={20}
                style={checkboxStyles.checkbox}
                fillColor={colors.borderAssetColor}
                innerIconStyle={checkboxStyles.borderRadius}
                iconStyle={checkboxStyles.borderRadius}
                textStyle={checkboxStyles.checkboxText}
                text={'Send work order details to subcontractor?'}
                onPress={(isChecked: boolean) => {
                  setFieldValue('sendToSubcontractor', isChecked);
                }}
              />
              {values.sendToSubcontractor && contacts.length > 0 && (
                <>
                  {contacts.map(contact => (
                    <SubcontractorContact
                      key={contact.id}
                      contact={contact}
                      subcontractorsForm={subcontractorsForm}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </>
      )}
      <InputItem
        label={DescriptionLabel[values.type] || 'Description'}
        placeholder="Enter your description..."
        handleChange={handleChange('description')}
        defaultValue={values.description}
        multiline
        error={errors.description}
        touched={submitCount > 0}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 70,
    gap: 10,
  },

  line: {
    height: 1,
    backgroundColor: colors.backgroundGreyColor,
    marginTop: 15,
    borderRadius: 2,
  },
  column: {
    gap: 10,
  },
  row: {
    gap: 10,
    flexDirection: 'row',
  },
});
