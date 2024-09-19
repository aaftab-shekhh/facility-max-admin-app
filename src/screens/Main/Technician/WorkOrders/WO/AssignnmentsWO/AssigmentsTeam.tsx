import {FC, useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {MyButton} from '../../../../../../components/MyButton';
import {stylesModal} from '../../../../../../styles/styles';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {DeleteIcon} from '../../../../../../assets/icons/DeleteIcon';
import {colors} from '../../../../../../styles/colors';
import {TechnicianCard} from '../../../../../../components/TechnicianCard';
import {InfoItem} from '../../../../../../components/InfoItem';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {getWObyIdTC} from '../../../../../../bll/reducers/wo-Reducer';
import {UserType} from '../../../../../../types/StateType';
import {woAPI} from '../../../../../../api/woApi';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {AddTeam} from './AddTeam';
import {useOrientation} from '../../../../../../hooks/useOrientation';

type BucketType = {
  WorkOrderBucket: {
    bucketId: string;
    creationDate: string;
    id: string;
    lastUpdateDate: string;
    workOrderId: string;
  };
  id: string;
  name: string;
  availability: string;
  technicians: UserType[];
};

type TeamProps = {
  team: BucketType;
  numColumn: number;
};

export const Team: FC<TeamProps> = ({team, numColumn}) => {
  const dispatch = useAppDispatch();
  const {id} = useAppSelector(state => state.wo.workOrder);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenTeam, setIsOpenTeam] = useState<boolean>(false);
  const [isModalRemoveTeam, setIsModalRemoveTeam] = useState<boolean>(false);

  const totalTimeLogged = useMemo(
    () =>
      team.technicians &&
      team.technicians.reduce(
        (acc, el) =>
          el.WorkOrderTechnician?.hoursSpentTech &&
          acc + el.WorkOrderTechnician?.hoursSpentTech,
        0,
      ),
    [team.technicians],
  );

  const toggleRemoveTeamModal = () => {
    setIsModalRemoveTeam(!isModalRemoveTeam);
  };

  const deleteTeam = async () => {
    try {
      setIsLoading(true);
      await woAPI.deleteBucketFromWO({
        workOrderId: id,
        bucketId: team.id,
      });
      dispatch(
        getWObyIdTC({
          workOrderId: id,
        }),
      );
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => setIsOpenTeam(!isOpenTeam)}
        style={[styles.header, isOpenTeam && styles.headerOpen]}>
        <Text style={styles.headerText}>{team.name}</Text>
        {isOpenTeam ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpenTeam && (
        <View style={{marginHorizontal: 15, marginVertical: 10, gap: 10}}>
          {team.availability && (
            <InfoItem
              title="Availability:"
              text={team.availability}
              hiddeBorder
            />
          )}
          <View style={numColumn === 1 ? styles.column : styles.rowCards}>
            {team.technicians &&
              team.technicians.length > 0 &&
              team.technicians.map(el => (
                <TechnicianCard key={el.id} technician={el} />
              ))}
          </View>
          <MyButton
            text="Remove"
            action={toggleRemoveTeamModal}
            leftIcon={<DeleteIcon fill={colors.deleteColor} />}
            style="primaryRemove"
          />
        </View>
      )}
      <ModalLayout
        toggleModal={toggleRemoveTeamModal}
        isModalVisible={isModalRemoveTeam}
        title="Remove from WO">
        <View>
          {totalTimeLogged ? (
            <Text style={styles.modalText}>
              This team's technicians have logged a total of{' '}
              <Text style={styles.modalTextType}>{totalTimeLogged}</Text> hrs on
              this Work order. If you remove, all of this logged time will be
              deleted.
            </Text>
          ) : (
            <Text style={styles.modalText}>
              Are you sure you want to remove{' '}
              <Text style={styles.modalTextType}>{`${team?.name}`}</Text> team
              from this Work Order?
            </Text>
          )}

          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <MyButton
              action={deleteTeam}
              text={'Remove'}
              style={'remove'}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ModalLayout>
    </View>
  );
};

export const AssignnmentsTeam = () => {
  const {workOrder} = useAppSelector(state => state.wo);
  const {buckets, id: workOrderId} = workOrder;
  const {numColumn, onLayout} = useOrientation();

  const [isModalAddTeam, setIsModalAddTeam] = useState(false);

  const [teams, setTeams] = useState(buckets);

  const toggleAddTeamModal = () => {
    setIsModalAddTeam(!isModalAddTeam);
  };

  const getTech = async () => {
    if (workOrderId) {
      try {
        setTeams(buckets);
        const res = await woAPI.getWOTech({workOrderId});
        setTeams(prev =>
          prev.map(el => ({
            ...el,
            technicians: res.data
              .filter(t => t.technician.buckets.some(b => b.id === el.id))
              .map(t => ({
                ...t.technician,
                WorkOrderTechnician: workOrder.technicians?.find(
                  tech => tech.id === t.technician.id,
                )?.WorkOrderTechnician,
              })),
          })),
        );
      } catch (err) {
        handleServerNetworkError(err?.response?.data);
      }
    }
  };

  useEffect(() => {
    (async () => {
      await getTech();
    })();
  }, [workOrder]);

  return (
    <View
      style={{gap: 10}}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}>
      <Text style={styles.itemTitle}>Technician(s)</Text>
      {teams &&
        teams.length > 0 &&
        teams.map(team => (
          <Team key={team.id} team={team} numColumn={numColumn} />
        ))}
      <MyButton action={toggleAddTeamModal} text="+ Add Team" style="primary" />
      <ModalLayout
        toggleModal={toggleAddTeamModal}
        isModalVisible={isModalAddTeam}
        title="Add Team">
        <AddTeam toggleModal={toggleAddTeamModal} />
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    gap: 10,
    paddingVertical: 10,
    flexGrow: 1,
    paddingHorizontal: 10,
  },
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
  responsibilities: {
    gap: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 0.8,
  },
  responsibilitie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 24,
    height: 24,
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
  modalText: {
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 20,
  },
  modalButtons: {
    position: 'relative',
  },
  modalTextType: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  column: {
    paddingBottom: 10,
    gap: 10,
  },
  row: {
    gap: 25,
    flexDirection: 'row',
  },
  rowCards: {
    gap: 10,
    flexDirection: 'row',
    paddingBottom: 10,
  },
});
