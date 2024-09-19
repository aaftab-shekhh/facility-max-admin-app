import {Text, View} from 'react-native';
import {stylesModal} from '../../../../../../styles/styles';
import {InputItem} from '../../../../../../components/InputItam';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {FC, useState} from 'react';
import {styles} from './styles';
import uuid from 'react-native-uuid';
import {useNetInfo} from '@react-native-community/netinfo';
import {setRequest} from '../../../../../../bll/reducers/offline-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../../../../enums/offline';
import {setNewModuleItem} from '../../../../../../bll/reducers/local-reducer';
import {MyButton} from '../../../../../../components/MyButton';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';

type ListFooterComponentProps = {
  onChange: ({}: {
    id: string;
    name: string;
    data: {id: string; name: string}[];
    maxNumberOfAssignments: number;
  }) => void;
  togleCreateNewPanel: () => void;
};

export const ListFooterComponent: FC<ListFooterComponentProps> = ({
  onChange,
  togleCreateNewPanel,
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderCount, setNewFolderCount] = useState(0);
  const assetId = useAppSelector(state => state.assets.asset.id);
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const [isLoading, setIsLoading] = useState(false);

  const onCheckLimit = (value: string) => {
    const parsedQty = Math.floor(+value);
    if (Number.isNaN(parsedQty)) {
      setNewFolderCount(0);
    } else if (parsedQty > 42) {
      setNewFolderCount(42);
    } else {
      setNewFolderCount(parsedQty);
    }
  };

  const save = async () => {
    try {
      setIsLoading(true);
      const res = await assetsAPI.createFolder({
        assetId,
        name: newFolderName,
        maxNumberOfAssignments: +newFolderCount,
        isCreateEmptyPanels: true,
      });
      onChange(res.data);
      togleCreateNewPanel();
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLocal = () => {
    const id = uuid.v4().toString();
    const body = {
      assetId,
      name: newFolderName,
      maxNumberOfAssignments: +newFolderCount,
    };
    const model = 'assignmentfolder';
    const secondModel = 'assignmentpanel';

    dispatch(
      setRequest({
        action: OFFLINE_ACTIONS.CREATE_ASSIGNMENT_FOOLDER,
        method: OFFLINE_METHOD.POST,
        model,
        id,
        body,
      }),
    );

    dispatch(
      setNewModuleItem({
        model,
        id,
        body,
      }),
    );
    Array.from(new Array(+newFolderCount), (_, index) => ({
      id: uuid.v4().toString(),
      panelNumber: index + 1,
    })).forEach(el => {
      dispatch(
        setNewModuleItem({
          model: secondModel,
          id: el.id,
          body: {
            id: el.id,
            parentId: id,
            panelNumber: el.panelNumber,
            roomId: null,
            assetId: null,
            folderId: id,
            assignmentDetails: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),
      );
    });

    onChange({...body, id, data: []});
    togleCreateNewPanel();
  };

  return (
    <View style={styles.newPanelcontainer}>
      <View style={styles.headerItem}>
        <Text style={styles.headerItemTitle}>The name for tab</Text>
        <View style={styles.headerItemInput}>
          <InputItem
            handleChange={setNewFolderName}
            defaultValue={newFolderName}
          />
        </View>
      </View>
      <View style={styles.headerItem}>
        <Text style={styles.headerItemTitle}>Number of assignments</Text>
        <View style={styles.headerItemInput}>
          <InputItem
            handleChange={onCheckLimit}
            defaultValue={newFolderCount}
            keyboardType={'number-pad'}
          />
        </View>
      </View>
      <View style={[stylesModal.modalButtons, styles.saveButtons]}>
        <MyButton
          text="Cancel"
          action={togleCreateNewPanel}
          style={'mainBorder'}
        />
        <MyButton
          text="Save"
          action={isConnected ? save : saveLocal}
          style={
            newFolderName === '' || newFolderCount === 0 ? 'disabled' : 'main'
          }
          disabled={isLoading || newFolderName === '' || newFolderCount === 0}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};
