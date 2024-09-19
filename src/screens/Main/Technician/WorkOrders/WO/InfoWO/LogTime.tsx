import {Platform, ScrollView, Text, View} from 'react-native';
import {DateTimeInput} from '../../../../../../components/DateTimeInput';
import {InputItem} from '../../../../../../components/InputItam';
import {stylesModal} from '../../../../../../styles/styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {woAPI} from '../../../../../../api/woApi';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {FC, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {AddFile} from '../../../../../../components/AddFile';
import {MyButton} from '../../../../../../components/MyButton';
import {colors} from '../../../../../../styles/colors';
import {styles} from './WorkOrderInfo';
import {getWObyIdTC} from '../../../../../../bll/reducers/wo-Reducer';

type LogTimeProps = {
  isLoadingButtons: boolean;
  toggleLogModal: () => void;
  techInWO: any;
  buttonActionText: string;
};

export const LogTime: FC<LogTimeProps> = ({
  isLoadingButtons,
  toggleLogModal,
  techInWO,
  buttonActionText,
}) => {
  const dispatch = useAppDispatch();

  const now = new Date();
  const {id: workOrderId} = useAppSelector(state => state.wo.workOrder);

  const [validation, setValidation] = useState<any>(
    yup.object().shape({
      startDateTech: yup.string().required('This value can not be blank'),
      endDateTech: yup.string().required('This value can not be blank'),
      hoursSpentTech: yup
        .string()
        .matches(/^(?=.*[0-9])/, 'Please enter a positive number')
        .required('This value can not be blank'),
      additionalExpensesTech: yup
        .string()
        .matches(/^(?=.*[0-9])/, 'Please enter a positive number')
        .required('This value can not be blank'),
      noteText: yup.string(),
    }),
  );

  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);

  const logTime = async (values: any) => {
    let data = new FormData();

    for (const el in values) {
      data.append(`${el}`, values[el]);
    }
    data.append('technicianId', techInWO.id);
    data.append('workOrderId', workOrderId);

    for (let i = 0; i < files.length; i += 1) {
      data.append('noteFiles[]', {
        name: files[i].name || files[i].fileName,
        type: files[i].type,
        uri:
          Platform.OS === 'ios'
            ? files[i].uri?.replace('file://', '')
            : files[i].uri,
      });
    }

    try {
      await woAPI.updateWOTech(data);
      dispatch(
        getWObyIdTC({
          workOrderId,
        }),
      );
      toggleLogModal();
    } catch (err) {
      console.log(err.request);
    }
  };

  const {errors, setFieldValue, handleBlur, handleSubmit, values, submitCount} =
    useFormik({
      initialValues: {
        startDateTech: techInWO?.WorkOrderTechnician?.startDateTech,
        endDateTech:
          techInWO?.WorkOrderTechnician?.endDateTech ||
          new Date(now.setHours(now.getHours() + 1)).toISOString(),
        hoursSpentTech: techInWO?.WorkOrderTechnician?.hoursSpentTech,
        additionalExpensesTech:
          techInWO?.WorkOrderTechnician?.additionalExpensesTech || null,
        noteText: '',
      },
      validationSchema: validation,
      onSubmit: logTime,
      validateOnBlur: true,
    });

  useEffect(() => {
    if (!values.hoursSpentTech) {
      setFieldValue(
        'hoursSpentTech',
        (
          (new Date(values.endDateTech).valueOf() -
            new Date(values.startDateTech).valueOf()) /
          3600000
        ).toFixed(2),
      );
    }
  }, []);

  useEffect(() => {
    setValidation(prev =>
      prev.concat(
        yup.object().shape({
          hoursSpentTech: yup
            .number()
            .min(0.01, 'This value can not be blank')
            .max(
              +(
                (new Date(values.endDateTech).valueOf() -
                  new Date(values.startDateTech).valueOf()) /
                3600000
              ).toFixed(2),
              'The maximum value cannot be greater than the start and end time difference',
            )
            .required('This value can not be blank'),
        }),
      ),
    );
  }, [values.endDateTech, values.startDateTech]);

  return (
    <>
      <ScrollView contentContainerStyle={{gap: 10, paddingBottom: 10}}>
        <DateTimeInput
          labelDate="Start Date"
          labelTime="Start Time"
          startValue={values.startDateTech}
          onChange={value => {
            setFieldValue('startDateTech', new Date(value).toISOString());
          }}
          error={errors.startDateTech}
          touched={submitCount > 0}
        />
        <DateTimeInput
          labelDate="End Date"
          labelTime="End Time"
          startValue={values.endDateTech}
          onChange={value => {
            setFieldValue('endDateTech', new Date(value).toISOString());
          }}
          error={errors.endDateTech}
          touched={submitCount > 0}
        />
        <InputItem
          numeric
          label="Total Labor Hours Spent"
          defaultValue={values.hoursSpentTech}
          handleChange={val => setFieldValue('hoursSpentTech', +val)}
          error={errors.hoursSpentTech}
          touched={submitCount > 0}
          handleBlur={handleBlur('hoursSpentTech')}
        />
        <InputItem
          numeric
          label="Additional Expenses"
          defaultValue={values.additionalExpensesTech}
          handleChange={val => setFieldValue('additionalExpensesTech', +val)}
          error={errors.additionalExpensesTech}
          touched={submitCount > 0}
          handleBlur={handleBlur('additionalExpensesTech')}
        />
        <InputItem
          multiline
          label="Notes"
          defaultValue={values.noteText || ''}
          handleChange={val => setFieldValue('noteText', val)}
          error={errors.noteText}
          touched={submitCount > 0}
          handleBlur={handleBlur('noteText')}
        />

        <Text style={{color: colors.textColor}}>Expense Files</Text>
        <AddFile onChange={value => setFiles(value)} files={files} />
      </ScrollView>
      <View style={[stylesModal.modalButtons, styles.buttons, {marginTop: 0}]}>
        <MyButton
          isLoading={isLoadingButtons}
          disabled={isLoadingButtons}
          text={'Cancel'}
          action={toggleLogModal}
          style="mainBorder"
        />
        <MyButton
          isLoading={isLoadingButtons}
          disabled={isLoadingButtons}
          text={buttonActionText}
          action={() => handleSubmit()}
          style="main"
        />
      </View>
    </>
  );
};
