import {FlatList, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../styles/colors';
import {FC} from 'react';
import {ActivityWOIcon} from '../../../../assets/icons/activity/ActivityWOIcon';
import {NotFound} from '../../../../components/NotFound';

type ActivityProps = {
  activity: any;
};

const Activity: FC<ActivityProps> = () => {
  return (
    <View style={styles.activityContainer}>
      <View style={styles.header}>
        <ActivityWOIcon />
        <Text style={styles.text}>Work Order #133345</Text>
      </View>
      <Text style={styles.text}>
        <Text style={styles.description}>Description:</Text> 3 New Floor Plans
        Added to Building A - Floor 2
      </Text>
      <Text style={[styles.text, styles.description]}>
        By Technician Name - 4:23 PM D/T of activity
      </Text>
    </View>
  );
};

export const LatestActivity = () => {
  const data = [{}, {}];
  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={({item}) => {
            return <Activity activity={item} />;
          }}
        />
      ) : (
        <NotFound title="Latest activity not found" />
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.backgroundLightColor,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  text: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textColor,
  },

  description: {
    color: colors.textSecondColor,
  },
});
