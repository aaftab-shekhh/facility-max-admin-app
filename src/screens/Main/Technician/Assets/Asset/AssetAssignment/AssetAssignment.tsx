import {FC, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {stylesModal} from '../../../../../../styles/styles';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {NotFound} from '../../../../../../components/NotFound';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';
import {ListFooterComponent} from './ListFooterComponent';
import {styles} from './styles';
import {AssignmentSection} from './AssignmentSection';
import {deleteModuleItem} from '../../../../../../bll/reducers/local-reducer';
import {setRequest} from '../../../../../../bll/reducers/offline-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../../../../enums/offline';
import {MyButton} from '../../../../../../components/MyButton';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';

type AssetAssignmentProps = {
  pageId?: string;
  showOnPlan?: () => void;
};

export const AssetAssignment: FC<AssetAssignmentProps> = ({
  pageId,
  showOnPlan,
}) => {
  const {isConnected} = useNetInfo();
  const dispatch = useAppDispatch();

  const {id: assetId} = useAppSelector(state => state.assets.asset);
  const {getLocalAssignmentFoldersByAssetId} = useLocalStateSelector();

  const [folders, setFolders] = useState<
    {id: string; name: string; maxNumberOfAssignments: number}[]
  >([]);

  const [isCreateNewPanel, setIsCreateNewPanel] = useState(false);

  const togleCreateNewPanel = () => {
    setIsCreateNewPanel(!isCreateNewPanel);
  };

  const listFooterComponent = () =>
    isCreateNewPanel && (
      <ListFooterComponent
        onChange={newFolder =>
          setFolders(prevState => [...prevState, newFolder])
        }
        togleCreateNewPanel={togleCreateNewPanel}
      />
    );

  const deleteFolder = async (id: string) => {
    try {
      await assetsAPI.deleteFolder(id);
      setFolders(prevState => prevState.filter(panel => panel.id !== id));
    } catch (err: any) {
      handleServerNetworkError(err.response.data);
      console.log('delete folder err ==>>', err.response.data.message);
    }
  };

  const deleteLocalFolder = async (id: string) => {
    const model = 'assignmentfolder';
    dispatch(
      deleteModuleItem({
        model,
        id: id,
      }),
    );
    dispatch(
      setRequest({
        action: OFFLINE_ACTIONS.DELETE_ASSIGNMENT_FOOLDER,
        method: OFFLINE_METHOD.DELETE,
        model,
        id,
        body: id,
      }),
    );
    setFolders(prevState => prevState.filter(panel => panel.id !== id));
  };

  useEffect(() => {
    (async () => {
      if (isConnected) {
        if (assetId) {
          const res = await assetsAPI.getFolders(assetId);
          setFolders(res.data.folders);
        }
      } else {
        setFolders(getLocalAssignmentFoldersByAssetId(assetId));
      }
    })();
  }, [isConnected, assetId]);

  return (
    <View style={styles.assignmentsContainer}>
      <FlatList
        data={folders}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <AssignmentSection
            folder={item}
            deletePanel={isConnected ? deleteFolder : deleteLocalFolder}
            pageId={pageId}
            opened={index === 0}
            showOnPlan={showOnPlan}
          />
        )}
        contentContainerStyle={[styles.flatList]}
        ListEmptyComponent={() => {
          return (
            !isCreateNewPanel && (
              <NotFound title="There are currently no assignments." />
            )
          );
        }}
        ListFooterComponent={listFooterComponent}
      />

      {isCreateNewPanel || pageId ? null : (
        <View style={[stylesModal.modalButtons]}>
          <MyButton
            text="+ Create Asset Assignment"
            action={togleCreateNewPanel}
            style="main"
          />
        </View>
      )}
    </View>
  );
};
