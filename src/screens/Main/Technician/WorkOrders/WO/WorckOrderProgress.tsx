import {FlatList, ListRenderItem, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {useAppSelector} from '../../../../../hooks/hooks';
import moment from 'moment';

export const WorckOrderProgress = () => {
  const {workOrderStatuses} = useAppSelector(state => state.wo.workOrder);
  const renderItem: ListRenderItem<any> = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row', gap: 20}}>
        <View
          style={[
            styles.dotContainer,
            {
              backgroundColor:
                index === workOrderStatuses.length - 1
                  ? colors.mainActiveColor
                  : colors.textColor,
            },
          ]}>
          <View style={[styles.dot]} />
        </View>
        <View style={styles.step}>
          <Text
            style={[
              styles.title,
              {
                color:
                  index === workOrderStatuses.length - 1
                    ? colors.mainActiveColor
                    : colors.textColor,
              },
            ]}>
            {item.status}
          </Text>
          <Text style={styles.dateText}>
            {moment(item.creationDate).format('L LT')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={workOrderStatuses}
      renderItem={renderItem}
      contentContainerStyle={{paddingHorizontal: 30, paddingTop: 10}}
      ItemSeparatorComponent={() => <View style={styles.line} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    flex: 1,
  },
  step: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dotContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 7,
    // top: 5,
    backgroundColor: colors.bottomActiveTextColor,
  },
  line: {
    position: 'absolute',
    top: 18,
    height: '100%',
    width: 2,
    backgroundColor: colors.textColor,
    left: 9,
  },
  title: {
    color: colors.textColor,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  dateText: {
    color: colors.textSecondColor,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
  },
  bold: {
    color: colors.textColor,
    marginHorizontal: 10,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
  text: {
    fontSize: 16,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    margin: 10,
    color: colors.textSecondColor,
  },
});
