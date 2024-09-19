import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../styles/colors';
import {FC} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AssetAssignment} from '../../Main/Technician/Assets/Asset/AssetAssignment/AssetAssignment';

type AssetAssignmentsType = {
  pageId?: string;
  showOnPlan?: () => void;
};

export const AssetAssignments: FC<AssetAssignmentsType> = ({
  pageId,
  showOnPlan,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1, paddingBottom: insets.bottom}}>
      <View style={styles.container}>
        <Text style={styles.title}>Asset Assignments</Text>
      </View>
      <AssetAssignment pageId={pageId} showOnPlan={showOnPlan} />
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
