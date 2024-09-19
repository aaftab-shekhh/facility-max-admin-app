import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../styles/colors';
import {FC, useCallback, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../../hooks/hooks';
import moment from 'moment';
import {getStagesTC} from '../../../bll/reducers/plan-Reducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UserType} from '../../../types/StateType';

interface PlanVersionHistoryType {
  setVersion: (value: string) => void;
  version?: string;
}

interface VersionProps extends PlanVersionHistoryType {
  item: {
    createdAt: string;
    createdBy: UserType;
    pdfChildId?: string;
    pdfRootId: string;
    version: number;
  };
}

const Version: FC<VersionProps> = ({item, version, setVersion}) => {
  return (
    <TouchableOpacity
      style={[
        styles.version,
        (version === item.pdfRootId || version === item.pdfChildId) && {
          backgroundColor: colors.backgroundGreyColor,
        },
      ]}
      onPress={() => {
        setVersion(item.pdfChildId || item.pdfRootId);
      }}>
      <View style={styles.versionContainer}>
        <View style={styles.versionSubContainer}>
          <Text style={styles.name}>Version {item.version}</Text>
        </View>
        <View style={styles.versionSubContainer}>
          <View style={styles.versionSubContainer}>
            <Text style={styles.date}>
              {moment(item.createdAt).format('L')}
            </Text>
          </View>
          <View style={styles.versionSubContainer}>
            <Text style={styles.date}>
              {moment(item.createdAt).format('LT')}
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.date, {flex: 1}]}>
        Saved by{' '}
        <Text style={styles.name}>
          {item.createdBy.firstName} {item.createdBy.lastName} (
          {item.createdBy.role})
        </Text>
      </Text>
    </TouchableOpacity>
  );
};

export const PlanVersionHistory: FC<PlanVersionHistoryType> = ({
  setVersion,
  version,
}) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const {stages} = useAppSelector(state => state.plan);

  useEffect(() => {
    if (version) {
      dispatch(getStagesTC(version));
    }
  }, [version]);

  const renderItem: ListRenderItem<any> = useCallback(
    ({item}) => (
      <Version item={item} version={version} setVersion={setVersion} />
    ),
    [stages, version],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View version history</Text>
      <FlatList
        data={stages}
        style={{marginBottom: insets.bottom, paddingTop: 10}}
        renderItem={renderItem}
        contentContainerStyle={[styles.contentContainerStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  contentContainerStyle: {
    backgroundColor: colors.backgroundLightColor,
    paddingVertical: 5,
    borderRadius: 8,
  },
  version: {
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.backgroundGreyColor,
    gap: 8,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    gap: 8,
  },
  versionSubContainer: {
    gap: 8,
    flexDirection: 'row',
  },
  name: {
    color: colors.textColor,
    fontWeight: '500',
  },
  date: {
    color: colors.textSecondColor,
  },
});
