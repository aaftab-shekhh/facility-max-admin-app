import {View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {
  decrementLevelTC,
  incrementLevelTC,
} from '../../../../../bll/reducers/createNewEmergencyPlan';
import {FC, memo, useState} from 'react';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {stylesModal} from '../../../../../styles/styles';
import {MyButton} from '../../../../../components/MyButton';

type ActionsButtonsProps = {
  disabled?: boolean;
  showMessage?: () => void;
  onChange?: () => void;
};

export const ActionsButtons: FC<ActionsButtonsProps> = memo(
  ({disabled, onChange, showMessage}) => {
    const dispatch = useAppDispatch();
    const {id} = useAppSelector(
      state => state.createNewEmergencyPlan.newEmergencyPlan,
    );

    const [isLoading, setIsLoading] = useState(false);

    const changeStep = async (event: string) => {
      setIsLoading(true);
      onChange && onChange();
      try {
        switch (event) {
          case 'inc':
            await dispatch(incrementLevelTC({id}));
            break;
          case 'dec':
            await dispatch(decrementLevelTC({id}));
            break;
        }
      } catch (err) {
        handleServerNetworkError(err.response.data);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View style={[stylesModal.modalButtons]}>
        <MyButton
          text={'Previous'}
          action={() => {
            changeStep('dec');
          }}
          style="disabled"
          isLoading={isLoading}
          disabled={isLoading}
        />
        <MyButton
          text={'Next'}
          action={() => {
            if (!disabled) {
              changeStep('inc');
            } else if (disabled && showMessage) {
              showMessage();
            }
          }}
          style={'main'}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </View>
    );
  },
);
