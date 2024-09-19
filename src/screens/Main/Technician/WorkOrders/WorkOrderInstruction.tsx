import {StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from '../../../../hooks/hooks';

export const WorkOrderInstruction = () => {
  const {workOrder} = useAppSelector(state => state.wo);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{workOrder.specialInstructions}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    gap: 10,
  },
  instruction: {
    color: '#202534',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'justify',
  },
});
