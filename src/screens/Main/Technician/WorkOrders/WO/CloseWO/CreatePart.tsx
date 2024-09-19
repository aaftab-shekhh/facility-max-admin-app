import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './CloseCompleted';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {useState} from 'react';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {DeleteIcon} from '../../../../../../assets/icons/DeleteIcon';
import {colors} from '../../../../../../styles/colors';
import {InputItem} from '../../../../../../components/InputItam';

export const CreatePart = ({partsForm, index}) => {
  const [isOpen, setIsOpen] = useState(true);
  const {values, errors} = partsForm;
  return (
    <>
      <View
        style={[
          styles.assetContainer,
          errors?.newParts && {borderColor: colors.deleteColor, borderWidth: 1},
        ]}>
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={[styles.header, isOpen && styles.headerOpen]}>
          <Text style={styles.headerText}>New Inventory Part</Text>
          {isOpen ? (
            <ArrowUpIcon color={colors.textSecondColor} />
          ) : (
            <ArrowDownIcon color={colors.textSecondColor} />
          )}
        </Pressable>
        {isOpen && (
          <>
            <View
              style={[
                styles.assetInfoContainer,
                {
                  paddingBottom: 10,
                  marginHorizontal: 0,
                  backgroundColor: '#fff',
                },
              ]}>
              <View style={{alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    const newItems = [...values?.newParts];
                    newItems.splice(index, 1);
                    partsForm.setFieldValue('newParts', newItems);
                  }}>
                  <DeleteIcon />
                </TouchableOpacity>
              </View>
              <InputItem
                label="Manufacturer *"
                defaultValue={values.newParts[index].manufacturer}
                handleChange={value => {
                  partsForm.setFieldValue('newParts', [
                    ...values?.newParts.map((el, i) =>
                      i === index
                        ? {
                            ...values?.newParts[index],
                            manufacturer: value,
                          }
                        : el,
                    ),
                  ]);
                }}
                backgroundColor={colors.secondInputBackground}
                error={
                  errors?.newParts && errors?.newParts[index]?.manufacturer
                }
                touched
              />
              <InputItem
                label="Manufacturer Part # *"
                defaultValue={values.newParts[index].manufacturerPartNumber}
                handleChange={value => {
                  partsForm.setFieldValue('newParts', [
                    ...values?.newParts.map((el, i) =>
                      i === index
                        ? {
                            ...values?.newParts[index],
                            manufacturerPartNumber: value,
                          }
                        : el,
                    ),
                  ]);
                }}
                backgroundColor={colors.secondInputBackground}
                error={
                  errors?.newParts &&
                  errors?.newParts[index]?.manufacturerPartNumber
                }
                touched
              />
              <InputItem
                numeric
                label="Item cost*"
                defaultValue={values.newParts[index].price}
                handleChange={value => {
                  partsForm.setFieldValue('newParts', [
                    ...values?.newParts.map((el, i) =>
                      i === index
                        ? {
                            ...values?.newParts[index],
                            price: value,
                          }
                        : el,
                    ),
                  ]);
                }}
                backgroundColor={colors.secondInputBackground}
                error={errors?.newParts && errors?.newParts[index]?.price}
                touched
              />
            </View>
          </>
        )}
      </View>
    </>
  );
};
