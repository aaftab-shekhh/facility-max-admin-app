import {View} from 'react-native';
import {useEffect, useMemo, useState} from 'react';
import {WitingParts} from './Reasons/WitingParts';
import {Default} from './Reasons/Default';
import {DropdownWithLeftIcon} from '../../../../../../components/DropdownWithLeftIcon';
import {OnHoldReasons, enumTypeWO} from '../../../../../../enums/workOrders';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {contactsAPI} from '../../../../../../api/contactsApi';
import {AssignSubcontractor} from './Reasons/AssignSubcontractor';
import {SubcontractorContact} from '../CreateWO/CreateWOStep2';

const reasons = Object.values(OnHoldReasons).map(el => ({name: el, id: el}));

export const CloseOnHold = ({
  handleChange,
  handleBlur,
  touched,
  setFieldValue,
  errors,
  values,
  submitCount,
  onChangeInventories,
  subcontractorsForm,
}: any) => {
  const {subcontractorId, type} = useAppSelector(state => state.wo.workOrder);
  const [contacts, setContacts] = useState<any[]>([]);

  const filteredReasons = useMemo(
    () =>
      type === enumTypeWO.AMENITY_SPACE_BOOKING
        ? reasons.filter(
            el =>
              el.id !== OnHoldReasons.ASSIGN_SUBCONTRACTOR &&
              el.id !== OnHoldReasons.WAITING_FOR_PARTS &&
              el.id !== OnHoldReasons.ASSET_IS_CRITICAL,
          )
        : !subcontractorId
        ? reasons
        : reasons.filter(el => el.id !== OnHoldReasons.ASSIGN_SUBCONTRACTOR),
    [subcontractorId, type],
  );

  useEffect(() => {
    if (!values.reasonForOnHold) {
      setFieldValue('reasonForOnHold', filteredReasons[0].id);
    }
  }, []);

  useEffect(() => {
    setContacts([]);
    subcontractorsForm.setFieldValue('emails', []);
    if (values.sendDetailsToSubcontractor && values?.subcontractorId) {
      (async () => {
        const res = await contactsAPI.getContacts({
          link: values.subcontractorId,
        });
        setContacts(res.data.payload);
      })();
    }
  }, [values.subcontractorId, values.sendDetailsToSubcontractor]);

  const changeReason = () => {
    switch (values.reasonForOnHold) {
      case OnHoldReasons.WAITING_FOR_PARTS:
        return (
          <WitingParts
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            setFieldValue={setFieldValue}
            errors={errors}
            values={values}
            submitCount={submitCount}
            onChangeInventories={onChangeInventories}
          />
        );
      case OnHoldReasons.ASSIGN_SUBCONTRACTOR:
        return (
          <>
            <AssignSubcontractor
              onChangeSubcontractor={subcontractorId => {
                setFieldValue('subcontractorId', subcontractorId);
              }}
              onCangeNotifi={notifi =>
                setFieldValue('sendDetailsToSubcontractor', notifi)
              }
            />
            <View style={{gap: 3}}>
              {contacts.map(contact => (
                <SubcontractorContact
                  key={contact.id}
                  contact={contact}
                  subcontractorsForm={subcontractorsForm}
                />
              ))}
            </View>
          </>
        );
      default:
        return (
          <Default
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            setFieldValue={setFieldValue}
            errors={errors}
            values={values}
            submitCount={submitCount}
          />
        );
    }
  };
  return (
    <View style={{gap: 10}}>
      <DropdownWithLeftIcon
        label={'Reason for putting "On Hold"'}
        onChange={item => {
          setFieldValue('reasonForOnHold', item.id);
          setFieldValue('subcontractorId', undefined);
          onChangeInventories([]);
        }}
        startValue={values.reasonForOnHold}
        data={filteredReasons}
      />
      {changeReason()}
    </View>
  );
};
