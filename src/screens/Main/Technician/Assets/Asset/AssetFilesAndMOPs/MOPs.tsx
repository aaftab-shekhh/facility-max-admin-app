import {StyleSheet, View} from 'react-native';
import {FC} from 'react';
import {FileItem} from '../../../../../../components/FileItem';
import {FileType} from '../../../../../../types/StateType';

type MOPsProps = {
  mops: FileType[];
};

export const MOPs: FC<MOPsProps> = ({mops}) => {
  const renderItem = (item: FileType) => <FileItem key={item.id} file={item} />;

  return (
    <View style={styles.container}>{mops.map(item => renderItem(item))}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
});
