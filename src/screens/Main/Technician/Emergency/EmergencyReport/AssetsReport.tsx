import {useCallback, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {assetsAPI} from '../../../../../api/assetsApi';
import {
  addOrDeleteAssetTC,
  getReportAssetsTC,
} from '../../../../../bll/reducers/createNewEmergencyReport';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {StyleSheet, Text} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {AssetType} from '../../../../../types/StateType';
import {AddAssets} from '../../../../../components/AddAssets';

export const AssetsReport = () => {
  const dispatch = useAppDispatch();

  const {building} = useAppSelector(
    state => state.createNewEmergencyResport.newEmergencyReport,
  );

  const [selectedAssets, setSelectedAssets] = useState<AssetType[] | null>();

  const [assets, setAssets] = useState([]);

  const getAssets = async () => {
    try {
      const params = {
        buildingIdes: [building.id],
        includeCriteria: [],
      };
      const res = await assetsAPI.getAssetsByAntity(params);
      setAssets(res.data.assets);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
    }
  };

  const getReportAssets = useCallback(async () => {
    try {
      const res = await emergencyAPI.getReportAssets();
      setSelectedAssets(res.data.assets.map(el => el.asset));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
    }
  }, []);

  const onChangeAssets = (items: AssetType[]) => {
    setSelectedAssets(items);
    const assetsForCreate = items.filter(
      id => !selectedAssets?.some(c => id.id === c.id),
    );

    const assetsForDelete = selectedAssets?.filter(
      c => !items.some(i => i.id === c.id),
    );

    assetsForCreate?.forEach(asset => {
      dispatch(
        addOrDeleteAssetTC({
          action: 'add',
          body: {assetId: asset.id},
        }),
      );
    });

    assetsForDelete?.forEach(asset => {
      dispatch(
        addOrDeleteAssetTC({
          action: 'detach',
          body: {assetId: asset.id},
        }),
      );
    });
    dispatch(getReportAssetsTC({}));
  };

  useEffect(() => {
    if (building?.id) {
      getAssets();
    }
  }, [building?.id]);

  useEffect(() => {
    getReportAssets();
  }, []);

  return (
    <>
      {selectedAssets && assets.length > 0 && (
        <>
          <Text style={styles.title}>Asset List</Text>
          <Text style={styles.subTitle}>
            Would you like to specify the equipment associated with this
            emergency?
          </Text>

          <AddAssets
            buildingId={building.id}
            values={selectedAssets}
            onChange={values => {
              onChangeAssets(values);
            }}
            currentCount={selectedAssets?.length || 0}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textSecondColor,
  },
});
