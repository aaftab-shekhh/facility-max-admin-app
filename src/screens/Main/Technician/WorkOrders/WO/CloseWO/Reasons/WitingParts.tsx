import {View} from 'react-native';
import {InputItem} from '../../../../../../../components/InputItam';
import {DropdownWithLeftIcon} from '../../../../../../../components/DropdownWithLeftIcon';
import {useState} from 'react';
import {DateTimeInput} from '../../../../../../../components/DateTimeInput';
import {AddInventory} from './AddInventory';

export const WitingParts = ({
  handleChange,
  errors,
  submitCount,
  setFieldValue,
  values,
  onChangeInventories,
}: any) => {
  const [isInventory, setIsInventory] = useState('Yes');

  const isInventoryData = [
    {id: 'Yes', name: 'Yes'},
    {id: 'No', name: 'No'},
  ];

  return (
    <View style={{gap: 10}}>
      <DropdownWithLeftIcon
        label="Are the parts currently on hand or in inventory?"
        onChange={item => {
          setIsInventory(item.id);
          onChangeInventories([]);
        }}
        startValue={isInventory}
        data={isInventoryData}
      />
      {isInventory === 'Yes' && (
        <AddInventory onChangeInventories={onChangeInventories} />
      )}
      <InputItem
        label="Location of the part"
        defaultValue={values?.location}
        handleChange={handleChange('location')}
        error={errors.location}
      />

      <InputItem
        label="Change delivery address (optional)"
        defaultValue={values?.deliveryAddress}
        handleChange={handleChange('deliveryAddress')}
        error={errors.deliveryAddress}
      />
      <DateTimeInput
        labelDate="Expected completion Date"
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
      <InputItem
        label="Add notes"
        handleChange={value => setFieldValue('notes', [{text: value}])}
        multiline
        error={errors.notes}
      />
    </View>
  );
};
