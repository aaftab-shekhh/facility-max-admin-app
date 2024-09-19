import {View} from 'react-native';
import {styleInput} from '../../../../../../../styles/styles';
import {DateTimeInput} from '../../../../../../../components/DateTimeInput';
import {InputItem} from '../../../../../../../components/InputItam';

export const Default = ({
  handleChange,
  errors,
  submitCount,
  setFieldValue,
  values,
}: any) => {
  return (
    <View style={{gap: 10}}>
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
        label="Notes"
        handleChange={handleChange('noteText')}
        multiline
        placeholder="Enter your note..."
        error={errors.noteText}
      />
    </View>
  );
};
