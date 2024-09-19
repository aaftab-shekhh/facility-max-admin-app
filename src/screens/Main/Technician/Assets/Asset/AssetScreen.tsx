import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {AssetInventory} from './AssetInventory';
import {AssetDetails} from './AssetDetails/AssetDetails';
import {AssetAssignment} from './AssetAssignment/AssetAssignment';
import {AssetFiles} from './AssetFilesAndMOPs/AssetFiles';
import {AssetPlan} from './AssetPlan.tsx/AssetPlan';
import {HeaderTabNavigation} from '../../../../../components/HeaderTabNavigation';
import {Notes} from '../../../../../components/Notes';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {getAssetTC, setAsset} from '../../../../../bll/reducers/assets-reducer';
import {AssetProps} from '../../../../../types/NavTypes/NavigationTypes';
import {
  AssetGetByEntityAttributes,
  AssetGetByEntityInclude,
} from '../../../../../enums/assets';
import {AssetContractors} from './AssetContractors';
import {AssetHistory} from './AssetsHistory/AssetHistory';
import {AssetWOHistory} from './AssetWOHistory';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';
import {FocusAwareStatusBar} from '../../../../../components/FocusAwareStatusBar';

const nav = [
  {id: 1, mode: 'details', label: 'Details'},
  {id: 2, mode: 'assignments', label: 'Assignments'},
  {id: 3, mode: 'WOHistory', label: 'WO History'},
  {id: 4, mode: 'files', label: 'Files & MOPs'},
  {id: 5, mode: 'plans', label: 'Plans'},
  {id: 6, mode: 'history', label: 'Asset History'},
  {id: 7, mode: 'inventory', label: 'Inventory'},
  {id: 8, mode: 'contractors', label: 'Preferred Contractors'},
  {id: 9, mode: 'notes', label: 'Notes'},
];

const offlineNav = [
  {id: 1, mode: 'details', label: 'Details'},
  {id: 2, mode: 'assignments', label: 'Assignments'},
  {id: 3, mode: 'WOHistory', label: 'WO History'},
  {id: 4, mode: 'files', label: 'Files & MOPs'},
  {id: 5, mode: 'plans', label: 'Plans'},
  {id: 6, mode: 'history', label: 'Asset History'},
  // {id: 7, mode: 'inventory', label: 'Inventory'},
  {id: 8, mode: 'contractors', label: 'Preferred Contractors'},
  {id: 9, mode: 'notes', label: 'Notes'},
];

export const AssetScreen = ({route}: AssetProps) => {
  const {id, tab} = route.params;
  const [mode, setMode] = useState(tab || 'details');
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const {getLocalAssetsById} = useLocalStateSelector();
  const {asset} = useAppSelector(state => state.assets);
  const {asset: localAsset, assetpropsanswer} = useAppSelector(
    state => state.local.db,
  );

  useEffect(() => {
    isConnected
      ? dispatch(
          getAssetTC({
            assetId: id,
            params: {
              includeCriteria: [
                AssetGetByEntityInclude.BUILDING,
                AssetGetByEntityInclude.AVATAR,
                AssetGetByEntityInclude.TYPE,
                AssetGetByEntityInclude.CATEGORY,
                AssetGetByEntityInclude.PROPS,
              ],
              attributeCriteria: Object.values(AssetGetByEntityAttributes),
            },
          }),
        )
      : dispatch(setAsset(getLocalAssetsById(id)));
  }, [id, isConnected, localAsset, assetpropsanswer]);

  const renderMode = () => {
    switch (mode) {
      case 'details':
        return asset?.id && <AssetDetails asset={asset} />;
      case 'assignments':
        return <AssetAssignment />;
      case 'files':
        return <AssetFiles asset={asset} />;
      case 'plans':
        return <AssetPlan asset={asset} />;
      case 'history':
        return (
          <View style={{marginHorizontal: 15}}>
            <AssetHistory id={asset.id} serialNumber={asset.serialNumber} />
          </View>
        );
      case 'inventory':
        return <AssetInventory />;
      case 'contractors':
        return <AssetContractors assetId={id} />;
      case 'WOHistory':
        return <AssetWOHistory />;
      case 'notes':
        return <Notes entity={'assetId'} id={id} />;
    }
  };

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />

      <HeaderTabNavigation
        data={isConnected ? nav : offlineNav}
        mode={mode}
        onChange={setMode}
      />
      {renderMode()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
