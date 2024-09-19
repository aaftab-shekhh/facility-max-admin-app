import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  deletePlanTC,
  editPlanTC,
  getPlanTC,
  setPlan,
} from '../../../../../../bll/reducers/plan-Reducer';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../../hooks/hooks';
import {colors} from '../../../../../../styles/colors';
import {FC, memo, useEffect, useState} from 'react';
import {PlanType} from '../../../../../../types/StateType';
import {dropdownIcons} from '../../../../../../bll/icons';
import FastImage from 'react-native-fast-image';
import {plansAPI} from '../../../../../../api/plansApi';
import {useNetInfo} from '@react-native-community/netinfo';
import {EditIcon} from '../../../../../../assets/icons/EditIcon';
import {DeleteIcon} from '../../../../../../assets/icons/DeleteIcon';
import {SaveIcon} from '../../../../../../assets/icons/SaveIcon';
import {CancelIcon} from '../../../../../../assets/icons/CancelIcon';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {stylesModal} from '../../../../../../styles/styles';

type PlanInTableProps = {
  plan: PlanType;
  onChangeEdit?: () => void;
};

export const PlanInTable: FC<PlanInTableProps> = memo(
  ({plan, onChangeEdit}) => {
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const {plantypes, pdfdocumentsmodel, file} = useAppSelector(
      state => state.local.db,
    );
    const {isConnected} = useNetInfo();

    const [isEditMenu, setIsEditMenu] = useState(false);
    const [isRename, setIsRename] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>(plan.name);
    const [viewDeleteModal, setViewDeleteModal] = useState<boolean>(false);

    const toggleMenu = () => {
      setIsEditMenu(!isEditMenu);
    };

    const toggleDeleteModal = () => {
      setViewDeleteModal(!viewDeleteModal);
    };

    const renamePlan = () => {
      // toggleMenu();
      setIsRename(true);
    };

    const rename = async () => {
      await dispatch(editPlanTC({id: plan.id, name: newName}));
      onChangeEdit && onChangeEdit();
      setIsRename(false);
    };

    const cancel = () => {
      setIsRename(false);
      setNewName(plan.name);
    };

    const deletePlan = async () => {
      await dispatch(deletePlanTC(plan.id));
      onChangeEdit && onChangeEdit();
      toggleDeleteModal();
    };

    const [planTypes, setPlanTypes] = useState([]);

    useEffect(() => {
      !isConnected && plantypes
        ? setPlanTypes(Object.values(plantypes))
        : (async () => {
            const res = await plansAPI.getPlanTypes();
            setPlanTypes(res.data.planTypes);
          })();
    }, [isConnected, plantypes]);

    const planTypeName = planTypes.find(el => el.id === plan.planTypeId)?.name;

    const document = pdfdocumentsmodel && {
      ...Object.values(pdfdocumentsmodel).find(doc => doc.planId === plan?.id),
    };

    const rootFile = file && {
      ...Object.values(file).find(el => el.pdfRootId === document?.id),
    };

    return (
      <>
        <TouchableOpacity
          style={styles.planContainer}
          onPress={() => {
            isConnected
              ? dispatch(getPlanTC(plan.id))
              : dispatch(
                  setPlan({
                    ...plan,
                    document: {...document, rootFile},
                  }),
                );

            navigation.navigate('Plan', {screen: 'PDFPlan'});
          }}>
          <FastImage
            source={plan.link ? {uri: plan.link} : dropdownIcons[planTypeName]}
            style={styles.icon}
            defaultSource={dropdownIcons[planTypeName]}
          />
          {isRename ? (
            <>
              <TextInput
                style={styles.planNameInput}
                onChangeText={setNewName}
                defaultValue={newName && newName}
                autoFocus
              />
              <Pressable onPress={rename} hitSlop={15}>
                <SaveIcon />
              </Pressable>
              <Pressable onPress={cancel} hitSlop={15}>
                <CancelIcon />
              </Pressable>
            </>
          ) : (
            <>
              <Text
                style={styles.planName}
                numberOfLines={1}
                ellipsizeMode="tail">
                {plan.name}
              </Text>
              <TouchableOpacity
                style={{height: 32, justifyContent: 'center'}}
                onPress={renamePlan}
                hitSlop={15}>
                <EditIcon />
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>
        {isEditMenu && (
          <View style={styles.editMenu}>
            <TouchableOpacity style={styles.editMenuItem} onPress={renamePlan}>
              <EditIcon />
              <Text style={styles.editMenuItemText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editMenuItem}
              onPress={toggleDeleteModal}>
              <DeleteIcon />
              <Text style={styles.editMenuItemText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        <ModalLayout
          isModalVisible={viewDeleteModal}
          title="Delete Plan?"
          toggleModal={toggleDeleteModal}>
          <>
            <Text style={styles.modalText}>Text</Text>
            <View style={[stylesModal.modalButtons, styles.modalButtons]}>
              <Pressable
                onPress={deletePlan}
                style={[stylesModal.modalButton, styles.button]}>
                <Text style={stylesModal.modalButtonText}>Delete Plan</Text>
              </Pressable>
            </View>
          </>
        </ModalLayout>
      </>
    );
  },
);

const styles = StyleSheet.create({
  planContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },

  planButton: {
    flexDirection: 'row',
  },

  icon: {
    width: 25,
    height: 25,
  },

  planName: {
    color: colors.textSecondColor,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    flex: 1,
  },

  planNameInput: {
    color: colors.textSecondColor,
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19,
    flex: 1,
  },

  editMenu: {
    alignSelf: 'flex-end',
    position: 'relative',
    // top: 15,
    right: 20,
    zIndex: 5,
    maxWidth: 150,
    minHeight: 65,
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    paddingVertical: 3,
    gap: 5,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  editMenuItem: {
    minWidth: 250,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  editMenuItemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginVertical: 5,
  },
  modalText: {
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 20,
  },
  modalButtons: {
    position: 'relative',
  },
  button: {
    backgroundColor: colors.deleteColor,
    borderColor: colors.deleteColor,
  },
});
