import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {colors} from '../../../../../styles/colors';
import {FC, useEffect, useState} from 'react';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {EmergencyPlanCard} from '../EmergencyPlans/EmergencyPlans';

type RelatedPlansProps = {
  status: string;
  title: string;
};

export const RelatedPlans: FC<RelatedPlansProps> = ({status, title}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await emergencyAPI.getEmergencyReportPlans({status});
      setPlans(res.data.payload);
    })();
  }, []);

  return (
    <>
      {plans.length > 0 && (
        <View style={styles.section}>
          <Pressable
            onPress={() => setIsOpen(!isOpen)}
            style={[styles.header, isOpen && styles.headerOpen]}>
            <Text style={styles.headerText}>{title}</Text>
            {isOpen ? (
              <ArrowUpIcon color={colors.textSecondColor} />
            ) : (
              <ArrowDownIcon color={colors.textSecondColor} />
            )}
          </Pressable>
          {isOpen && (
            <View style={styles.sectionContainer}>
              {plans.map(el => (
                <EmergencyPlanCard key={el.id} emergencyPlan={el} />
              ))}
            </View>
          )}
        </View>
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },
  sectionContainer: {
    padding: 10,
    gap: 10,
  },
});
