import {FC, useCallback, useEffect, useState} from 'react';
import {contactsAPI} from '../../../../../../api/contactsApi';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import {useFormik} from 'formik';
import {SubcontractorContact} from '../CreateWO/CreateWOStep2';
import {stylesModal} from '../../../../../../styles/styles';
import {woAPI} from '../../../../../../api/woApi';
import {MyButton} from '../../../../../../components/MyButton';
import {
  handleServerNetworkError,
  handleServerNetworkSuccessful,
} from '../../../../../../utils/handleServerNetworkUtils';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {createPDFWODetails} from '../../../../../../utils/createPDFWODetails';
import {convertToBlob} from '../../../../../../utils/convertToBlob';
import {DocumentPickerResponse} from 'react-native-document-picker';

type SendWODetailsProps = {
  toggleModal: () => void;
  subcontractorId?: string;
};

export const SendWODetails: FC<SendWODetailsProps> = ({
  toggleModal,
  subcontractorId,
}) => {
  const {id} = useAppSelector(state => state.wo.workOrder);
  const [contacts, setContacts] = useState<any[]>([]);

  const send = useCallback(
    async (val: {emails: string[]}) => {
      try {
        const file = await createPDFWODetails(id);

        if (file) {
          const fd = new FormData();

          fd.append('emails[]', val.emails);
          fd.append('file', convertToBlob(file as DocumentPickerResponse));

          await woAPI.sendWODetails(id, fd);
          toggleModal();
          handleServerNetworkSuccessful({
            message:
              'Details of the Work Order were successfully sent to the subcontractor',
          });
        }
      } catch (err) {
        handleServerNetworkError(err.response.data);
      }
    },
    [id],
  );

  const subcontractorsForm = useFormik({
    initialValues: {emails: []},
    onSubmit: send,
    validateOnBlur: true,
  });

  const renderItem: ListRenderItem<any> = useCallback(
    ({item}) => (
      <SubcontractorContact
        contact={item}
        subcontractorsForm={subcontractorsForm}
      />
    ),
    [subcontractorsForm],
  );

  useEffect(() => {
    setContacts([]);
    subcontractorsForm.setFieldValue('emails', []);

    if (subcontractorId) {
      (async () => {
        const res = await contactsAPI.getContacts({
          link: subcontractorId,
        });
        setContacts(res.data.payload.map(el => (el.user ? el.user : el)));
      })();
    }
  }, [subcontractorId]);

  return (
    <>
      <FlatList
        contentContainerStyle={styles.content}
        data={contacts}
        renderItem={renderItem}
      />
      <View style={[stylesModal.modalButtons, styles.buttons]}>
        <MyButton text="Cancel" style="mainBorder" action={toggleModal} />
        <MyButton
          text="Send"
          style="main"
          action={() => {
            subcontractorsForm.handleSubmit();
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 2,
    paddingBottom: 20,
  },
  buttons: {
    position: 'relative',
    marginHorizontal: 0,
  },
});
