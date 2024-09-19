import {
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import {SearchIcon} from '../../../assets/icons/SearchIcon';
import {colors} from '../../../styles/colors';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {sortedBy} from '../../../utils/sorted';
import {FC, RefObject, useCallback, useEffect, useState} from 'react';
import {assetsAPI} from '../../../api/assetsApi';
import {MyButton} from '../../../components/MyButton';
import {ModalLayout} from '../../../components/Layouts/ModalLayout';
import {useFormik} from 'formik';
import {handleServerNetworkError} from '../../../utils/handleServerNetworkUtils';
import {stylesModal} from '../../../styles/styles';
import {InputItem} from '../../../components/InputItam';
import {dropdownIcons} from '../../../bll/icons';
import {DropdownWithLeftIcon} from '../../../components/DropdownWithLeftIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {Group} from '../../../components/AssetObject';

type ManageObjectProps = {
  pageId: string;
  onChangeAssetObgect: (object: any) => void;
  zoomableViewRef?: RefObject<ReactNativeZoomableView>;
  refManageObject?: RefObject<BottomSheetModal>;
};

export const ManageObject: FC<ManageObjectProps> = ({
  pageId,
  onChangeAssetObgect,
  zoomableViewRef,
  refManageObject,
}) => {
  const insets = useSafeAreaInsets();

  const [keyWord, setKeyWord] = useState<string>('');
  const [isViewModalAddObject, setIsViewModalAddObject] = useState(false);

  const [groups, setGroups] = useState([]);

  const getGroups = useCallback(async () => {
    const res = await assetsAPI.getObjectGroups({
      offset: 0,
      limit: 100,
      isIncludeCounts: true,
      pageIdes: [pageId],
      searchString: keyWord !== '' ? keyWord : undefined,
    });
    setGroups(res.data.payload);
  }, [pageId, keyWord]);

  const renderObject: ListRenderItem<any> = ({item}) => {
    return (
      <Group
        group={item}
        pageId={pageId}
        onChangeAssetObgect={onChangeAssetObgect}
        getGroups={getGroups}
        zoomableViewRef={zoomableViewRef}
        refManageObject={refManageObject}
      />
    );
  };

  const [isLoading, setIsLoading] = useState(false);

  const create = useCallback(async (val: any) => {
    setIsLoading(true);
    try {
      await assetsAPI.createAssetObject(val);
      await getGroups();
      setIsViewModalAddObject(false);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initialValues = {pageId} as {
    typeId: string;
    qty: number;
    name: string;
    pageId: string;
  };

  const {handleSubmit, values, setFieldValue, handleChange} = useFormik({
    initialValues,
    onSubmit: create,
  });

  const [types, setTypes] = useState([]);

  const getTypes = async () => {
    const res = await assetsAPI.getTypesAssets({
      offset: 0,
      limit: 1000,
      variant: 'OBJECT',
    });

    setTypes(res.data.types);
  };

  useEffect(() => {
    getGroups();
  }, [pageId, keyWord]);

  useEffect(() => {
    if (isViewModalAddObject) {
      getTypes();
    }
  }, [isViewModalAddObject]);

  return (
    <NativeViewGestureHandler disallowInterruption={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Objects</Text>
        <View style={styles.containerSearch}>
          <View style={styles.inputItem}>
            <SearchIcon />
            <TextInput
              placeholder={'Search for Object Groups'}
              placeholderTextColor={colors.textSecondColor}
              onChangeText={setKeyWord}
              style={styles.input}
            />
          </View>
        </View>
        <BottomSheetFlatList
          data={sortedBy('name', groups)}
          keyExtractor={item => item.id}
          renderItem={renderObject}
          style={[
            styles.flatList,
            {
              marginHorizontal: 0,
              paddingBottom: 15,
              marginBottom: insets.bottom,
            },
          ]}
          contentContainerStyle={styles.contentContainerStyle}
          ListFooterComponent={() => {
            return (
              <MyButton
                text="+ Create new Object"
                action={() => {
                  setIsViewModalAddObject(true);
                }}
              />
            );
          }}
        />
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
                  setFieldValue('typeId', item.id);
                }}
                data={types}
                isIcon
                dropdownIcons={dropdownIcons}
                startValue={values.typeId}
                placeholder="Select a Type"
              />
              <InputItem
                label="How many  would you like to create?"
                handleChange={val => setFieldValue('qty', +val)}
                keyboardType="number-pad"
                defaultValue={values.qty}
              />
              <InputItem
                label="Object group name"
                handleChange={handleChange('name')}
                defaultValue={values.name}
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
                  handleSubmit();
                }}
              />
            </View>
          </>
        </ModalLayout>
      </View>
    </NativeViewGestureHandler>
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
  modalButtons: {
    position: 'relative',
    marginBottom: 10,
    marginTop: 10,
  },
});
