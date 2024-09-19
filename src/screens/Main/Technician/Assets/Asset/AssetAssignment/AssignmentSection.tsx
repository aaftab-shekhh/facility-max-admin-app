import {useNetInfo} from '@react-native-community/netinfo';
import {FC, useEffect, useState} from 'react';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {Pressable, Text, View} from 'react-native';
import {styles} from './styles';
import {EditIcon} from '../../../../../../assets/icons/EditIcon';
import {DeleteIcon} from '../../../../../../assets/icons/DeleteIcon';
import {DotsIcon} from '../../../../../../assets/icons/DotsIcon';
import {colors} from '../../../../../../styles/colors';
import {stylesModal} from '../../../../../../styles/styles';
import {InputItem} from '../../../../../../components/InputItam';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {Panel, PanelType} from './Panel';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {setNewModuleItem} from '../../../../../../bll/reducers/local-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../../../../enums/offline';
import {setRequest} from '../../../../../../bll/reducers/offline-reducer';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

type AssignmentSection = {
  folder: {id: string; name: string; maxNumberOfAssignments: number};
  deletePanel: (id: string) => void;
  pageId?: string;
  opened?: boolean;
  showOnPlan?: () => void;
};

export const AssignmentSection: FC<AssignmentSection> = ({
  folder,
  deletePanel,
  pageId,
  opened,
  showOnPlan,
}) => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const {getLocalAssignmentPanelsByFolderId} = useLocalStateSelector();
  const {requests} = useAppSelector(state => state.offline);

  const [isOpen, setIsOpen] = useState(opened);
  const [isEdit, setIsEdit] = useState(false);

  const [newName, setNewName] = useState(folder.name);
  const [panels, setPanels] = useState<PanelType[]>([]);

  const getPanels = async () => {
    const res = await assetsAPI.getPanels(folder.id);

    setPanels(res.data.panels);
  };

  const save = async () => {
    await assetsAPI.updateFolder(
      {name: newName, maxNumberOfAssignments: folder.maxNumberOfAssignments},
      folder.id,
    );
    setIsEdit(false);
  };

  const newFolder = requests.find(
    el =>
      el.id === folder.id &&
      el.action === OFFLINE_ACTIONS.CREATE_ASSIGNMENT_FOOLDER,
  );

  const saveLocal = async () => {
    const model = 'assignmentfolder';
    const id = folder.id;

    dispatch(
      setNewModuleItem({
        model,
        id: folder.id,
        body: {...folder, name: newName, updatedAt: new Date().toISOString()},
      }),
    );

    newFolder
      ? dispatch(
          setRequest({...newFolder, body: {...newFolder.body, name: newName}}),
        )
      : dispatch(
          setRequest({
            action: OFFLINE_ACTIONS.UPDATE_ASSIGNMENT_FOOLDER,
            method: OFFLINE_METHOD.PUT,
            model,
            id,
            body: {
              name: newName,
              maxNumberOfAssignments: folder.maxNumberOfAssignments,
            },
          }),
        );
    setIsEdit(false);
  };

  const getLocalPanels = () => {
    setPanels(getLocalAssignmentPanelsByFolderId(folder.id));
  };

  useEffect(() => {
    if (isOpen) {
      isConnected ? getPanels() : getLocalPanels();
    }
  }, [isOpen, isConnected]);

  return (
    <View style={styles.section}>
      <>
        <View style={[styles.header, isOpen && styles.headerOpen]}>
          <View style={styles.title}>
            <Text style={styles.headerText}>{newName}</Text>
            {!pageId && (
              <Menu>
                <MenuTrigger>
                  <DotsIcon color={colors.calendarBsckGround} />
                </MenuTrigger>
                <MenuOptions
                  customStyles={{optionsContainer: styles.menuOptions}}>
                  <MenuOption
                    customStyles={{optionWrapper: styles.button}}
                    onSelect={() => {
                      setIsEdit(true);
                    }}>
                    <EditIcon />
                    <Text style={styles.buttonText}>Edit</Text>
                  </MenuOption>
                  <MenuOption
                    customStyles={{optionWrapper: styles.button}}
                    onSelect={() => {
                      deletePanel(folder.id);
                    }}>
                    <DeleteIcon />
                    <Text style={styles.buttonText}>Delete</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            )}
          </View>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <ArrowUpIcon color={colors.textSecondColor} />
            ) : (
              <ArrowDownIcon color={colors.textSecondColor} />
            )}
          </Pressable>
        </View>
        {isEdit && (
          <View style={{gap: 10, padding: 10}}>
            <InputItem
              label={'The name for Tab'}
              handleChange={setNewName}
              defaultValue={newName}
              backgroundColor={colors.secondInputBackground}
            />
          </View>
        )}
      </>
      {isOpen && (
        <View style={styles.container}>
          <View style={styles.tableContainer}>
            {panels.map(item => {
              return (
                <Panel
                  key={item.id}
                  panel={item}
                  update={isConnected ? getPanels : getLocalPanels}
                  pageId={pageId}
                  showOnPlan={showOnPlan}
                />
              );
            })}
          </View>
        </View>
      )}
      {isEdit && (
        <View
          style={[
            stylesModal.modalButtons,
            styles.saveButtons,
            {marginHorizontal: 15},
          ]}>
          <Pressable
            onPress={() => {
              setNewName(folder.name);
              setIsEdit(false);
            }}
            style={[stylesModal.modalButton, stylesModal.modalButtonReset]}>
            <Text
              style={[
                stylesModal.modalButtonText,
                stylesModal.modalButtonTextReset,
              ]}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={isConnected ? save : saveLocal}
            style={stylesModal.modalButton}>
            <Text style={stylesModal.modalButtonText}>Save</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
