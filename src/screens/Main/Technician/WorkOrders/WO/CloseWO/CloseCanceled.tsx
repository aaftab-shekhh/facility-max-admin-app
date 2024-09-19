import {InputItem} from '../../../../../../components/InputItam';

export const CloseCanceled = ({handleChange, errors}: any) => {
  return (
    <InputItem
      label="Cancellation Reason"
      handleChange={handleChange('cancellationReason')}
      multiline
      placeholder="Enter your reason..."
      error={errors.cancellationReason}
    />
  );
};
