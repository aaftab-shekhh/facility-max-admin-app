import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {stylesModal} from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';
import {FC, useCallback, useEffect, useState} from 'react';
import {AddFile} from '../../../../../components/AddFile';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {DropdownWithLeftIcon} from '../../../../../components/DropdownWithLeftIcon';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {ProcedureType} from '../../../../../types/EmergencyTypes';
import {InputItem} from '../../../../../components/InputItam';
import {ProceduresData} from '../../../../../bll/state';
import {sortedBy} from '../../../../../utils/sorted';
import FastImage from 'react-native-fast-image';
import {emergencyProcedureIcons, filesIcons} from '../../../../../bll/icons';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {ActionsButtons} from './ActionsButtons';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {
  attachProcedureForEmergencyPlanTC,
  detachProcedureForEmergencyPlanTC,
} from '../../../../../bll/reducers/createNewEmergencyPlan';

type ProcedureItemProps = {
  isRefresh: boolean;
  procedureItem: {
    id: string;
    name: string;
    title: string;
    icon?: any;
  };
};

const ProcedureItem: FC<ProcedureItemProps> = ({procedureItem, isRefresh}) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsopen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [procedures, setProcedures] = useState<ProcedureType[]>([]);
  const [selectedProcedures, setSelectedProcedures] = useState<ProcedureType[]>(
    [],
  );

  const {newEmergencyPlan} = useAppSelector(
    state => state.createNewEmergencyPlan,
  );

  const togleOpen = () => {
    setIsopen(!isOpen);
  };

  const getProcedures = async () => {
    try {
      setIsLoading(true);
      const res = await emergencyAPI.getProcedures({
        type: procedureItem.id,
        // emergencyPlanId: newEmergencyPlan.id,
      });
      const selectedRes = await emergencyAPI.getProcedures({
        type: procedureItem.id,
        emergencyPlanId: newEmergencyPlan.id,
      });
      setProcedures(res.data.payload);
      setSelectedProcedures(selectedRes.data.payload);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProcedures();
  }, [isRefresh]);

  if (procedures.length) {
    return (
      <View style={stylesItem.container}>
        <Pressable onPress={togleOpen} style={stylesItem.head}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <FastImage
              source={emergencyProcedureIcons[procedureItem.id]}
              style={stylesItem.icon}
              defaultSource={emergencyProcedureIcons[procedureItem.id]}
            />
            <Text style={stylesItem.headTitle}>{procedureItem.title}</Text>
          </View>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Pressable>
        <View style={stylesItem.items}>
          {isOpen && (
            <View style={{gap: 20, paddingVertical: 10}}>
              {procedures &&
                procedures.length > 0 &&
                procedures.map(pr => {
                  // const deleteProcedure = async () => {
                  //   try {
                  //     await emergencyAPI.deleteProcedure(pr.id);
                  //   } catch (err) {
                  //     handleServerNetworkError(err.response.data);
                  //   }
                  // };
                  return (
                    <View key={pr.id} style={stylesItem.procedure}>
                      <FastImage
                        source={filesIcons[pr.mimetype]}
                        style={stylesItem.fileImage}
                      />
                      <BouncyCheckbox
                        key={pr.id}
                        size={20}
                        style={stylesItem.checkbox}
                        fillColor="#44B8FF"
                        disabled={isLoading}
                        innerIconStyle={stylesItem.borderRadius}
                        iconStyle={stylesItem.borderRadius}
                        textStyle={stylesItem.checkboxText}
                        textContainerStyle={stylesItem.textContainerStyle}
                        text={pr.name}
                        isChecked={selectedProcedures?.some(
                          el => el.id === pr.id,
                        )}
                        onPress={() => {
                          !selectedProcedures?.some(el => el.id === pr.id)
                            ? dispatch(
                                attachProcedureForEmergencyPlanTC({
                                  fileId: pr.id,
                                  emergencyPlanId: newEmergencyPlan.id,
                                }),
                              )
                            : dispatch(
                                detachProcedureForEmergencyPlanTC({
                                  fileId: pr.id,
                                  emergencyPlanId: newEmergencyPlan.id,
                                }),
                              );
                          getProcedures();
                        }}
                      />
                      {/* <Menu>
                        <MenuTrigger>
                          <DotsIcon
                            color={colors.backgroundLightColor}
                            fill={colors.textSecondColor}
                          />
                        </MenuTrigger>
                        <MenuOptions
                          customStyles={{
                            optionsContainer: stylesItem.menuOptions,
                          }}>
                          <MenuOption
                            customStyles={{optionWrapper: stylesItem.button}}
                            onSelect={deleteProcedure}>
                            <DeleteIcon fill={colors.deleteColor} />
                            <Text style={stylesItem.buttonText}>Delete</Text>
                          </MenuOption>
                        </MenuOptions>
                      </Menu> */}
                    </View>
                  );
                })}
            </View>
          )}
        </View>
      </View>
    );
  }
};

