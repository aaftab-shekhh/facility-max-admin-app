import {ScrollView, StyleSheet} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {colors} from '../../styles/colors';
import {PlanNavButton} from './PlanNavButton';
import {getPlanTC, setPlan} from '../../bll/reducers/plan-Reducer';
import {FC, memo, useEffect, useState} from 'react';
import {PlanNavButtonPlans} from './PlanNavButtonPlans';
import {PlanNavButtonPages} from './PlanNavButtonPages';
import {sortedBy} from '../../utils/sorted';
import {useNetInfo} from '@react-native-community/netinfo';
import {View} from 'react-native';

type PlanNavProps = {
  version?: string;
  setVersion: (value: string) => void;
};

export const PlanNav: FC<PlanNavProps> = memo(({version, setVersion}) => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const {floors} = useAppSelector(state => state.buildings);

  const {plan} = useAppSelector(state => state.plan);

  const {
    pdfdocumentsmodel,
    file,
    plan: localPlan,
  } = useAppSelector(state => state.local.db);

  const {floorId} = plan && plan;

  const [floor, setFloor] = useState(floors.find(el => el.id === floorId));
  const [plans, setPlans] = useState(floor?.floorPlans);

  const openNewPlan = (planId: string) => {
    const newPlan = localPlan[planId];
    const document = {
      ...Object.values(pdfdocumentsmodel || {}).find(
        doc => doc.planId === planId,
      ),
    };
    const rootFile = {
      ...Object.values(file || {}).find(el => el.pdfRootId === document.id),
    };

    dispatch(
      setPlan({
        ...newPlan,
        document: {...document, rootFile},
      }),
    );
  };

  const setSourcePlan = (selectedPlanId: string) => {
    isConnected
      ? dispatch(getPlanTC(selectedPlanId))
      : openNewPlan(selectedPlanId);
  };

  useEffect(() => {
    setFloor(floors.find(el => el.id === floorId));
    setVersion(plan?.document?.id);
  }, [plan]);

  useEffect(() => {
    setPlans(floor?.floorPlans);
  }, [floor]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.subContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        <PlanNavButton
          dropdownItems={sortedBy('name', floors)}
          placeholder={floor?.name}
          onChange={setSourcePlan}
        />
        <PlanNavButtonPlans
          dropdownItems={plans ? sortedBy('name', plans) : []}
          placeholder={plan?.name}
          onChange={setSourcePlan}
        />
        <PlanNavButtonPages onChangePage={setVersion} version={version} />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.headerColor,
    flexDirection: 'row',
  },
  subContainer: {
    marginRight: 25,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    gap: 10,
  },

  itemText: {
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
});
