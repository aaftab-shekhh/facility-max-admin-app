import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AssignSubcontractor} from '../CloseWO/Reasons/AssignSubcontractor';
import {stylesModal} from '../../../../../../styles/styles';
import {FC, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {woAPI} from '../../../../../../api/woApi';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {getWObyIdTC} from '../../../../../../bll/reducers/wo-Reducer';
import {ScrollView} from 'react-native-gesture-handler';
import {useFormik} from 'formik';
import {contactsAPI} from '../../../../../../api/contactsApi';
import {SubcontractorContact} from '../CreateWO/CreateWOStep2';
import {createPDFWODetails} from '../../../../../../utils/createPDFWODetails';
import {convertToBlob} from '../../../../../../utils/convertToBlob';
import {DocumentPickerResponse} from 'react-native-document-picker';

type AddSubcontractorProps = {
  toggleModal: () => void;
};

export const AddSubcontractor: FC<AddSubcontractorProps> = ({toggleModal}) => {
  const dispatch = useAppDispatch();
  const {id} = useAppSelector(state => state.wo.workOrder);
  const [subcontractor, setSubcontractor] = useState<string>();
  const [notify, setNotify] = useState<boolean>();
  const [contacts, setContacts] = useState<any[]>([]);

  const subcontractorsForm = useFormik({
    initialValues: {emails: []},
    onSubmit: () => {},
    validateOnBlur: true,
  });

  const addSubcontractor = async () => {
    if (subcontractor) {
      let data = new FormData();

      data.append('subcontractorId', subcontractor);
      data.append('workOrderId', id);
      data.append('sendDetailsToSubcontractor', notify);

      try {
        await woAPI.updateWO(data);
        dispatch(
          getWObyIdTC({
            workOrderId: id,
          }),
        );
        if (
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
        toggleModal();
      } catch (err) {
        handleServerNetworkError(err?.response?.data);
      }
    }
  };

  useEffect(() => {
    setContacts([]);
    if (notify && subcontractor) {
      (async () => {
        const res = await contactsAPI.getContacts({
          link: subcontractor,
        });
        setContacts(res.data.payload);
      })();
    }
    subcontractorsForm.setFieldValue('emails', []);
  }, [notify, subcontractor]);

  return (
    <ScrollView>
      <AssignSubcontractor
        onCangeNotifi={setNotify}
        onChangeSubcontractor={setSubcontractor}
        selectAdd={toggleModal}
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
      <View style={[stylesModal.modalButtons, styles.buttons]}>
        <TouchableOpacity
          onPress={toggleModal}
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
          onPress={addSubcontractor}
          style={stylesModal.modalButton}>
          <Text style={stylesModal.modalButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttons: {
    position: 'relative',
    marginTop: 20,
    marginHorizontal: 0,
  },
});
