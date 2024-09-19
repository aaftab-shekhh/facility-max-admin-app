import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AddAssetsModal} from './AddAssetsModal';
import {FC, useEffect, useState} from 'react';
import {colors} from '../../../../../../styles/colors';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {CrossSmallIcon} from '../../../../../../assets/icons/CrossSmallIcon';
import {AssetType} from '../../../../../../types/StateType';
import {CreateWOForm} from '../../../../../../types/FormTypes';

type AddAssetsToWOProps = {
  buildingId: string;
  values: CreateWOForm;
  assetId?: string;
  onChange: (assets: AssetType[]) => void;
};

export const AddAssetsToWO: FC<AddAssetsToWOProps> = ({
  assetId,
  buildingId,
  values,
  onChange,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [viewAssets, setViewAssets] = useState<AssetType[]>(
    values.assetsId ? values.assetsId : [],
  );

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const deleteAsset = (id: string) => {
    if (id !== assetId) {
      setViewAssets(prev => prev.filter(el => el.id !== id));
    }
  };

  useEffect(() => {
    setViewAssets(values.assetsId ? values.assetsId : []);
  }, [values.assetsId]);

  useEffect(() => {
    onChange(viewAssets);
  }, [viewAssets]);

  return (
    <View style={{gap: 10}}>
      {viewAssets.length > 0 && (
        <>
          <Text style={styles.label}>Assets</Text>
          <View style={styles.selectedAssetsContainer}>
            {viewAssets.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  disabled={assetId === item.id}
                  onPress={() => {
                    assetId !== item.id && deleteAsset(item.id);
                  }}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.textSelectedStyle}>{item.name}</Text>
                    {assetId !== item.id && <CrossSmallIcon />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>+ Add asset(s)</Text>
      </TouchableOpacity>
      <ModalLayout
        title={'Add Asset'}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <AddAssetsModal
          buildingId={buildingId}
          values={values}
          assetId={assetId}
          onChange={(assets: AssetType[]) => {
            setViewAssets(assets);
          }}
          toggleModal={toggleModal}
        />
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: -10,
  },
  selectedAssetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.calendarBsckGround,
    padding: 10,
    borderRadius: 8,
    rowGap: 10,
    columnGap: 7,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    gap: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.mainActiveColor,
    backgroundColor: '#009ef72c',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 14,
    color: colors.mainActiveColor,
  },
  button: {
    backgroundColor: '#44B8FF1A',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.mainActiveColor,
  },
});
