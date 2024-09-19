import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FilterIcon} from '../assets/icons/FilterIcon';
import {SearchIcon} from '../assets/icons/SearchIcon';
import {FC, useEffect, useState} from 'react';
import {
  AccessControl,
  DropdownServices,
  Priority,
  Recurring,
  StatusesWorkOrders,
  TypesWOByRole,
} from '../bll/state';
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import {
  resetParamsState,
  setParamsState,
} from '../bll/reducers/filters-Reducer';
import {SCREEN_HEIGHT, stylesModal} from '../styles/styles';
import {SearchParamsType} from '../types/StateType';
import {colors} from '../styles/colors';
import {useDebounce} from '../hooks/useDebounce';
import {workOrderIcons} from '../bll/icons';
import {DropdownWithSearch} from './DropdownWithSearch';
import {
  enumStatuses,
  enumTypeWO,
  RecurringSubtype,
  TypePM,
} from '../enums/workOrders';
import {ModalLayout} from './Layouts/ModalLayout';
import {MyButton} from './MyButton';
import {AddNewSubcontractorDropdown} from '../screens/Main/Technician/WorkOrders/AddNewSubcontractor/AddNewSubcontractorDropdown';
import {DateInput} from './DateInput';
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from 'react-native-bouncy-checkbox-group';

const data = [
  {id: '0', text: 'Show Work Orders'},
  {id: '1', text: 'Show Maintenance'},
];

type SearchProps = {
  placeholder?: string;
  onChangeKey?: (value: string | undefined) => void;
  onChangeReset?: () => void;
  backgroundColor?: string;
  hideStatuses?: boolean;
};

