import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {memo, useEffect, useMemo, useState} from 'react';
import {stylesModal} from '../../../../../../styles/styles';
import {useFormik} from 'formik';
import {CloseCompleted} from './CloseCompleted';
import {CloseOnHold} from './CloseOnHold';
import {DropdownWithLeftIcon} from '../../../../../../components/DropdownWithLeftIcon';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../../hooks/hooks';
import {
  getWObyIdTC,
  updateWOTC,
} from '../../../../../../bll/reducers/wo-Reducer';
import {
  clearNewAssetsForm,
  createNewAssetsTC,
  replaceAssetsTC,
} from '../../../../../../bll/reducers/newAsset-reducer';
import {enumStatuses} from '../../../../../../enums/workOrders';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {CloseCanceled} from './CloseCanceled';
import {inventoriesAPI} from '../../../../../../api/inventoryApi';
import {MyButton} from '../../../../../../components/MyButton';
import * as yup from 'yup';
import {CloseWorksOrdersProps} from '../../../../../../types/NavTypes/TechnicianNavTypes';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {woAPI} from '../../../../../../api/woApi';
import {convertToBlob} from '../../../../../../utils/convertToBlob';
import {createPDFWODetails} from '../../../../../../utils/createPDFWODetails';

export const closingStatuses = [
  {id: enumStatuses.IN_PROGRESS, name: enumStatuses.IN_PROGRESS},
  {id: enumStatuses.ON_HOLD, name: enumStatuses.ON_HOLD},
  {id: enumStatuses.CANCELLED, name: enumStatuses.CANCELLED},
  {id: enumStatuses.COMPLETED, name: enumStatuses.COMPLETED},
];