const stylesItem = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 5,
    borderRadius: 8,
    gap: 10,
    justifyContent: 'center',
    backgroundColor: colors.backgroundLightColor,
  },

  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headTitle: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    textAlignVertical: 'center',
  },
  fileImage: {
    width: 20,
    height: 20,
  },

  procedure: {
    // gap: 15,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuOptions: {
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },

  button: {
    // minWidth: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.deleteColor,
  },

  body: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },

  items: {
    flex: 1,
  },

  checkbox: {
    flex: 1,
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },

  borderRadius: {
    borderRadius: 10,
  },
  textContainerStyle: {
    flex: 1,
  },
  checkboxText: {
    marginLeft: -15,
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textColor,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export const CreateEmergencyStep4 = ({navigation}: any) => {
  const {currentLevel, id} = useAppSelector(
    state => state.createNewEmergencyPlan.newEmergencyPlan,
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
  const [title, setTitle] = useState<string>('');

  const [selectedType, setSelectedType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const closeModal = (): void => {
    toggleModal();
  };

  const createProcedure = useCallback(async () => {
    setIsLoading(true);
    let data = new FormData();

    for (let i = 0; i < files.length; i += 1) {
      data.append('files[]', {
        name: files[i].name || files[i].fileName,
        mimetype: files[i].type,
        uri:
          Platform.OS === 'ios'
            ? files[i].uri?.replace('file://', '')
            : files[i].uri,
      });
    }

    data.append('title', title);
    data.append('type', selectedType);
    data.append('emergencyPlanId', id);

    try {
      await emergencyAPI.createProcedure(data);
      setIsRefresh(!isRefresh);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      closeModal();
      setIsLoading(false);
    }
  }, [files, selectedType, id]);

  useEffect(() => {
    if (!currentLevel) {
      navigation.navigate('CreateEmergencyStep1');
    }
    if (currentLevel === 2) {
      navigation.navigate('CreateEmergencyStep3');
    }
    if (currentLevel === 4) {
      navigation.navigate('CreateEmergencyStep5');
    }
  }, [currentLevel]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 4. Add Response Procedures</Text>
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Text style={styles.headTitle}>Choose Response Procedure</Text>
          <Pressable hitSlop={15} onPress={toggleModal}>
            <Text style={styles.headButtonText}>+ Add File</Text>
          </Pressable>
        </View>
        <View style={{gap: 10}}>
          {ProceduresData.map(procedure => (
            <ProcedureItem
              key={procedure.id}
              procedureItem={procedure}
              isRefresh={isRefresh}
            />
          ))}
        </View>
      </ScrollView>
      <ActionsButtons />
      <ModalLayout
        isModalVisible={isModalVisible}
        toggleModal={() => setModalVisible(false)}
        title="Add file">
        <>
          <KeyboardAwareScrollView
            contentContainerStyle={{gap: 10}}
            style={[stylesModal.modalContainer, styles.modalContainer]}>
            <Text style={styles.modalSubTitle}>
              In which procedure group would you like to add a file?
            </Text>
            <DropdownWithLeftIcon
              data={
                ProceduresData.length ? sortedBy('name', ProceduresData) : []
              }
              startValue={selectedType}
              onChange={item => {
                setSelectedType(item.id);
              }}
              placeholder="Choose Procedure"
            />
            <InputItem label="Title" handleChange={setTitle} />
            <AddFile onChange={setFiles} />
          </KeyboardAwareScrollView>
          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <Pressable
              disabled={isLoading}
              onPress={closeModal}
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
              disabled={isLoading}
              onPress={createProcedure}
              style={stylesModal.modalButton}>
              {isLoading ? (
                <ActivityIndicator color={colors.bottomActiveTextColor} />
              ) : (
                <Text style={stylesModal.modalButtonText}>Confirm</Text>
              )}
            </Pressable>
          </View>
        </>
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: colors.textColor,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    marginVertical: 10,
    paddingHorizontal: 15,
  },

  body: {
    paddingBottom: 55,
    paddingHorizontal: 15,
  },

  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },

  headTitle: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  headButtonText: {
    color: colors.mainActiveColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },

  modalContainer: {
    maxHeight: 500,
  },

  modalSubTitle: {
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },

  modalButtons: {
    position: 'relative',
    // marginTop: 20,
  },
});
