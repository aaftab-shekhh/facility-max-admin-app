import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {AddAssetsModal} from '../CreateWO/AddAssetsModal';
import {FC, useState} from 'react';
import {colors} from '../../../../../../styles/colors';
import {AssetType} from '../../../../../../types/StateType';
import {CreateWOForm} from '../../../../../../types/FormTypes';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {woAPI} from '../../../../../../api/woApi';

type AddAssetsToWOProps = {
  buildingId: string;
  workOrderId: string;
  assets?: AssetType[];
  getWO: () => void;
};

export const AddNewAssetsToWO: FC<AddAssetsToWOProps> = ({
  buildingId,
  getWO,
  assets,
  workOrderId,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const setNewAssets = async (newAssets: AssetType[]) => {
    try {
      const assetsForAdd = newAssets
        .filter(newAsset => !assets?.some(a => newAsset.id === a.id))
        .map(el => el.id);

      const assetsForDelete = assets
        ?.filter(asset => !newAssets.some(a => a.id === asset.id))
        .map(el => el.id);

      await woAPI.addAsset({assetsId: assetsForAdd, workOrderId});

      assetsForDelete?.forEach(async assetId => {
        await woAPI.deleteAsset({assetId, workOrderId});
      });
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      getWO();
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>+ Add asset(s)</Text>
      </TouchableOpacity>
      <ModalLayout
        title={'Add Asset'}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <AddAssetsModal
          buildingId={buildingId}
          values={{assetsId: assets} as CreateWOForm}
          onChange={setNewAssets}
          toggleModal={toggleModal}
        />
      </ModalLayout>
    </>
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
    backgroundColor: colors.secondButtonColor,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.mainActiveColor,
  },
});