export const CloseWorkOrder = memo(({route}: CloseWorksOrdersProps) => {
  const {title, id} = route.params;
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const {workOrder} = useAppSelector(state => state.wo);
  const {newAssets, replacedAssets} = useAppSelector(state => state.newAsset);
  const [inventories, setInventories] = useState<any[]>([]);

  const [isModalSendVisible, setModalSendVisible] = useState(false);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);

  const estimated = useMemo(() => {
    return workOrder.technicians.reduce(
      (acc, el) => {
        return {
          startDate:
            !el.WorkOrderTechnician?.startDateTech ||
            acc.startDate < el.WorkOrderTechnician?.startDateTech
              ? acc.startDate
              : el.WorkOrderTechnician?.startDateTech,
          endDate:
            !el.WorkOrderTechnician?.endDateTech ||
            acc.endDate > el.WorkOrderTechnician?.endDateTech
              ? acc.endDate
              : el.WorkOrderTechnician?.endDateTech,
          hoursSpent: el.WorkOrderTechnician.hoursSpentTech
            ? acc.hoursSpent + el.WorkOrderTechnician.hoursSpentTech
            : acc.hoursSpent,
        };
      },
      {
        startDate: workOrder.startDate || null,
        endDate: workOrder.endDate || null,
        hoursSpent: workOrder.hoursSpent || 0,
      },
    );
  }, [workOrder]);

  const toggleModalSend = () => {
    setModalSendVisible(!isModalSendVisible);
  };

  const subcontractorsForm = useFormik({
    initialValues: {emails: []},
    onSubmit: () => {},
    validateOnBlur: true,
  });

  const initialPartsValues = {
    availableParts: [],
    allocateParts: [],
    newParts: [],
  };

  const partsForm = useFormik({
    initialValues: initialPartsValues,
    onSubmit: () => {},
    validationSchema: yup.object().shape({
      newParts: yup.array().of(
        yup.object().shape({
          manufacturer: yup.string().required('This value can not be blank'),
          manufacturerPartNumber: yup
            .string()
            .required('This value can not be blank'),
          price: yup.number().min(0).required('This value can not be blank'),
        }),
      ),
    }),
  });

  const editWO = async (val: any) => {
    if (
      (!estimated.startDate ||
        !estimated.endDate ||
        estimated.hoursSpent === 0) &&
      val.status === enumStatuses.COMPLETED
    ) {
      handleServerNetworkError({
        message: 'None of the technicians logged time',
      });
      return;
    }
    if (partsForm.values.availableParts.length > 0) {
      partsForm.values.availableParts.forEach(async el => {
        await inventoriesAPI.setAvailable(el, {});
      });
    }

    if (partsForm.values.allocateParts.length > 0) {
      partsForm.values.allocateParts.forEach(async el => {
        await inventoriesAPI.allocateWO(el, {
          workOrderId: workOrder.id,
        });
      });
    }

    let body = new FormData();

    for (let i = 0; i < files.length; i += 1) {
      body.append('noteFiles[]', {
        name: files[i].name || files[i].fileName,
        type: files[i].type,
        uri:
          Platform.OS === 'ios'
            ? files[i].uri?.replace('file://', '')
            : files[i].uri,
      });
    }

    for (let el in val) {
      body.append(`${el}`, val[el]);
    }

    body.append('workOrderId', id);

    try {
      dispatch(updateWOTC(body));

      if (newAssets) {
        dispatch(createNewAssetsTC(newAssets));
      }
      if (replacedAssets) {
        dispatch(replaceAssetsTC(replacedAssets));
      }
      if (inventories && inventories.length > 0) {
        inventories.forEach(async el => {
          await inventoriesAPI.allocateWO(el.id, {
            workOrderId: workOrder.id,
          });
        });
      }
      if (
        val.subcontractorId &&
        subcontractorsForm.values.emails &&
        subcontractorsForm.values.emails.length > 0
      ) {
        const file = await createPDFWODetails(id);

        if (file) {
          const fd = new FormData();

          fd.append('emails[]', subcontractorsForm.values.emails);
          fd.append('file', convertToBlob(file as DocumentPickerResponse));

          await woAPI.sendWODetails(id, fd);
        }
      }
      setModalSendVisible(false);
      navigation.goBack();
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    }
  };

  const totalAdditionalExpenses = useMemo(
    () =>
      workOrder.technicians &&
      workOrder.technicians.reduce((acc, el) => {
        return el?.WorkOrderTechnician?.additionalExpensesTech
          ? acc + el.WorkOrderTechnician.additionalExpensesTech
          : acc;
      }, 0),
    [workOrder.technicians, workOrder],
  );

  const initialValues = {
    status: workOrder?.status,
    additionalExpenses: totalAdditionalExpenses,
  };

  const [validation, setValidation] = useState<any>(yup.object().shape({}));

  const {
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    values,
    setValues,
    submitCount,
    validateForm,
  } = useFormik({
    initialValues,
    validationSchema: validation,
    onSubmit: val => {
      // if (workOrder.subcontractor) {
      //   toggleModalSend();
      // } else {
      editWO(val);
      // }
    },
  });

  const changeStatus = () => {
    switch (values.status) {
      case enumStatuses.COMPLETED:
        return (
          <CloseCompleted
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            values={values}
            setFieldValue={setFieldValue}
            onChangeFile={(value: DocumentPickerResponse[]) => setFiles(value)}
            partsForm={partsForm}
            submitCount={submitCount}
            setValidation={setValidation}
            estimated={estimated}
          />
        );
      case enumStatuses.ON_HOLD:
        return (
          <CloseOnHold
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            setFieldValue={setFieldValue}
            errors={errors}
            values={values}
            submitCount={submitCount}
            onChangeInventories={setInventories}
            subcontractorsForm={subcontractorsForm}
          />
        );
      case enumStatuses.CANCELLED:
        return (
          <CloseCanceled
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            setFieldValue={setFieldValue}
            errors={errors}
            values={values}
          />
        );
    }
  };

  const checkValidation = async () => {
    const mainFormValodate = await validateForm();
    const partsFormValodate = await partsForm.validateForm();

    if (
      !Object.keys(partsFormValodate).length &&
      !Object.keys(mainFormValodate).length
    ) {
      handleSubmit();
    }
  };

  const filteredStatuses = useMemo(() => {
    return closingStatuses;
  }, []);

  useEffect(() => {
    dispatch(clearNewAssetsForm());
  }, [values.status]);

  useEffect(() => {
    if (title) {
      navigation.setOptions({title});
    }
  }, [title]);

  useEffect(() => {
    dispatch(getWObyIdTC({workOrderId: id}));
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          <DropdownWithLeftIcon
            label="Change status"
            onChange={item => {
              setValues(initialValues);
              partsForm.setValues(initialPartsValues);
              setInventories([]);
              setFieldValue('status', item.id);
            }}
            startValue={values.status}
            data={filteredStatuses}
          />
          {changeStatus()}
        </ScrollView>
        <View style={styles.buttons}>
          <MyButton text={'Submit'} action={checkValidation} style="main" />
        </View>
      </KeyboardAvoidingView>
      <ModalLayout
        isModalVisible={isModalSendVisible}
        title="Would you like to send the WO details to subcontractor?"
        toggleModal={() => setModalSendVisible(false)}>
        <View style={stylesModal.modalPickers}>
          <View
            style={[
              stylesModal.modalButtons,
              {position: 'relative', marginHorizontal: 0},
            ]}>
            <MyButton
              text={'Cancel'}
              action={toggleModalSend}
              style="mainBorder"
            />
            <MyButton
              text={'Yes, send'}
              action={() => editWO(values)}
              style="main"
            />
          </View>
        </View>
      </ModalLayout>
      {/* <ModalLayout
          isModalVisible={isModalAskVisible}
          title="Ask for assist"
          toggleModal={toggleModalAsk}>
          <>
            <ScrollView>
              <MyMultipleDropDownPicker
                title="Choose technician (-s) for assist"
                itemsArr={users}
                startValue={selectedUsers}
                onChangeValue={value => setSelectedUsers(value)}
              />
              <InputItem
                label="Notes"
                handleChange={() => {}}
                multiline
                placeholder="Enter your note..."
              />
            </ScrollView>
            <View
              style={[
                stylesModal.modalButtons,
                {position: 'relative', paddingTop: 10},
              ]}>
              <Pressable
                onPress={toggleModalAsk}
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
                onPress={toggleModalAsk}
                style={stylesModal.modalButton}>
                <Text style={stylesModal.modalButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </>
        </ModalLayout> */}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  scroll: {
    gap: 10,
    paddingBottom: 65,
    paddingHorizontal: 15,
  },

  buttons: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 10,
    bottom: 10,
    paddingHorizontal: 15,
  },
});