export const Search: FC<SearchProps> = ({
  placeholder,
  onChangeKey,
  backgroundColor,
  hideStatuses,
}) => {
  const {role} = useAppSelector(state => state.user.user);
  const {paramsState} = useAppSelector(state => state.filters);
  const [isModalVisible, setModalVisible] = useState(false);

  const [value, setValue] = useState('');

  const [statuses, setStatuses] = useState<string[] | undefined>(
    paramsState.statuses,
  );
  const [types, setTypes] = useState<string[] | undefined>(paramsState.types);
  const [accessControls, setAccessControls] = useState<string[]>(
    paramsState.accessControls || [],
  );
  const [serviceTypes, setServiceTypes] = useState<string[]>(
    paramsState.serviceTypes || [],
  );
  const [recurringMaintenance, setRecurringMaintenance] = useState<string[]>(
    paramsState.recurringMaintenance || [],
  );

  const [priorities, setPriorities] = useState<string[] | undefined>(
    paramsState.priorities,
  );

  const [subcontractorIdes, setSubcontractorIdes] = useState<
    string[] | undefined
  >(paramsState.subcontractorIdes);

  const [showMaintenance, setShowMaintenance] = useState(paramsState.showPM);

  const [startDate, setStartDate] = useState(paramsState.startDate);
  const [endDate, setEndDate] = useState(paramsState.endDate);

  const [onlyMyWO, setOnlyMyWO] = useState(paramsState.onlyMyWO);

  const dispatch = useAppDispatch();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const debouncedKeyWord = useDebounce(value, 400);

  useEffect(() => {
    onChangeKey && onChangeKey(debouncedKeyWord);
  }, [debouncedKeyWord]);

  const setFilters = (): void => {
    const filters: SearchParamsType = {
      statuses,
      types: showMaintenance
        ? [
            enumTypeWO.PREVENTATIVE_MAINTENANCE,
            enumTypeWO.RECURRING_MAINTENANCE,
          ]
        : types,
      subTypes: showMaintenance
        ? [
            RecurringSubtype.FIRE_SYSTEM,
            RecurringSubtype.ROUTINE_SERVICE,
            ...Object.values(TypePM),
          ]
        : [...accessControls, ...serviceTypes, ...recurringMaintenance],
      priorities,
      subcontractorIdes,
      showPM: showMaintenance,
      byCreator: onlyMyWO,
      startDate,
      endDate,
    } as SearchParamsType;
    for (const el in filters) {
      if (
        filters[el as keyof SearchParamsType] !== undefined ||
        (Array.isArray(filters[el as keyof SearchParamsType]) &&
          filters[el as keyof SearchParamsType] !==
            filters[el as keyof SearchParamsType]?.length > 0)
      ) {
        dispatch(
          setParamsState({
            [el as keyof SearchParamsType]: filters[el],
          }),
        );
      }
    }
    toggleModal();
  };

  const resetFilters = (): void => {
    dispatch(resetParamsState());
    setStatuses(undefined);
    setTypes(undefined);
    setAccessControls([]);
    setPriorities(undefined);
    setOnlyMyWO(undefined);
    setShowMaintenance(undefined);
    setSubcontractorIdes(undefined);
    setStartDate(paramsState.startDate);
    setEndDate(paramsState.endDate);
    toggleModal();
  };

  useEffect(() => {
    setStartDate(paramsState.startDate);
    setEndDate(paramsState.endDate);
  }, [paramsState.startDate, paramsState.endDate]);

  return (
    <View
      style={[
        stylesModal.container,
        styles.container,
        {backgroundColor: backgroundColor && backgroundColor},
      ]}>
      <View style={stylesModal.inputItem}>
        <SearchIcon />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondColor}
          style={stylesModal.input}
          onChangeText={val => {
            setValue(val);
            dispatch(setParamsState({keySearchValue: val}));
          }}
        />
      </View>
      <TouchableOpacity style={stylesModal.filter} onPress={toggleModal}>
        <FilterIcon />
      </TouchableOpacity>
      <ModalLayout
        title="Filter"
        isModalVisible={isModalVisible}
        toggleModal={() => setModalVisible(false)}>
        <View style={[styles.modalContainer]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20, gap: 10}}>
            <BouncyCheckboxGroup
              data={data}
              style={[styles.checkboxGroup]}
              checkboxProps={{
                style: {flexDirection: 'row-reverse'},
                textStyle: [styles.checkboxText, {flex: 1}],
                fillColor: '#1B6BC0',
                size: 20,
                textContainerStyle: {flex: 1, marginLeft: 0},
                iconImageStyle: {
                  backgroundColor: '#FFF',
                  borderRadius: 5,
                },
              }}
              //@ts-ignore
              initial={showMaintenance ? '1' : '0'} //error in the library. this is how it works correctly, otherwise the android app crash
              onChange={(selectedItem: ICheckboxButton) => {
                if (selectedItem.id === '1') {
                  setShowMaintenance(true);
                } else {
                  setShowMaintenance(false);
                  setTypes([]);
                }
              }}
            />
            {!hideStatuses && (
              <DropdownWithSearch
                label={showMaintenance ? 'Statuses' : 'Work order Statuses'}
                onChange={item => setStatuses(item)}
                startValue={statuses}
                data={StatusesWorkOrders.filter(
                  el => el.id !== enumStatuses.ACTIVE,
                )}
                multiSelect
              />
            )}
            {!showMaintenance && (
              <>
                <DropdownWithSearch
                  label="Work order types"
                  onChange={item => setTypes(item)}
                  startValue={types}
                  data={TypesWOByRole[role]}
                  isIcon
                  dropdownIcons={workOrderIcons}
                  multiSelect
                />
                {types?.some(el => el === enumTypeWO.SERVICE_REQUEST) && (
                  <DropdownWithSearch
                    label="Service Types"
                    onChange={item => {
                      setServiceTypes(item);
                    }}
                    startValue={serviceTypes}
                    data={DropdownServices}
                    multiSelect
                  />
                )}
                {types?.some(el => el === enumTypeWO.ACCESS_CONTROL) && (
                  <DropdownWithSearch
                    label="Access Control"
                    onChange={item => {
                      setAccessControls(item);
                    }}
                    startValue={accessControls}
                    data={AccessControl}
                    multiSelect
                  />
                )}
                {(types?.some(el => el === enumTypeWO.RECURRING_MAINTENANCE) ||
                  showMaintenance) && (
                  <DropdownWithSearch
                    label="Recurring Maintenance"
                    onChange={item => {
                      setRecurringMaintenance(item);
                    }}
                    startValue={recurringMaintenance}
                    data={Recurring}
                    multiSelect
                  />
                )}
              </>
            )}

            <DropdownWithSearch
              label="Priorities"
              onChange={item => setPriorities(item)}
              startValue={priorities}
              data={Priority}
              multiSelect
            />
            <AddNewSubcontractorDropdown
              onChangeSubcontractors={item => {
                setSubcontractorIdes(item as string[]);
              }}
              hideAddButton
              multiSelect
              startValue={subcontractorIdes}
            />
            <View style={{flexDirection: 'row', gap: 10}}>
              <DateInput
                labelDate="Date"
                startValue={startDate}
                onChange={val => {
                  setStartDate(new Date(val).toISOString());
                }}
              />
              <DateInput
                labelDate="Date"
                startValue={endDate.replace('Z', '')}
                onChange={val => {
                  setEndDate(new Date(val).toISOString());
                }}
              />
            </View>
          </ScrollView>
          <View style={[styles.buttons]}>
            <MyButton
              text={'Reset All'}
              action={resetFilters}
              style="mainBorder"
            />
            <MyButton text={'Show'} action={setFilters} style="main" />
          </View>
        </View>
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  checkbox: {
    marginTop: 20,
  },
  borderRadius: {
    borderRadius: 3,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    position: 'relative',
  },
  modalContainer: {
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  checkboxGroup: {
    flex: 1,
    flexDirection: 'column',
    gap: 15,
    paddingRight: 10,
    // alignItems: 'center',
  },
});
