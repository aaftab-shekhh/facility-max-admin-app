import {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {EditDetails} from './EditDetails';
import {InfoItems} from './InfoItems';

import {AssetType} from '../../../../../../types/StateType';

type AssetDetailsProps = {
  asset: AssetType;
};

export const AssetDetails: FC<AssetDetailsProps> = ({asset}) => {
  const [isEdit, setIsEdit] = useState(false);

  const togleEdit = () => setIsEdit(!isEdit);

  return (
    <View style={styles.container}>
      {!isEdit ? (
        <InfoItems asset={asset} setIsEdit={togleEdit} />
      ) : (
        <EditDetails setIsEdit={togleEdit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  revers: {flexDirection: 'column-reverse'},
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  photo: {
    height: 180,
    width: '100%',
    borderRadius: 10,
  },
});
