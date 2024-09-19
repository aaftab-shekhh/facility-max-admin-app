import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import {buildingsAPI} from '../../../../../api/buildingsApi';
import {useAppSelector} from '../../../../../hooks/hooks';
import {useCallback, useEffect, useState} from 'react';
import {NotFound} from '../../../../../components/NotFound';
import {colors} from '../../../../../styles/colors';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {Asset} from 'react-native-image-picker';
import {AddFileModal} from '../../../../../components/AddFileModal';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {SCREEN_WIDTH} from '../../../../../styles/styles';
import {FileType} from '../../../../../types/StateType';
import {FileItem} from '../../../../../components/FileItem';

const size = 20;
const sortField = 'createdAt';
const sortDirection = 'ASC';
const numColumns = Math.floor(SCREEN_WIDTH / 130);

export const BuildingFiles = () => {
  const {id} = useAppSelector(state => state.buildings.building);

  const [files, setFiles] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [isButtonSaveLoading, setButtonSaveLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getFiles = async () => {
    setFiles(
      (
        await buildingsAPI.getBuildingFiles({
          buildingId: id,
          page,
          size,
          sortField,
          sortDirection,
        })
      ).data.rows,
    );
  };

  const renderItem: ListRenderItem<FileType> = useCallback(
    ({item}) => <FileItem file={item} refresh={getFiles} />,
    [],
  );

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const addFile = async (newFiles: DocumentPickerResponse[] | Asset[]) => {
    setButtonSaveLoading(true);
    setIsModalVisible(false);

    let data = new FormData();

    for (let i = 0; i < newFiles.length; i += 1) {
      data.append('files[]', {
        name: newFiles[i].name || newFiles[i].fileName,
        type: newFiles[i].type,
        uri:
          Platform.OS === 'ios'
            ? newFiles[i].uri?.replace('file://', '')
            : newFiles[i].uri,
      });
    }
    data.append('buildingId', id);

    try {
      await buildingsAPI.addBuildingFiles(data);
      getFiles();
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setButtonSaveLoading(false);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <>
      <FlatList
        horizontal={false}
        contentContainerStyle={styles.flatList}
        data={files}
        numColumns={numColumns}
        renderItem={renderItem}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <NotFound title="Images & Files Not Found." />
        )}
      />
      <Pressable style={styles.addButton} onPress={toggleModal}>
        {isButtonSaveLoading ? (
          <ActivityIndicator color={colors.bottomActiveTextColor} />
        ) : (
          <Text style={styles.addButtonText}>+ Add File</Text>
        )}
      </Pressable>
      <AddFileModal
        toggleModal={toggleModal}
        isModalVisible={isModalVisible}
        onChange={dataFiles => {
          addFile(dataFiles);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flexGrow: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingBottom: 70,
    borderRadius: 10,
    gap: 10,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    gap: 10,
    alignSelf: 'flex-start',
  },
  addButton: {
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    bottom: 0,
    height: 42,
    backgroundColor: '#1B6BC0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 2.62,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
});
