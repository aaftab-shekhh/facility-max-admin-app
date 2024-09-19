import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {stylesModal} from '../../../../../../styles/styles';
import {colors} from '../../../../../../styles/colors';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {DeleteIcon} from '../../../../../../assets/icons/DeleteIcon';
import {InfoItem} from '../../../../../../components/InfoItem';
import {dropdownIcons} from '../../../../../../bll/icons';
import {getTab} from '../../../../../../utils/getTab';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {FC, useState} from 'react';
import {useAppNavigation} from '../../../../../../hooks/hooks';
import {AssetType} from '../../../../../../types/StateType';
import {woAPI} from '../../../../../../api/woApi';
import {UserRole} from '../../../../../../enums/user';

type AssetCardProps = {
  asset: AssetType;
  workOrderId: string;
  getWO: () => void;
  numColumn: number;
};

export const AssetCard: FC<AssetCardProps> = ({asset, workOrderId, getWO}) => {
  const navigation = useAppNavigation();

  const [isOpenDeleteModal, setIsDeleteModal] = useState(false);
  const [isLoadingButtons, setIsLoadingButtons] = useState(false);

  const toggleModal = () => setIsDeleteModal(!isOpenDeleteModal);

  const deattach = async () => {
    setIsLoadingButtons(true);
    try {
      await woAPI.deleteAsset({assetId: asset.id, workOrderId});
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      toggleModal();
      getWO();
    }
  };

  return (
    <View style={[styles.assetContainer]}>
      <View style={{flex: 1}}>
        <InfoItem
          title="Asset Name"
          text={asset?.name || '-'}
          hiddeBorder
          isLink
          action={() => {
            navigation.getState().routeNames[0] === 'PDFPlan'
              ? navigation.navigate('Plan', {
                  screen: 'Asset',
                  params: {id: asset!.id},
                })
              : navigation.getState().routeNames[0] === 'Scaner'
              ? navigation.navigate('QR', {
                  screen: 'Asset',
                  params: {id: asset!.id},
                })
              : navigation.navigate('Main', {
                  screen: UserRole.TECHNICIAN,
                  params: {
                    screen: getTab(navigation.getState().routeNames[0]),
                    params: {
                      screen: 'Asset',
                      params: {id: asset!.id},
                    },
                  },
                });
          }}
        />
        <InfoItem
          title="Asset Category"
          text={asset?.category?.name || '-'}
          hiddeBorder
          img={dropdownIcons[asset?.category?.name]}
        />
        <InfoItem
          title="Asset Type"
          text={asset?.types?.name || '-'}
          hiddeBorder
        />
        {asset.floor && (
          <InfoItem title="Floor" text={asset?.floor.name || '-'} hiddeBorder />
        )}
        {asset.room && (
          <InfoItem title="Room" text={asset?.room.name || '-'} hiddeBorder />
        )}
      </View>

      <Pressable style={{padding: 10}} onPress={toggleModal}>
        <DeleteIcon />
      </Pressable>

      <ModalLayout
        isModalVisible={isOpenDeleteModal}
        title="Deattach Asset"
        toggleModal={toggleModal}>
        <>
          <Text style={styles.itemText}>
            Are you sure you want to deattach the asset{' '}
            <Text style={{fontWeight: '600'}}>{asset.name}</Text> from the work
            order?
          </Text>
          <View
            style={[
              stylesModal.modalButtons,
              {position: 'relative', marginTop: 15},
            ]}>
            <Pressable
              style={[stylesModal.modalButton, stylesModal.modalButtonReset]}
              onPress={toggleModal}>
              {isLoadingButtons ? (
                <ActivityIndicator color={colors.bottomActiveTextColor} />
              ) : (
                <Text
                  style={[
                    stylesModal.modalButtonText,
                    stylesModal.modalButtonTextReset,
                  ]}>
                  No
                </Text>
              )}
            </Pressable>
            <Pressable style={stylesModal.modalButton} onPress={deattach}>
              {isLoadingButtons ? (
                <ActivityIndicator color={colors.bottomActiveTextColor} />
              ) : (
                <Text style={stylesModal.modalButtonText}>Yes</Text>
              )}
            </Pressable>
          </View>
        </>
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  assetContainer: {
    flex: 1,
    minWidth: 300,
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    paddingLeft: 12,
    borderRadius: 8,
  },
  itemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
});
