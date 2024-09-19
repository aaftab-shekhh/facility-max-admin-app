import {ArrowBackIcon} from '../../../../../../assets/icons/ArrowBackIcon';
import {colors} from '../../../../../../styles/colors';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {CreateWOStep1} from './CreateWOStep1';
import {CreateWOStep3} from './CreateWOStep3';
import {CreateWOStep2} from './CreateWOStep2';
import {FocusAwareStatusBar} from '../../../../../../components/FocusAwareStatusBar';
import {useCallback, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createWOSchema} from '../../../../../../utils/validationSchemes';
import {CreateWOForm} from '../../../../../../types/FormTypes';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../../hooks/hooks';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {createWOTC} from '../../../../../../bll/reducers/wo-Reducer';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {useFormik} from 'formik';
import {
  WorkOrderManyAttributeKeys,
  WorkOrderManyIncludeKeys,
  enumPriority,
  enumStatuses,
  enumTypeWO,
} from '../../../../../../enums/workOrders';
import {MyButton} from '../../../../../../components/MyButton';
import {CreateWorkOrderProps} from '../../../../../../types/NavTypes/TechnicianNavTypes';
import {OrderType} from '../../../../../../types/StateType';
import {woAPI} from '../../../../../../api/woApi';
import {WorkOrderCard} from '../WorkOrderCard/WorcOrderCard';
import {ModalLayout} from '../../../../../../components/Layouts/ModalLayout';
import {SCREEN_HEIGHT, stylesModal} from '../../../../../../styles/styles';
import {GetWOsParams} from '../../../../../../api/ApiTypes';
import {createPDFWODetails} from '../../../../../../utils/createPDFWODetails';
import {convertToBlob} from '../../../../../../utils/convertToBlob';

const attributeCriteria = Object.values(WorkOrderManyAttributeKeys);
const includeCriteria = [
  WorkOrderManyIncludeKeys.asset,
  WorkOrderManyIncludeKeys.technicians,
  WorkOrderManyIncludeKeys.bucket,
];

