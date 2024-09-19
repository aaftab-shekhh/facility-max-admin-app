import {Pressable, StyleSheet, Text, View} from 'react-native';
import {FC} from 'react';
import {colors} from '../../../../../styles/colors';
import {EmergencyType} from '../../../../../types/StateType';

type EmergancyTypeCardType = {
  emergency: EmergencyType;
  value: string;
  onChange: (value: string) => void;
};
export const EmergencyTypeCard: FC<EmergancyTypeCardType> = ({
  emergency,
  value,
  onChange,
}) => {
  return (
    <Pressable
      onPress={() => onChange(emergency.value)}
      style={styles.container}>
      <View style={styles.icon}>{emergency.image}</View>
      <View style={styles.header}>
        <Text style={styles.title}>{emergency.name}</Text>
        <Text style={styles.description}>{emergency.description}</Text>
      </View>
      <View style={styles.checkBoxContainer}>
        <View
          style={[
            styles.checkBox,
            value === emergency.value && styles.checkBoxChecked,
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 15,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  icon: {},
  header: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#202534',
  },
  description: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#6C757D',
  },
  checkBoxContainer: {
    justifyContent: 'center',
  },
  checkBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.textSecondColor,
  },
  checkBoxChecked: {
    backgroundColor: colors.mainActiveColor,
    borderColor: colors.mainActiveColor,
  },
});
