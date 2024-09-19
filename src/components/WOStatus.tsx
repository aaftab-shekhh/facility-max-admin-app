import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/colors';
import {FC} from 'react';
import {enumPriority, enumStatuses} from '../enums/workOrders';

type WOStatusProps = {
  status: string;
};

export const WOStatus: FC<WOStatusProps> = ({status}) => {
  const color = {
    [enumStatuses.ACTIVE]: colors.mainActiveColor,
    [enumStatuses.NEW]: colors.mainActiveColor,
    [enumStatuses.IN_PROGRESS]: '#17A2B8',
    [enumStatuses.ON_HOLD]: '#6C757D',
    [enumStatuses.CANCELLED]: '#6C757D',
    [enumStatuses.PENDING_REVIEW]: '#FFC107',
    [enumStatuses.COMPLETED]: '#28A745',
    [enumPriority.CRITICAL]: colors.criticalPriority,
    [enumPriority.HIGH]: colors.heighPriority,
    [enumPriority.MEDIUM]: colors.mediumPriority,
    [enumPriority.LOW]: colors.lowPriority,
    [enumPriority.SCHEDULED]: colors.scheduledPriority,
    ['Scheduled PM']: colors.scheduledPriority,
  };

  const backgroundColor = {
    [enumStatuses.ACTIVE]: '#1b6bc025',
    [enumStatuses.NEW]: '#1b6bc025',
    [enumStatuses.IN_PROGRESS]: '#17a2b826',
    [enumStatuses.ON_HOLD]: '#6c757d24',
    [enumStatuses.CANCELLED]: '#6c757d24',
    [enumStatuses.PENDING_REVIEW]: '#ffc10723',
    [enumStatuses.COMPLETED]: '#28a74523',
    [enumPriority.CRITICAL]: '#f1416c22',
    [enumPriority.HIGH]: '#ff7e0722',
    [enumPriority.MEDIUM]: '#17a2b826',
    [enumPriority.LOW]: '#6c757d24',
    [enumPriority.SCHEDULED]: '#1b6bc013',
    ['Scheduled PM']: '#1b6bc013',
  };

  return (
    <View style={{borderRadius: 5, backgroundColor: backgroundColor[status]}}>
      <Text
        style={[
          styles.statusText,
          {color: color[status], borderColor: color[status]},
        ]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.mainActiveColor,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.mainActiveColor,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
});
