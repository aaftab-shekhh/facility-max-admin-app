import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FloorsTable} from './FlorsAndPlans/FloorsTable';

import {stylesModal} from '../../../../../styles/styles';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../hooks/hooks';
import {useNetInfo} from '@react-native-community/netinfo';
import {getTab} from '../../../../../utils/getTab';
import {colors} from '../../../../../styles/colors';
import {useState} from 'react';
import * as yup from 'yup';
import {buildingsAPI} from '../../../../../api/buildingsApi';
import {useFormik} from 'formik';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import {InputItem} from '../../../../../components/InputItam';
import {getFloorsTC} from '../../../../../bll/reducers/buildings-reducer';
import {UserRole} from '../../../../../enums/user';

export const BuildingFlorsAndPlans = () => {
  const {isConnected} = useNetInfo();
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {id: buildingId} = useAppSelector(state => state.buildings.building);

  const [isModalAddFloor, setIsModalAddFloor] = useState<boolean>(false);

  const toggleAddFloor = () => setIsModalAddFloor(!isModalAddFloor);

  const initialValues = {name: '', buildingId, area: 1} as {
    name: string;
    descriptions: string;
    buildingId: string;
    area: number;
  };

  const addFloor = async (val: any) => {
    await buildingsAPI.addFloor(val);
    toggleAddFloor();
    dispatch(
      getFloorsTC({
        buildingId,
        sortField: 'id',
        sortDirection: 'ASC',
        size: 1000,
        page: 1,
      }),
    );
    setValues(initialValues);
  };

  const {
    errors,
    handleChange,
    handleBlur,
    setValues,
    handleSubmit,
    values,
    submitCount,
  } = useFormik({
    initialValues,
    validationSchema: yup.object().shape({
      name: yup.string().required('This value can not be blank'),
      descriptions: yup.string(),
    }),
    onSubmit: val => addFloor(val),
    validateOnBlur: true,
  });

  return (
    <View style={styles.container}>
      <FloorsTable />
      {isConnected && (
        <View style={styles.addPlanButton}>
          <Pressable
            style={[stylesModal.modalButton, styles.addFloor]}
            onPress={toggleAddFloor}>
            <Text style={stylesModal.modalButtonText}>+ {''} Add Floor</Text>
          </Pressable>
          <Pressable
            style={stylesModal.modalButton}
            onPress={() => {
              navigation.navigate('Main', {
                screen: UserRole.TECHNICIAN,
                params: {
                  screen: getTab(navigation.getState().routeNames[0]),
                  params: {
                    screen: 'AddPlan',
                  },
                },
              });
            }}>
            <Text style={stylesModal.modalButtonText}>+ {''} Add New Plan</Text>
          </Pressable>
        </View>
      )}
      <ModalLayout
        toggleModal={toggleAddFloor}
        isModalVisible={isModalAddFloor}
        title="Floor Details">
        <ScrollView style={styles.gap}>
          <InputItem
            label="Name"
            defaultValue={values.name}
            handleChange={handleChange('name')}
            error={errors.name}
            touched={submitCount > 0}
            handleBlur={handleBlur('name')}
          />
          <InputItem
            multiline
            label="Descriptions"
            defaultValue={values.descriptions}
            handleChange={handleChange('descriptions')}
            error={errors.descriptions}
            touched={submitCount > 0}
            handleBlur={handleBlur('descriptions')}
          />
          <View style={[stylesModal.modalButtons, styles.buttons]}>
            <TouchableOpacity
              onPress={toggleAddFloor}
              style={[stylesModal.modalButton, stylesModal.modalButtonReset]}>
              <Text
                style={[
                  stylesModal.modalButtonText,
                  stylesModal.modalButtonTextReset,
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={stylesModal.modalButton}>
              <Text style={stylesModal.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gap: {gap: 10},
  addPlanButton: {
    flexDirection: 'row',
    gap: 20,
    paddingBottom: 10,
    marginHorizontal: 15,
  },
  addFloor: {
    backgroundColor: colors.textSecondColor,
    borderColor: colors.textSecondColor,
  },
  buttons: {
    position: 'relative',
    marginTop: 20,
    marginHorizontal: 0,
  },
});
