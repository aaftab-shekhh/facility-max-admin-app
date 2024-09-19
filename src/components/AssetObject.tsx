import {FC, RefObject, useCallback, useEffect, useMemo, useState} from 'react';
import {assetsAPI} from '../api/assetsApi';
import {getPointsByPageIdTC} from '../bll/reducers/point-reducer';
import {DotsIcon} from '../assets/icons/DotsIcon';
import {colors} from '../styles/colors';
import {RemoveAssetIcon} from '../assets/icons/RemoveAssetIcon';
import {DeleteIcon} from '../assets/icons/DeleteIcon';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../bll/icons';
import LocationIcon from '../assets/icons/LocationIcon';
import {ActionsMenu} from './ActionsMenu';
import {ModalLayout} from './Layouts/ModalLayout';
import {stylesModal} from '../styles/styles';
import {GroupType} from '../types/StateType';
import {ArrowUpIcon} from '../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../assets/icons/ArrowDownIcon';
import {sortedBy} from '../utils/sorted';
import {EditIcon} from '../assets/icons/EditIcon';
import {MyButton} from './MyButton';
import {handleServerNetworkError} from '../utils/handleServerNetworkUtils';
import {InputItem} from './InputItam';
import {useFormik} from 'formik';
import {DropdownWithLeftIcon} from './DropdownWithLeftIcon';
import AddToPlanIcon from '../assets/icons/AddToPlanIcon';
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

type AssetObjectProps = {
  getObjects: () => void;
  object: any;
  pageId: string;
  onChangeAssetObgect: (object: any) => void;
  zoomableViewRef?: RefObject<ReactNativeZoomableView>;
  refManageObject?: RefObject<BottomSheetModal>;
};

export const AssetObject: FC<AssetObjectProps> = ({
  getObjects,
  object,
  pageId,
  onChangeAssetObgect,
  zoomableViewRef,
  refManageObject,
}) => {
  const dispatch = useAppDispatch();
  const {points} = useAppSelector(state => state.points);

  const [isViewActionsDeleteQuestion, setIsViewActionsDeleteQuestion] =
    useState(false);

  const deleteObject = async () => {
    await assetsAPI.deleteObjectOrGroup(object.id);
    getObjects();
  };

  const isPlaced = useMemo(
    () => points.some(point => point.fromId === object.id),
    [points, object],
  );

  const removeFromPlan = useCallback(async () => {
    await assetsAPI.deleteObjectPoints({
      pageId,
      fromId: object.id,
    });
    dispatch(
      getPointsByPageIdTC({
        pageId,
        params: {offset: 0, limit: 1000},
      }),
    );
  }, [object.id, pageId]);

  const menuConfig = useMemo(
    () => ({
      menuButton: (
        <DotsIcon
          color={colors.backgroundLightColor}
          fill={colors.textSecondColor}
        />
      ),
      items: [
        {
          icon: isPlaced ? <RemoveAssetIcon /> : <AddToPlanIcon />,
          text: isPlaced ? 'Remove from Plan' : 'Add to Plan',
          action: isPlaced
            ? removeFromPlan
            : () => {
                onChangeAssetObgect(object);
              },
        },
        {
          icon: <DeleteIcon />,
          text: 'Delete',
          action: () => {
            setIsViewActionsDeleteQuestion(true);
          },
        },
      ],
    }),
    [isPlaced],
  );

  return (
    <Pressable key={object.id} style={[styles.assetContainer]}>
      <View style={styles.row}>
        <FastImage
          style={[
            styles.img,
            {position: 'relative'},
            object?.category.color && {backgroundColor: object?.category.color},
          ]}
          source={
            object?.category?.file
              ? {uri: object?.category?.file.url}
              : dropdownIcons[object?.category?.name]
          }
          defaultSource={dropdownIcons[object?.category?.name]}
        />
        <Text style={styles.assetName}>{object.name}</Text>
      </View>
      <View style={styles.row}>
        {isPlaced && (
          <Pressable
            onPress={async () => {
              const assetOnThePlan: any = points.find(
                point => point.fromId === object.id,
              );
              const x = assetOnThePlan?.fromX;
              const y = assetOnThePlan?.fromY;
              zoomableViewRef && (await zoomableViewRef.current?.zoomTo(1));

              x &&
                y &&
                zoomableViewRef &&
                (await zoomableViewRef.current?.moveTo(x, y));
              refManageObject && refManageObject?.current?.collapse();
            }}
            hitSlop={10}>
            <LocationIcon color={colors.borderAssetColor} />
          </Pressable>
        )}
        <ActionsMenu menuConfig={menuConfig} />
      </View>
      <ModalLayout
        title="Delete Asset Object"
        isModalVisible={isViewActionsDeleteQuestion}
        toggleModal={() => {
          setIsViewActionsDeleteQuestion(false);
        }}>
        <>
          <Text style={styles.deleteText}>
            When you delete this object, it will be deleted from the plan on
            which it is located. It will also be removed from all Assignment
            panels of all assets with which it is connected in the system. Are
            you sure?
          </Text>
          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <Pressable
              onPress={() => setIsViewActionsDeleteQuestion(false)}
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
              onPress={deleteObject}
              style={[stylesModal.modalButton, styles.deleteButton]}>
              <Text style={[stylesModal.modalButtonText]}>Delete</Text>
            </Pressable>
          </View>
        </>
      </ModalLayout>
    </Pressable>
  );
};

