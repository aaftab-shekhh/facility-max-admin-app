import {FC, useCallback, useEffect, useState} from 'react';
import {AssetType} from '../../../../../../types/StateType';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {Files} from './Files';
import {MOPs} from './MOPs';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';
import uuid from 'react-native-uuid';
import {setNewModuleItem} from '../../../../../../bll/reducers/local-reducer';
import {useAppDispatch} from '../../../../../../hooks/hooks';
import {setRequest} from '../../../../../../bll/reducers/offline-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../../../../enums/offline';
import {MyButton} from '../../../../../../components/MyButton';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {AddFileModal} from '../../../../../../components/AddFileModal';

type AssetFilesProps = {
  asset: AssetType;
};

export const AssetFiles: FC<AssetFilesProps> = ({asset}) => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const {getLocalFilesByAssetsId, getLocalMOPSByAssetsId} =
    useLocalStateSelector();

  const [files, setFiles] = useState<any>([]);
  const [mops, setMops] = useState<any>([]);

  const [newFiles, setNewFiles] = useState<any>([]);
  const [newMops, setNewMops] = useState<any>([]);

  const [isOpenFiles, setIsOpenFiles] = useState(false);
  const [isOpenMOPs, setIsOpenMOPs] = useState(false);
  const [isModalVisibleFiles, setIsModalVisibleFiles] = useState(false);
  const [isModalVisibleMops, setIsModalVisibleMops] = useState(false);

  const toggleModalFiles = () => {
    setIsModalVisibleFiles(!isModalVisibleFiles);
  };

  const toggleModalMops = () => {
    setIsModalVisibleMops(!isModalVisibleMops);
  };

  const addFiles = useCallback(async (key: string, response: any) => {
    try {
      for (let i = 0; i < response.length; i += 1) {
        let data = new FormData();

        data.append('files[]', {
          name: response[i].name || response[i].fileName,
          type: response[i].type,
          uri:
            Platform.OS === 'ios'
              ? response[i].uri?.replace('file://', '')
              : response[i].uri,
        });

        data.append('saveKey', key);

        const res = await assetsAPI.addAssetFiles({
          id: asset.id,
          body: data,
        });

        key === 'assetFileId'
          ? setFiles(prev => res.data.savedFiles.concat(prev))
          : setMops(prev => res.data.savedFiles.concat(prev));
        setNewFiles([]);
        setNewMops([]);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const addLocalFiles = async (key: string, response: any) => {
    const model = 'file';

    for (let i = 0; i < response.length; i += 1) {
      let data = new FormData();
      const fileId = uuid.v4().toString();

      data.append('files[]', {
        name: response[i].name,
        type: response[i].type,
        uri:
          Platform.OS === 'ios'
            ? response[i].uri?.replace('file://', '')
            : response[i].uri,
      });

      data.append('saveKey', key);

      const body = {
        createdAt: new Date(),
        createdById: null,
        customerAvatarId: null,
        id: fileId,
        key: response[i].name || response[i].fileName,
        mimetype: response[i].type,
        name: response[i].name || response[i].fileName,
        updatedAt: new Date(),
        url:
          Platform.OS === 'ios'
            ? response[i].uri?.replace('file://', '')
            : response[i].uri,
        assetFileId: key === 'assetFileId' ? asset.id : null,
        assetMopId: key === 'assetMopId' ? asset.id : null,
      };

      dispatch(
        setNewModuleItem({
          model: 'file',
          id: fileId,
          body,
        }),
      );

      dispatch(
        setRequest({
          action: OFFLINE_ACTIONS.ADD_ASSET_FILES,
          method: OFFLINE_METHOD.POST,
          model,
          assetId: asset.id,
          id: fileId,
          body: data,
        }),
      );

      key === 'assetFileId'
        ? setFiles(prev => [body].concat(prev))
        : setMops(prev => [body].concat(prev));
      setNewFiles([]);
      setNewMops([]);
    }
  };

  useEffect(() => {
    if (newFiles.length) {
      isConnected
        ? addFiles('assetFileId', newFiles)
        : addLocalFiles('assetFileId', newFiles);
    }
  }, [newFiles]);

  useEffect(() => {
    if (newMops.length) {
      isConnected
        ? addFiles('assetMopId', newMops)
        : addLocalFiles('assetMopId', newMops);
    }
  }, [newMops]);

  useEffect(() => {
    isConnected
      ? (async () => {
          const resFiles = await assetsAPI.getAssetFiles({
            id: asset.id,
            params: {getKey: 'assetFileId'},
          });
          setFiles(resFiles.data.files);

          const resMops = await assetsAPI.getAssetFiles({
            id: asset.id,
            params: {getKey: 'assetMopId'},
          });
          setMops(resMops.data.files);
        })()
      : (() => {
          setFiles(getLocalFilesByAssetsId(asset.id));
          setMops(getLocalMOPSByAssetsId(asset.id));
        })();
  }, [isConnected]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Pressable
          onPress={() => setIsOpenFiles(!isOpenFiles)}
          style={[styles.header, isOpenFiles && styles.headerOpen]}>
          <Text style={styles.headerText}>Files</Text>
          {isOpenFiles ? (
            <ArrowUpIcon color={colors.textSecondColor} />
          ) : (
            <ArrowDownIcon color={colors.textSecondColor} />
          )}
        </Pressable>
        {isOpenFiles && (
          <View style={{paddingHorizontal: 10}}>
            {files.length > 0 && <Files files={files} />}
            <View style={{height: 42, marginVertical: 10}}>
              <MyButton
                text={'+ Add New File'}
                action={toggleModalFiles}
                style="primary"
              />
            </View>
          </View>
        )}
      </View>
      <View style={styles.section}>
        <Pressable
          onPress={() => setIsOpenMOPs(!isOpenMOPs)}
          style={[styles.header, isOpenMOPs && styles.headerOpen]}>
          <Text style={styles.headerText}>MOP's</Text>
          {isOpenMOPs ? (
            <ArrowUpIcon color={colors.textSecondColor} />
          ) : (
            <ArrowDownIcon color={colors.textSecondColor} />
          )}
        </Pressable>
        {isOpenMOPs && (
          <View style={{paddingHorizontal: 10}}>
            {mops.length > 0 && <MOPs mops={mops} />}
            <View style={{height: 42, marginVertical: 10}}>
              <MyButton
                text={"+ Add MOP's"}
                action={toggleModalMops}
                style="primary"
              />
            </View>
          </View>
        )}
      </View>
      <AddFileModal
        toggleModal={toggleModalFiles}
        isModalVisible={isModalVisibleFiles}
        onChange={setNewFiles}
      />
      <AddFileModal
        toggleModal={toggleModalMops}
        isModalVisible={isModalVisibleMops}
        onChange={setNewMops}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  body: {
    marginBottom: 20,
  },
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },

  leaveButton: {
    height: 42,
    backgroundColor: colors.mainActiveColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  leaveButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },

  modalContainer: {
    maxHeight: 489,
  },

  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },
});
