import {FC, useEffect, useState} from 'react';
import {colors} from '../../../../../styles/colors';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {CancelIcon} from '../../../../../assets/icons/CancelIcon';
import {SaveIcon} from '../../../../../assets/icons/SaveIcon';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {updateEmergencyPlan} from '../../../../../bll/reducers/emergency-Reducer';
import {InfoItem} from '../../../../../components/InfoItem';
import moment from 'moment';
import {EmergencyFrequency, EmergencyScenario} from '../../../../../bll/state';

type EmergencyPlanDetailsProps = {
  planId: string;
};

export const EmergencyPlanDetails: FC<EmergencyPlanDetailsProps> = () => {
  const dispatch = useAppDispatch();
  const {
    createdAt,
    name,
    id,
    lastReviewed,
    nextReviewed,
    createdBy,
    frequency,
    scenario,
    description,
  } = useAppSelector(state => state.emergency.emergencyPlan);

  // const {emergencyPlan} = useAppSelector(state => state.emergency);

  const [isRename, setIsRename] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(name);

  const toggleIsRename = () => setIsRename(!isRename);

  const rename = async () => {
    const res = await emergencyAPI.updateNewPlanStep2({
      id,
      name: newName,
    });
    dispatch(updateEmergencyPlan(res.data));
    toggleIsRename();
  };

  const cancel = () => {
    toggleIsRename();
    setNewName(name);
  };

  useEffect(() => {
    setNewName(name);
  }, [name]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.header]}>
        {isRename ? (
          <>
            <TextInput
              style={styles.planNameInput}
              onChangeText={setNewName}
              defaultValue={newName && newName}
              autoFocus
            />
            <View style={styles.saveCancelContainer}>
              <Pressable
                onPress={rename}
                hitSlop={{left: 15, right: 5, top: 15, bottom: 15}}>
                <SaveIcon />
              </Pressable>
              <Pressable
                onPress={cancel}
                hitSlop={{left: 5, right: 15, top: 15, bottom: 15}}>
                <CancelIcon />
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.headerText]}>{newName}</Text>
            {/* <Pressable
              style={styles.editButton}
              onPress={toggleIsRename}
              hitSlop={15}>
              <EditIcon />
            </Pressable> */}
          </>
        )}
      </View>
      <View style={styles.section}>
        <InfoItem
          title={`Created by ${createdBy?.firstName && createdBy?.firstName} ${
            createdBy?.lastName && createdBy?.lastName
          }`}
          text={moment(createdAt).format('MM/DD/YYYY HH:MM A')}
        />
        {lastReviewed && (
          <InfoItem
            title="Last review date:"
            text={moment(lastReviewed).format('MM/DD/YYYY')}
          />
        )}
        {nextReviewed && (
          <InfoItem
            title="Next review date:"
            text={moment(nextReviewed).format('MM/DD/YYYY')}
          />
        )}
        {frequency && (
          <InfoItem title="Frequency" text={EmergencyFrequency[frequency]} />
        )}

        <InfoItem
          title="Scenario category name"
          text={EmergencyScenario.find(el => el.id === scenario)?.name}
        />
        <Text style={styles.itemTitle}>Description/Contingency Details</Text>
        <Text style={styles.itemText}>{description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },
  editButton: {
    height: 32,
    justifyContent: 'center',
  },
  planNameInput: {
    color: colors.textSecondColor,
    textAlignVertical: 'center',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 19,
    flex: 1,
    paddingRight: 10,
  },
  saveCancelContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    gap: 10,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
  },
  itemTitle: {
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  itemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
});
