import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCallback, useState} from 'react';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useFormik} from 'formik';

import * as yup from 'yup';
import {useAppSelector} from '../../../../../hooks/hooks';
import {woAPI} from '../../../../../api/woApi';
import {
  handleServerNetworkError,
  handleServerNetworkSuccessful,
} from '../../../../../utils/handleServerNetworkUtils';
import {DotsIcon} from '../../../../../assets/icons/DotsIcon';
import {colors} from '../../../../../styles/colors';
import SendDetailsIcon from '../../../../../assets/icons/SendDetailsIcon';
import {ModalLayout} from '../../../../../components/Layouts/ModalLayout';
import {InputItem} from '../../../../../components/InputItam';
import {
  SCREEN_HEIGHT,
  styleButtomBotton,
  stylesModal,
} from '../../../../../styles/styles';
import {MyButton} from '../../../../../components/MyButton';
import {createPDFWODetails} from '../../../../../utils/createPDFWODetails';
import {convertToBlob} from '../../../../../utils/convertToBlob';
import {CrossSmallIcon} from '../../../../../assets/icons/CrossSmallIcon';
import {DocumentPickerResponse} from 'react-native-document-picker';

export const WOHeaderMenu = () => {
  const {workOrder} = useAppSelector(state => state.wo);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const send = useCallback(
    async (val: {emails: string[]}) => {
      try {
        const file = await createPDFWODetails(workOrder.id);
        if (file) {
          const fd = new FormData();

          fd.append('emails[]', val.emails);
          fd.append('file', convertToBlob(file as DocumentPickerResponse));

          await woAPI.sendWODetails(workOrder.id, fd);
          setIsModalVisible(false);
          handleServerNetworkSuccessful({
            message: 'Work Order details have been sent successfully',
          });
        }
      } catch (err) {
        handleServerNetworkError(err.response.data);
      }
    },
    [workOrder.id],
  );

  const form = useFormik({
    initialValues: {emails: []},
    onSubmit: send,
    validateOnBlur: true,
  });

  const add = val => {
    form.setFieldValue('emails', [...form.values.emails, val.value]);
    emailForm.resetForm();
  };

  const emailForm = useFormik({
    initialValues: {value: ''},
    onSubmit: add,
    validationSchema: yup.object().shape({
      value: yup.string().email().required('This value can not be blankd'),
    }),
    validateOnBlur: true,
  });

  return (
    <>
      <View style={styles.container}>
        <Menu>
          <MenuTrigger>
            <DotsIcon
              color={colors.headerColor}
              fill={colors.bottomActiveTextColor}
            />
          </MenuTrigger>
          <MenuOptions customStyles={{optionsContainer: styles.menuOptions}}>
            <MenuOption
              customStyles={{optionWrapper: styles.button}}
              onSelect={toggleModal}>
              <SendDetailsIcon />
              <Text style={styles.buttonText}>Send WO Details</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      <ModalLayout
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        title="Send WO Details">
        <ScrollView
          contentContainerStyle={styles.modalContainer}
          style={{
            maxHeight: SCREEN_HEIGHT * 0.65,
          }}>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'flex-end'}}>
            <InputItem
              label="Email"
              defaultValue={emailForm.values.value}
              handleChange={emailForm.handleChange('value')}
              error={emailForm.errors.value}
              touched={emailForm.submitCount > 0}
            />
            <TouchableOpacity
              style={[styleButtomBotton.button, {maxWidth: 50}]}
              onPress={() => {
                emailForm.handleSubmit();
              }}>
              <Text style={styles.addButton}>+</Text>
            </TouchableOpacity>
          </View>
          {form.values.emails.length > 0 && (
            <>
              <View style={styles.selectedAssetsContainer}>
                {form.values.emails.map(item => {
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        form.setFieldValue(
                          'emails',
                          form.values.emails.filter(el => el !== item),
                        );
                      }}>
                      <View style={styles.selectedStyle}>
                        <Text style={styles.textSelectedStyle}>{item}</Text>
                        <CrossSmallIcon />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
          <View style={[stylesModal.modalButtons, styles.buttons]}>
            <MyButton text="Cancel" style="mainBorder" action={toggleModal} />
            <MyButton
              text="Send"
              style={form.values.emails.length > 0 ? 'main' : 'disabled'}
              disabled={form.values.emails.length === 0}
              action={() => {
                form.handleSubmit();
              }}
            />
          </View>
        </ScrollView>
      </ModalLayout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
  },
  menuOptions: {
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textColor,
  },
  modalContainer: {
    marginBottom: 10,
    gap: 15,
  },
  buttons: {
    position: 'relative',
    marginHorizontal: 0,
  },
  label: {
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: -10,
  },
  selectedAssetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.calendarBsckGround,
    padding: 10,
    borderRadius: 8,
    rowGap: 10,
    columnGap: 7,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    gap: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.mainActiveColor,
    backgroundColor: '#009ef72c',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 14,
    color: colors.mainActiveColor,
  },
  addButton: {
    color: colors.bottomActiveTextColor,
    fontSize: 20,
    fontWeight: '600',
  },
});
