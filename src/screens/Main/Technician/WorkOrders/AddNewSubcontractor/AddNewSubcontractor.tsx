import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import {styleInput, stylesModal} from '../../../../../styles/styles';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../hooks/hooks';
import {DropdownWithLeftIcon} from '../../../../../components/DropdownWithLeftIcon';
import {InputItem} from '../../../../../components/InputItam';
import {createSubcontractorTC} from '../../../../../bll/reducers/wo-Reducer';
import {assetsAPI} from '../../../../../api/assetsApi';
import {DropdownWithSearch} from '../../../../../components/DropdownWithSearch';
import {useFormik} from 'formik';
import {createSubcontractorSchema} from '../../../../../utils/validationSchemes';
import {CreateSubcontractorForm} from '../../../../../types/FormTypes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MaskInput from 'react-native-mask-input';
import {colors} from '../../../../../styles/colors';
import uuid from 'react-native-uuid';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {availabilities, contactTypes} from '../../../../../bll/state';
import {DeleteIcon} from '../../../../../assets/icons/DeleteIcon';

export const AddNewSubcontractor = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {customerId, regionId} = useAppSelector(state => state.user.user);
  // const [regions, setRegions] = useState([]);
  const [responsibilitiesData, setResponsibilitiesData] = useState([]);
  const initialValues = {
    customerId,
    hoursOfOperation: 0,
    emergencyContact: false,
    approvedByProcurement: false,
  } as CreateSubcontractorForm;

  const create = (values: any) => {
    let data = new FormData();
    const {contacts, assetCategoriesId} = values;

    if (contacts) {
      let index = 0;
      for (const contact of contacts) {
        for (const key of Object.keys(contact)) {
          if (key !== 'id') {
            data.append(`contacts[${index}][${key}]`, contact[key]);
          }
        }
        index += 1;
      }
    }

    assetCategoriesId.forEach((id: string) =>
      data.append('assetCategoriesId[]', id),
    );

    for (const el in values) {
      if (el !== 'contacts' && el !== 'assetCategoriesId') {
        data.append(`${el}`, values[el]);
      }
    }
    data.append('regionId', regionId);

    dispatch(createSubcontractorTC({data, navigation}));
  };

  const {
    errors,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
    values,
    submitCount,
  } = useFormik({
    initialValues,
    validationSchema: createSubcontractorSchema,
    onSubmit: create,
    validateOnBlur: true,
  });

  const addContact = () => {
    const id = uuid.v4().toString();
    if (!values.contacts) {
      setFieldValue('contacts', [{id}]);
    } else {
      setFieldValue('contacts', [...values.contacts, {id}]);
    }
  };

  const removeContact = (id: string) => {
    if (values.contacts?.length === 1) {
      setFieldValue('contacts', undefined);
    } else {
      setFieldValue(
        'contacts',
        values.contacts.filter(el => el.id !== id),
      );
    }
  };

  useEffect(() => {
    // (async () => {
    // const res = await regionAPI.getRegionsByCustomerId({
    //   customerId,
    //   page: 1,
    //   size: 100,
    // });
    // setRegions(res.data.rows);
    // })();
    (async () => {
      const res = await assetsAPI.getAssetCategoriesList();
      setResponsibilitiesData(res.data.categories);
    })();
  }, []);

  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* <DropdownWithLeftIcon
        label="Company Name"
        onChange={item => setCompany(item.id)}
        startValue={company}
        data={companies}
      /> */}
        {/* <DropdownWithLeftIcon
        label="Responsibilities"
        onChange={item => setFieldValue('responsibilities', item.id)}
        // startValue={responsibility}
        data={responsibilitiesData}
        error={errors.responsibilities}
        touched={submitCount > 0}
      /> */}

        {/* <InputItem
        label="Company Name"
        defaultValue={values.companyName}
        handleChange={handleChange('companyName')}
        error={errors.companyName}
        touched={submitCount > 0}
        handleBlur={handleBlur('companyName')}
      /> */}
        <InputItem
          label="Company Name"
          defaultValue={values.name}
          handleChange={handleChange('name')}
          error={errors.name}
          touched={submitCount > 0}
          handleBlur={handleBlur('name')}
        />
        <BouncyCheckbox
          size={20}
          style={styles.checkbox}
          fillColor={colors.borderAssetColor}
          innerIconStyle={styles.borderRadius}
          iconStyle={styles.borderRadius}
          textStyle={styles.checkboxText}
          text="Emergency Contact"
          onPress={(isChecked: boolean) => {
            setFieldValue('emergencyContact', isChecked);
          }}
        />
        <BouncyCheckbox
          size={20}
          style={styles.checkbox}
          fillColor={colors.borderAssetColor}
          innerIconStyle={styles.borderRadius}
          iconStyle={styles.borderRadius}
          textStyle={styles.checkboxText}
          text="Approved by procurement"
          onPress={(isChecked: boolean) => {
            setFieldValue('approvedByProcurement', isChecked);
          }}
        />
        <DropdownWithSearch
          label="Responsibilities"
          data={responsibilitiesData}
          onChange={item => setFieldValue('assetCategoriesId', item)}
          multiSelect
          placeholder="Select Responsibilities"
          error={errors.assetCategoriesId}
          touched={submitCount > 0}
        />

        <DropdownWithLeftIcon
          label="Availability"
          onChange={item => setFieldValue('availability', item.name)}
          data={availabilities}
        />
        {/* <DropdownWithLeftIcon
          label="Region"
          onChange={item => setFieldValue('regionId', item.id)}
          data={regions}
          error={errors.regionId}
          touched={submitCount > 0}
        /> */}
        <InputItem
          label="Address"
          handleChange={handleChange('address')}
          error={errors.address}
          touched={submitCount > 0}
        />

        <InputItem
          label="City"
          handleChange={handleChange('city')}
          error={errors.city}
          touched={submitCount > 0}
        />

        {/* <View style={styles.row}> */}
        <InputItem
          label="State"
          handleChange={handleChange('state')}
          error={errors.state}
          touched={submitCount > 0}
        />
        <InputItem
          label="Zip Code"
          handleChange={handleChange('zipCode')}
          error={errors.zipCode}
          touched={submitCount > 0}
        />
        {/* </View> */}

        <InputItem
          label="Hours of Operation"
          numeric
          defaultValue={values.hoursOfOperation}
          handleChange={handleChange('hoursOfOperation')}
          error={errors.hoursOfOperation}
          touched={submitCount > 0}
        />
        <View style={styleInput.inputItem}>
          <Text style={styleInput.label}>Phone</Text>
          <MaskInput
            style={[
              styleInput.input,
              submitCount > 0 && errors.phone && styles.inputError,
            ]}
            value={values.phone}
            onChangeText={masked => {
              setFieldValue('phone', masked);
            }}
            keyboardType="phone-pad"
            mask={[
              '+',
              /\d/,
              ' (',
              /\d/,
              /\d/,
              /\d/,
              ')',
              ' ',
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ]}
          />
          {submitCount > 0 && errors.phone && (
            <View style={[styles.subLabel]}>
              <View style={styles.mark}>
                <Text style={styles.markText}>!</Text>
              </View>
              <Text style={[styleInput.label, styleInput.labelError]}>
                {errors.phone}
              </Text>
            </View>
          )}
        </View>
        <View style={styleInput.inputItem}>
          <Text style={styleInput.label}>
            After hours/emergency phone number
          </Text>
          <MaskInput
            style={[
              styleInput.input,
              submitCount > 0 && errors.afterHoursPhone && styles.inputError,
            ]}
            value={values.afterHoursPhone}
            onChangeText={masked => {
              setFieldValue('afterHoursPhone', masked);
            }}
            keyboardType="phone-pad"
            mask={[
              '+',
              /\d/,
              ' (',
              /\d/,
              /\d/,
              /\d/,
              ')',
              ' ',
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ]}
          />
          {submitCount > 0 && errors.afterHoursPhone && (
            <View style={[styles.subLabel]}>
              <View style={styles.mark}>
                <Text style={styles.markText}>!</Text>
              </View>
              <Text style={[styleInput.label, styleInput.labelError]}>
                {errors.afterHoursPhone}
              </Text>
            </View>
          )}
        </View>
        <View style={[styleInput.inputItem, {gap: 10}]}>
          {values.contacts?.length > 0 &&
            values.contacts?.map(el => (
              <View style={[styles.contactContainer]} key={el.id}>
                <Pressable
                  style={styles.removeContact}
                  hitSlop={15}
                  onPress={() => removeContact(el.id)}>
                  <DeleteIcon />
                </Pressable>
                <DropdownWithLeftIcon
                  label="Contact Type"
                  onChange={item =>
                    setFieldValue(
                      'contacts',
                      values.contacts.map(contact =>
                        contact.id === el.id
                          ? {...contact, type: item.name}
                          : contact,
                      ),
                    )
                  }
                  data={contactTypes}
                />
                <InputItem
                  label="First name"
                  handleChange={value =>
                    setFieldValue(
                      'contacts',
                      values.contacts.map(contact =>
                        contact.id === el.id
                          ? {...contact, firstName: value}
                          : contact,
                      ),
                    )
                  }
                />
                <InputItem
                  label="Last name"
                  handleChange={value =>
                    setFieldValue(
                      'contacts',
                      values.contacts.map(contact =>
                        contact.id === el.id
                          ? {...contact, lastName: value}
                          : contact,
                      ),
                    )
                  }
                />
                <InputItem
                  label="Title"
                  handleChange={value =>
                    setFieldValue(
                      'contacts',
                      values.contacts.map(contact =>
                        contact.id === el.id
                          ? {...contact, title: value}
                          : contact,
                      ),
                    )
                  }
                />
                <View style={styleInput.inputItem}>
                  <Text style={styleInput.label}>Phone number</Text>
                  <MaskInput
                    style={[
                      styleInput.input,
                      // submitCount > 0 && errors.phone && styles.inputError,
                    ]}
                    value={
                      values.contacts?.find(contact => contact.id === el.id)
                        .phone
                    }
                    onChangeText={masked =>
                      setFieldValue(
                        'contacts',
                        values.contacts.map(contact =>
                          contact.id === el.id
                            ? {...contact, phone: masked}
                            : contact,
                        ),
                      )
                    }
                    keyboardType="phone-pad"
                    mask={[
                      '+',
                      /\d/,
                      ' (',
                      /\d/,
                      /\d/,
                      /\d/,
                      ')',
                      ' ',
                      /\d/,
                      /\d/,
                      /\d/,
                      '-',
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                  />
                </View>
                <InputItem
                  label="Email address"
                  handleChange={value =>
                    setFieldValue(
                      'contacts',
                      values.contacts.map(contact =>
                        contact.id === el.id
                          ? {...contact, email: value}
                          : contact,
                      ),
                    )
                  }
                />
              </View>
            ))}
          <Pressable
            style={styles.addContactButton}
            hitSlop={15}
            onPress={addContact}>
            <Text style={[styleInput.label, styles.addContactButtonText]}>
              + Add Contact
            </Text>
          </Pressable>
        </View>

        <InputItem
          label="Note"
          multiline
          handleChange={handleChange('noteText')}
          error={errors.noteText}
          touched={submitCount > 0}
        />
      </KeyboardAwareScrollView>
      <View style={styles.buttons}>
        <Pressable
          style={[stylesModal.modalButton, stylesModal.modalButtonReset]}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text
            style={[
              stylesModal.modalButtonText,
              stylesModal.modalButtonTextReset,
            ]}>
            Cancel
          </Text>
        </Pressable>
        <Pressable
          style={stylesModal.modalButton}
          onPress={() => handleSubmit()}>
          <Text style={stylesModal.modalButtonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginHorizontal: 15,
    paddingBottom: 65,
    gap: 10,
  },
  contactContainer: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 20,
    borderRadius: 8,
    backgroundColor: colors.calendarBsckGround,
  },
  removeContact: {
    // marginTop: 5,
    marginBottom: -15,
    alignSelf: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  addContactButtonText: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.mainActiveColor,
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    marginHorizontal: 15,
    backgroundColor: '#fff0',
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 10,
  },
  inputError: {
    borderColor: colors.deleteColor,
    borderWidth: 0.5,
    borderStyle: 'solid',
    // backgroundColor: colors.errorBackground,
  },
  subLabel: {
    flexDirection: 'row',
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 2,
  },
  mark: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: colors.deleteColor,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: 5,
  },
  markText: {
    color: colors.deleteColor,
    fontSize: 10,
  },
  checkbox: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginVertical: 10,
    // marginLeft: 20,
    marginRight: -10,
  },
  borderRadius: {
    borderRadius: 5,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },
  addContactButton: {
    backgroundColor: '#44B8FF1A',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
});
