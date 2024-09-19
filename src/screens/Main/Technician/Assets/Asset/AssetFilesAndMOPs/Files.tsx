import {StyleSheet, View} from 'react-native';
import {FC} from 'react';
import {FileItem} from '../../../../../../components/FileItem';
import {FileType} from '../../../../../../types/StateType';

type FieldsProps = {
  files: FileType[];
};

export const Files: FC<FieldsProps> = ({files}) => {
  const renderItem = (item: FileType) => <FileItem key={item.id} file={item} />;

  return <View style={styles.container}>{files.map(renderItem)}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
});
