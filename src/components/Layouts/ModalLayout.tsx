import {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import {CrossIcon} from '../../assets/icons/CrossIcon';

type ModalLayoutProps = {
  children?: JSX.Element;
  title: string;
  isModalVisible: boolean;
  toggleModal: () => void;
};

export const ModalLayout: FC<ModalLayoutProps> = ({
  title,
  children,
  isModalVisible,
  toggleModal,
}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={toggleModal}
      hideModalContentWhileAnimating
      presentationStyle="overFullScreen"
      style={styles.modalContainer}>
      <View style={styles.modalSubContainer}>
        <View style={styles.crossContainer}>
          <TouchableOpacity hitSlop={20} onPress={toggleModal}>
            <CrossIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.modalTitle}>{title}</Text>
        {children && children}
      </View>
    </Modal>
  );
};
export const styles = StyleSheet.create({
  modalContainer: {
    marginVertical: 80,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  modalSubContainer: {
    backgroundColor: '#F4F5F7',
    borderRadius: 10,
    padding: 10,
  },
  crossContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  modalTitle: {
    // flex: 1,
    // width: '100%',
    color: '#202534',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
    textAlign: 'center',
    marginVertical: 10,
  },
});