type GroupProps = {
  pageId: string;
  group: GroupType;
  onChangeAssetObgect: (object: any) => void;
  getGroups: () => void;
  zoomableViewRef?: RefObject<ReactNativeZoomableView>;
  refManageObject?: RefObject<BottomSheetModal>;
};

export const Group: FC<GroupProps> = ({
  group,
  pageId,
  onChangeAssetObgect,
  getGroups,
  zoomableViewRef,
  refManageObject,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewActionsDeleteQuestion, setIsViewActionsDeleteQuestion] =
    useState(false);
  const [isViewEditModal, setIsViewEditModal] = useState(false);
  const [isViewModalAddObject, setIsViewModalAddObject] = useState(false);

  const [objects, setObjects] = useState([]);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const getObjects = useCallback(async () => {
    const res = await assetsAPI.getAssetObjects({
      offset: 0,
      limit: 100,
      isIncludeCounts: true,
      pageIdes: [pageId],
      objectGroupId: group.id,
    });
    setObjects(res.data.payload);
  }, [pageId, group.id]);

  const [types, setTypes] = useState([]);

  const getTypes = async () => {
    const res = await assetsAPI.getTypesAssets({
      offset: 0,
      limit: 1000,
      variant: 'OBJECT',
    });

    setTypes(res.data.types);
  };

  const renderItem = (item: GroupType) => {
    return (
      <AssetObject
        key={item.id}
        object={item}
        getObjects={getObjects}
        pageId={pageId}
        onChangeAssetObgect={onChangeAssetObgect}
        zoomableViewRef={zoomableViewRef}
        refManageObject={refManageObject}
      />
    );
  };

  const menuConfig = useMemo(
    () => ({
      menuButton: (
        <DotsIcon
          color={colors.backgroundLightColor}
          fill={colors.textSecondColor}
        />
      ),
      items: [
        {
          icon: <EditIcon />,
          text: 'Edit',
          action: () => {
            setIsViewEditModal(true);
          },
        },
        {
          icon: <DeleteIcon />,
          text: 'Delete',
          action: () => {
            setIsViewActionsDeleteQuestion(true);
          },
        },
      ],
    }),
    [],
  );

  const save = async val => {
    setIsLoading(true);
    try {
      await assetsAPI.updateGroup(val);
      getGroups();
      setIsViewEditModal(false);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {name: group.name, objectGroupId: group.id} as {
    name: string;
    objectGroupId: string;
  };

  const {handleSubmit, values, handleChange} = useFormik({
    initialValues,
    onSubmit: save,
  });

  const deleteGroup = useCallback(async () => {
    setIsLoading(true);
    try {
      await assetsAPI.deleteObjectOrGroup(group.id);
      getGroups();
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }, [group.id]);

  const create = useCallback(async (val: any) => {
    setIsLoading(true);
    try {
      await assetsAPI.createAssetObject(val);
      await getObjects();
      setIsViewModalAddObject(false);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initValues = {pageId, name: group.name, objectGroupId: group.id} as {
    typeId: string;
    qty: number;
    name: string;
    pageId: string;
    objectGroupId: string;
  };

  const createForm = useFormik({
    initialValues: initValues,
    onSubmit: create,
  });

  useEffect(() => {
    if (isOpen) {
      getObjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isViewModalAddObject) {
      getTypes();
    }
  }, [isViewModalAddObject]);

  return (
    <View style={{flex: 1}}>
      <Pressable style={styles.item} onPress={toggleIsOpen}>
        <View style={[styles.row, {flex: 1}]}>
          <FastImage
            source={
              group.category?.file
                ? {uri: group.category?.file?.url}
                : dropdownIcons[group.category?.name]
            }
            style={[
              styles.icon,
              group.category?.color && {backgroundColor: group.category?.color},
            ]}
            defaultSource={dropdownIcons[group.category?.name]}
          />

          <View style={{flex: 1}}>
            <Text style={styles.itemText}>{group.name}</Text>
            <Text style={styles.itemCountText}>
              {group.objectCount} objects
            </Text>
          </View>
          <ActionsMenu menuConfig={menuConfig} />
        </View>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </Pressable>
      {isOpen && (
        <View style={[styles.flatList]}>
          {sortedBy('name', objects).map(renderItem)}
          <Text
            style={{textAlign: 'center', color: colors.borderAssetColor}}
            onPress={() => {
              setIsViewModalAddObject(true);
            }}>
            + Add Object to Group
          </Text>
        </View>
      )}

      <ModalLayout
        title="Edit Group"
        isModalVisible={isViewEditModal}
        toggleModal={() => {
          setIsViewEditModal(false);
        }}>
        <>
          <ScrollView>
            <InputItem
              label="Object group name"
              handleChange={handleChange('name')}
              defaultValue={values.name}
            />
          </ScrollView>
          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <MyButton
              action={() => setIsViewEditModal(false)}
              text="Cancel"
              style="mainBorder"
            />
            <MyButton
              action={() => {
                handleSubmit();
              }}
              text="Save"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        </>
      </ModalLayout>
      <ModalLayout
        title="Delete Asset Object"
        isModalVisible={isViewActionsDeleteQuestion}
        toggleModal={() => {
          setIsViewActionsDeleteQuestion(false);
        }}>
        <>
          <Text style={styles.deleteText}>
            When you delete this object, it will be deleted from the plan on
            which it is located. It will also be removed from all Assignment
            panels of all assets with which it is connected in the system. Are
            you sure?
          </Text>
          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <MyButton
              action={() => setIsViewActionsDeleteQuestion(false)}
              text="Cancel"
              style="mainBorder"
            />
            <MyButton
              action={deleteGroup}
              text="Delete"
              style="remove"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        </>
      </ModalLayout>
      <ModalLayout
        title="Add Object(s) Group"
        isModalVisible={isViewModalAddObject}
        toggleModal={() => {
          setIsViewModalAddObject(false);
        }}>
        <>
          <ScrollView contentContainerStyle={{gap: 10}}>
            <DropdownWithLeftIcon
              label="Object Type"
              onChange={item => {
                createForm.setFieldValue('typeId', item.id);
              }}
              data={types}
              isIcon
              dropdownIcons={dropdownIcons}
              startValue={createForm.values.typeId}
              placeholder="Select a Type"
            />
            <InputItem
              label="How many  would you like to create?"
              handleChange={val => createForm.setFieldValue('qty', +val)}
              keyboardType="number-pad"
              defaultValue={createForm.values.qty}
            />
          </ScrollView>
          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <MyButton
              text="Cancle"
              style="mainBorder"
              action={() => {
                setIsViewModalAddObject(false);
              }}
            />

            <MyButton
              text="Add"
              disabled={isLoading}
              isLoading={isLoading}
              action={() => {
                createForm.handleSubmit();
              }}
            />
          </View>
        </>
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  subTitle: {
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 21,
  },
  containerSearch: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.backgroundGreyColor,
    borderRadius: 8,
    marginVertical: 8,
  },
  inputItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.backgroundMainColor,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: colors.textColor,
  },
  flatList: {
    marginHorizontal: 15,
    borderRadius: 8,
    paddingVertical: 10,
  },
  contentContainerStyle: {
    paddingVertical: 10,
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
  },
  headerButton: {
    flex: 1,
    marginVertical: 12,
    borderRadius: 10,
  },
  headerButtonActive: {
    backgroundColor: colors.backgroundButtonGreyColor,
  },
  headerButtonText: {
    color: colors.textColor,
    textAlign: 'center',
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    // marginVertical: 3,
  },

  assetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 10,
    gap: 10,
  },
  img: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  assetName: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textColor,
    lineHeight: 20,
  },
  itemCountText: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.textSecondColor,
    lineHeight: 15,
  },
  dotNew: {
    position: 'absolute',
    top: -5,
    left: 18,
    width: 15,
    height: 15,
    backgroundColor: 'red',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.bottomActiveTextColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.bottomActiveTextColor,
  },
  deleteText: {
    marginBottom: 10,
    marginRight: 22,
    marginLeft: 11,
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
  },
  modalButtons: {
    position: 'relative',
    marginBottom: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: colors.deleteColor,
    borderColor: colors.deleteColor,
  },
});
