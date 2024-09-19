import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ApprovedIcon} from '../../../../../assets/icons/ApprovedIcon';
import {CrossSmallIcon} from '../../../../../assets/icons/CrossSmallIcon';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {colors} from '../../../../../styles/colors';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../hooks/hooks';
import {FC, useEffect, useState} from 'react';
import {getSubcontractorsTC} from '../../../../../bll/reducers/wo-Reducer';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../bll/icons';
import {getTab} from '../../../../../utils/getTab';
import {UserRole} from '../../../../../enums/user';

type AddNewSubcontractorDropdownProps = {
  onChangeSubcontractors?: (selectedSubcontractors: string | string[]) => void;
  multiSelect?: boolean;
  startValue?: string | string[];
  selectAdd?: () => void;
  hideAddButton?: boolean;
};

export const AddNewSubcontractorDropdown: FC<
  AddNewSubcontractorDropdownProps
> = ({
  onChangeSubcontractors,
  multiSelect,
  startValue,
  selectAdd,
  hideAddButton,
}) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const {customerId} = useAppSelector(state => state.user.user);
  const {subcontractors} = useAppSelector(state => state.wo);

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [selectedSubcontractors, setSelectedSubcontractors] = useState<
    string[]
  >([]);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>({
    id: startValue,
  });

  const subcontractorsArray = Array.isArray(subcontractors)
    ? !hideAddButton
      ? [
          ...subcontractors,
          {
            name: '+ Add New Subcontractor',
            id: 'addNewSubcontractor',
            labelStyle: {color: '#1B6BC0'},
          },
        ]
      : subcontractors
    : !hideAddButton
    ? [
        {
          name: '+ Add New Subcontractor',
          id: 'addNewSubcontractor',
          labelStyle: {color: '#1B6BC0'},
        },
      ]
    : [];

  const renderItem = item => {
    return (
      <View key={item.id} style={styles.border}>
        {item.id === 'addNewSubcontractor' ? (
          <Pressable
            style={styles.itemContainer}
            onPress={() => {
              selectAdd && selectAdd();
              navigation.getState().routeNames[0] === 'PDFPlan'
                ? navigation.navigate('Plan', {
                    screen: 'AddNewSubcontractor',
                  })
                : navigation.getState().routeNames[0] === 'Scaner'
                ? navigation.navigate('QR', {
                    screen: 'AddNewSubcontractor',
                  })
                : navigation.navigate('Main', {
                    screen: UserRole.TECHNICIAN,
                    params: {
                      screen: getTab(navigation.getState().routeNames[0]),
                      params: {
                        screen: 'AddNewSubcontractor',
                      },
                    },
                  });
            }}>
            <Text
              style={[
                styles.selectedTextStyle,
                item.labelStyle && {color: item.labelStyle.color},
              ]}>
              {item.name}
            </Text>
            {!item.labelStyle && (
              <CrossSmallIcon color={colors.textSecondColor} />
            )}
          </Pressable>
        ) : (
          <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text style={styles.selectedTextStyle}>{item.name}</Text>
              <Text style={styles.itemSecondText}>
                {item.companyName || ''}
              </Text>
            </View>
            {item.responsibilities.length > 0 && (
              <>
                <Text style={styles.itemSecondText}>Responsibilities:</Text>
                {item.responsibilities && item.responsibilities.length > 0 && (
                  <View style={styles.responsibilities}>
                    {item.responsibilities.map(el => (
                      <View key={el.id} style={styles.responsibilitie}>
                        <FastImage
                          key={el.id}
                          source={
                            item.link
                              ? {uri: item.link}
                              : dropdownIcons[el.name]
                          }
                          style={styles.icon}
                          defaultSource={dropdownIcons[el.name]}
                          resizeMode="cover"
                        />
                        <Text style={styles.responsibilitieText}>
                          {el.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}

            {item.availability && (
              <Text style={styles.itemSecondText}>
                Availability:{' '}
                <Text style={styles.responsibilitieText}>
                  {item.availability}
                </Text>
              </Text>
            )}

            <Text style={styles.itemSecondText}>
              {(item.address, item.state, item.zipCode)}
            </Text>
            {item.approvedByProcurement ? (
              <View style={styles.isApproved}>
                <ApprovedIcon />
                <Text style={[styles.selectedTextStyle, styles.approved]}>
                  Approved by procurement
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    dispatch(
      getSubcontractorsTC({
        customerId,
        page: 1,
        size: 1000,
        sortField: 'name',
        sortDirection: 'ASC',
      }),
    );
  }, []);

  useEffect(() => {
    if (startValue) {
      Array.isArray(startValue)
        ? setSelectedSubcontractors(startValue)
        : setSelectedSubcontractor(startValue);
    }
  }, [startValue]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsVisible(true);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <Text style={styles.title}>Subcontractor</Text>
      {!multiSelect ? (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          containerStyle={styles.containerStyle}
          iconStyle={styles.iconStyle}
          data={subcontractorsArray}
          labelField="name"
          valueField="id"
          placeholder="Select a subcontractor from the list"
          onChange={item => {
            setSelectedSubcontractor(item);
            onChangeSubcontractors && onChangeSubcontractors(item.id);
          }}
          value={selectedSubcontractor}
          renderItem={renderItem}
        />
      ) : (
        isVisible && (
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            containerStyle={styles.containerStyle}
            iconStyle={styles.iconStyle}
            data={subcontractorsArray}
            labelField="name"
            valueField="id"
            placeholder="Select a subcontractor from the list"
            value={selectedSubcontractors}
            onChange={item => {
              setSelectedSubcontractors(item);
              onChangeSubcontractors && onChangeSubcontractors(item);
            }}
            renderItem={renderItem}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                <View style={styles.selectedStyle}>
                  <Text style={styles.textSelectedStyle}>{item.name}</Text>
                  <CrossSmallIcon />
                </View>
              </TouchableOpacity>
            )}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderColor: colors.backgroundGreyColor,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  title: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondColor,
  },
  dropdown: {
    height: 45,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  containerStyle: {
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    paddingTop: 0,
    marginTop: -10,
    borderTopColor: colors.backgroundLightColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  placeholderStyle: {
    fontSize: 14,
    color: colors.textColor,
  },
  selectedTextStyle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textColor,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    color: colors.textColor,
  },
  icon: {
    width: 25,
    height: 25,
    // marginRight: 10,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    gap: 5,
  },
  itemHeader: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSecondText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondColor,
  },
  isApproved: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 5,
  },
  approved: {
    color: '#28A745',
  },

  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    gap: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.mainActiveColor,
    backgroundColor: '#009ef72c',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 14,
    color: colors.mainActiveColor,
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
});
