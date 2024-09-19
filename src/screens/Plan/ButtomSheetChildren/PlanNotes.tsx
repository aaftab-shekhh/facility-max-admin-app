import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../styles/colors';
import {Notes} from '../../../components/Notes';
import {FC} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type PlanNotesType = {id: string};

export const PlanNotes: FC<PlanNotesType> = ({id}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{flex: 1, paddingBottom: insets.bottom}}>
      <View style={styles.container}>
        <Text style={styles.title}>Notes</Text>
      </View>
      {id && (
        <View style={{flex: 1}}>
          <Notes entity={'floorPlanPageId'} id={id} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  title: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
});
