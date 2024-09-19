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

export const WebViewModalLayout: FC<ModalLayoutProps> = ({
  title,
  children,
  isModalVisible,
  toggleModal,
}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={toggleModal}
      style={{marginHorizontal: 0, marginTop: 40}}>
      <View style={styles.modalContainer}>
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
    flex: 1,
    backgroundColor: '#F4F5F7',
    borderRadius: 10,
  },
  crossContainer: {
    alignItems: 'flex-end',
    marginTop: 15,
    marginHorizontal: 15,
  },
  modalTitle: {
    color: '#202534',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
    textAlign: 'center',
    marginVertical: 10,
  },
});