export const CreateWORoot = ({route}: CreateWorkOrderProps) => {
  const assetId = route?.params?.assetId;
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const {asset} = useAppSelector(state => state.assets);
  const {customerId} = useAppSelector(state => state.user.user);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalDublicatesVisible, setIsModalDublicatesVisible] =
    useState(false);

  const toggleModalDublicates = useCallback(() => {
    setIsModalDublicatesVisible(!isModalDublicatesVisible);
  }, [isModalDublicatesVisible]);

  const [dublicates, setDublicates] = useState<OrderType[]>([]);

  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);

  const subcontractorsForm = useFormik({
    initialValues: {emails: []},
    onSubmit: () => {},
    validateOnBlur: true,
  });

  const checkSubType = () => {
    if (values.subType) {
      setStep(prev => prev + 1);
    }
  };

  const incStep = () => {
    if (step === 1 && values.type) {
      if (
        values.type === enumTypeWO.RECURRING_MAINTENANCE ||
        values.type === enumTypeWO.SERVICE_REQUEST ||
        values.type === enumTypeWO.ACCESS_CONTROL
      ) {
        checkSubType();
      } else {
        setStep(prev => prev + 1);
      }
    }
    if (step === 2) {
      setStep(prev => prev + 1);
    }
  };

  const decStep = () => {
    setStep(prev => prev - 1);
  };

  const send = useCallback(
    async (id: string) => {
      try {
        const file = await createPDFWODetails(id);

        if (file) {
          const fd = new FormData();

          fd.append('emails[]', subcontractorsForm.values);
          fd.append('file', convertToBlob(file));

          await woAPI.sendWODetails(id, fd);
        }
      } catch (err) {
        handleServerNetworkError(err.response.data);
      }
    },
    [subcontractorsForm.values],
  );

  const createWO = async (val: any) => {
    setIsLoading(true);
    let data = new FormData();

    for (let i = 0; i < files.length; i += 1) {
      data.append('files[]', {
        name: files[i].name || files[i].fileName,
        type: files[i].type,
        uri:
          Platform.OS === 'ios'
            ? files[i].uri?.replace('file://', '')
            : files[i].uri,
      });
    }

    for (const el in val) {
      if (!Array.isArray(val[el])) {
        data.append(`${el}`, val[el]);
      } else {
        val[el].forEach((id: string | {id: string}) => {
          typeof id === 'string'
            ? data.append(el + '[]', id)
            : data.append(el + '[]', id.id);
        });
      }
    }

    try {
      const res = await dispatch(createWOTC(data));

      if (
        values.sendToSubcontractor &&
        subcontractorsForm.values.emails.length > 0
      ) {
        await send(res?.payload?.data?.id);
      }

      navigation.goBack();
    } catch (err) {
      handleServerNetworkError(err?.response?.data);
    } finally {
      setIsLoading(false);
      setIsModalDublicatesVisible(false);
    }
  };

  const checkDublicates = async (val: CreateWOForm) => {
    if (val.roomId || val.buildingId) {
      const params: GetWOsParams = {
        limit: 100,
        offset: 0,
        showPM: false,
        types: [val.type],
        attributeCriteria,
        includeCriteria,
        statuses: [
          enumStatuses.NEW,
          enumStatuses.IN_PROGRESS,
          enumStatuses.ON_HOLD,
        ],
      };
      if (val.roomId) {
        params.roomId = val.roomId;
      }
      if (val.buildingId) {
        params.buildingId = val.buildingId;
      }
      if (val.subType) {
        params.subType = [val.subType];
      }
      const res = await woAPI.getWorkOrdersMany(params);
      if (res.data.count > 0) {
        setDublicates(res.data.payload);
        toggleModalDublicates();
      } else {
        await createWO(val);
      }
    } else {
      await createWO(val);
    }
  };

  const initialValues = assetId
    ? ({
        startWorkOrder: false,
        buildingId: assetId && asset?.building?.id,
        assetsId: assetId && asset && [asset],
        priority: enumPriority.MEDIUM,
        customerId,
      } as CreateWOForm)
    : ({
        customerId,
        startWorkOrder: false,
        priority: enumPriority.MEDIUM,
      } as CreateWOForm);

  const {
    errors,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
    values,
    submitCount,
  } = useFormik({
    initialValues,
    validationSchema: createWOSchema,
    onSubmit: checkDublicates,
    validateOnBlur: true,
  });

  const clearFields = (fields: string[]) => {
    fields.forEach(el => values[el] && setFieldValue(el, undefined));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CreateWOStep1
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            submitCount={submitCount}
            clearFields={clearFields}
            assetId={assetId}
            subcontractorsForm={subcontractorsForm}
          />
        );
      case 2:
        return (
          <CreateWOStep2
            errors={errors}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            submitCount={submitCount}
            setFieldValue={setFieldValue}
            clearFields={clearFields}
            assetId={assetId}
            subcontractorsForm={subcontractorsForm}
          />
        );
      case 3:
        return (
          <CreateWOStep3
            setFiles={setFiles}
            files={files}
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            handleChange={handleChange}
            submitCount={submitCount}
          />
        );
    }
  };

  const goBack = () => navigation.goBack();

  const renderItem: ListRenderItem<OrderType> = useCallback(
    ({item}) => <WorkOrderCard order={item} numColumn={1} hideMoreInfo />,
    [],
  );

  return (
    <View style={{flex: 1, paddingTop: insets.top}}>
      <FocusAwareStatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable onPress={goBack}>
          <ArrowBackIcon />
        </Pressable>
        <View>
          <Text style={styles.headerTitleText}>Create New Work Order</Text>
          <Text style={styles.headerTitleText}>Step {step}.</Text>
        </View>
        <View style={{width: 41}} />
      </View>
      {renderStep()}

      <View style={styles.buttons}>
        <MyButton
          text={step === 1 ? 'Cancel' : 'Previous'}
          action={step === 1 ? goBack : decStep}
          style="disabled"
        />
        {step === 3 ? (
          <MyButton
            text={'Create Work Order'}
            action={() => handleSubmit()}
            style="main"
            isLoading={isLoading}
            disabled={isLoading}
          />
        ) : (
          <MyButton
            text={'Next'}
            action={
              step === 2 && Object.values(errors).length > 0
                ? () => handleSubmit()
                : incStep
            }
            style="main"
            isLoading={isLoading}
            disabled={isLoading}
          />
        )}
        <ModalLayout
          isModalVisible={isModalDublicatesVisible}
          toggleModal={toggleModalDublicates}
          title="A similar WO was recently created">
          <View style={[styles.modalContainer]}>
            <Text style={styles.modalSubTitle}>
              Would you still like to create this WO?
            </Text>
            <FlatList
              data={dublicates}
              onEndReachedThreshold={0}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.flatList}
              renderItem={renderItem}
            />
            <View style={[stylesModal.modalButtons, styles.modalButtons]}>
              <MyButton
                text={'Cancel'}
                action={toggleModalDublicates}
                style="mainBorder"
              />
              <MyButton
                text={'Yes'}
                action={async () => {
                  await createWO(values);
                }}
                style="main"
              />
            </View>
          </View>
        </ModalLayout>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleText: {
    maxWidth: Dimensions.get('screen').width * 0.8,
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27,
  },
  flatList: {
    paddingVertical: 10,
    gap: 10,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    width: '100%',
    gap: 10,
    paddingHorizontal: 15,
  },
  modalSubTitle: {
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: '500',
    fontSize: 14,
    color: colors.textColor,
  },
  modalButtons: {
    position: 'relative',
    marginHorizontal: 0,
  },
  modalContainer: {
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
});
