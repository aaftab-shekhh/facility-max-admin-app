import {FC, memo, useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {stylesModal} from '../../../../../../styles/styles';
import {woAPI} from '../../../../../../api/woApi';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {colors} from '../../../../../../styles/colors';
import FastImage from 'react-native-fast-image';
import CheckBox from '../../../../../../assets/icons/CheckBox';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {getWObyIdTC} from '../../../../../../bll/reducers/wo-Reducer';

type AddTeamProps = {
  toggleModal: () => void;
};

type TeamProps = {
  onPressTeam: (id: string) => void;
  newTeams: string[];
  team: {
    id: string;
    name: string;
    avatar: {
      url: string;
    };
  };
};

const Team: FC<TeamProps> = memo(({team, onPressTeam, newTeams}) => {
  const {buckets} = useAppSelector(state => state.wo.workOrder);
  const disabled = buckets.some(el => el.id === team.id);
  const isChecked = newTeams.some(el => el === team.id);
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => onPressTeam(team.id)}
      style={styles.teamContainer}>
      <View style={styles.teamSubContainer}>
        {disabled ? (
          <CheckBox fill={disabled ? colors.textSecondColor : undefined} />
        ) : isChecked ? (
          <CheckBox />
        ) : (
          <View style={styles.ring} />
        )}
        <FastImage
          style={styles.photo}
          source={
            team.avatar?.url
              ? {
                  uri: team.avatar?.url,
                }
              : require('../../../../../../assets/img/def_ava.png')
          }
          defaultSource={require('../../../../../../assets/img/def_ava.png')}
        />
        <Text>{team.name}</Text>
      </View>
    </TouchableOpacity>
  );
});

export const AddTeam: FC<AddTeamProps> = ({toggleModal}) => {
  const dispatch = useAppDispatch();
  const {customerId} = useAppSelector(state => state.user.user);
  const {id} = useAppSelector(state => state.wo.workOrder);

  const [teams, setTeams] = useState([]);
  const [newTeams, setNewTeams] = useState<string[]>([]);

  const addTeams = async () => {
    try {
      await woAPI.addBucketToWO({workOrderId: id, bucketsId: newTeams});
      dispatch(
        getWObyIdTC({
          workOrderId: id,
        }),
      );
      toggleModal();
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    }
  };

  const onPressTeam = useCallback(
    (id: string) => {
      newTeams.some(el => el === id)
        ? setNewTeams(prev => prev.filter(el => el !== id))
        : setNewTeams(prev => [...prev, id]);
    },
    [newTeams],
  );

  const renderItem: ListRenderItem<any> = useCallback(
    ({item}) => (
      <Team team={item} newTeams={newTeams} onPressTeam={onPressTeam} />
    ),
    [newTeams],
  );

  useEffect(() => {
    (async () => {
      const res = await woAPI.getBucketsList({
        customerId,
        sortField: 'id',
        sortDirection: 'ASC',
        page: 1,
        size: 100,
      });
      setTeams(res.data.rows);
    })();
  }, []);

  return (
    <>
      <FlatList
        data={teams}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatlist}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={[stylesModal.modalButtons, styles.buttons]}>
        <TouchableOpacity
          onPress={toggleModal}
          style={[stylesModal.modalButton, stylesModal.modalButtonReset]}>
          <Text
            style={[
              stylesModal.modalButtonText,
              stylesModal.modalButtonTextReset,
            ]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addTeams} style={stylesModal.modalButton}>
          <Text style={stylesModal.modalButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttons: {
    position: 'relative',
    marginTop: 20,
    marginHorizontal: 0,
  },
  flatListContainer: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 10,
    maxHeight: Dimensions.get('screen').height * 0.65,
  },
  flatlist: {},
  separator: {
    height: 1,
    backgroundColor: colors.backgroundGreyColor,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  teamSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photo: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  ring: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: colors.textSecondColor,
    borderWidth: 1,
    borderStyle: 'solid',
  },
});
