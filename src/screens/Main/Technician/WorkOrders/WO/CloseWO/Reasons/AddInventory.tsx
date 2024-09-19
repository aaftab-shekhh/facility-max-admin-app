import {FC, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StyleSheet, Text, View} from 'react-native';
import {ModalLayout} from '../../../../../../../components/Layouts/ModalLayout';
import {colors} from '../../../../../../../styles/colors';
import {AddInventoryModal} from './AddInventoryModal';
import {CrossSmallIcon} from '../../../../../../../assets/icons/CrossSmallIcon';
import {MyButton} from '../../../../../../../components/MyButton';

type AddInventoryProps = {
  onChangeInventories: (value: any[]) => void;
  hideSelected?: boolean;
  selectedParts?: any[];
  maxCount?: number;
};

export const AddInventory: FC<AddInventoryProps> = ({
  onChangeInventories,
  hideSelected,
  selectedParts,
  maxCount,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const [viewInventory, setViewInventory] = useState<any[]>(
    selectedParts || [],
  );

  const deleteInventory = (id: string) => {
    onChangeInventories(viewInventory.filter(el => el.id !== id));
    setViewInventory(prev => prev.filter(el => el.id !== id));
  };

  useEffect(() => {
    if (selectedParts) {
      setViewInventory(selectedParts);
    }
  }, [selectedParts]);

  return (
    <>
      <MyButton style="primary" action={toggleModal} text="+ Add part(s)" />

      {viewInventory.length > 0 && !hideSelected && (
        <View style={styles.selectedAssetsContainer}>
          {viewInventory.map(item => {
            const itemName =
              item.name || item.equipmentId || item.id.split('-')[0];
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  deleteInventory(item.id);
                }}>
                <View style={styles.selectedStyle}>
                  <Text style={styles.textSelectedStyle}>{itemName}</Text>
                  <CrossSmallIcon />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <ModalLayout
        title={'Choose part(s)'}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <AddInventoryModal
          viewInventory={viewInventory}
          onChange={val => {
            onChangeInventories(val);
            setViewInventory(val);
          }}
          maxCount={maxCount}
          toggleModal={toggleModal}
        />
      </ModalLayout>
    </>
  );
};
const styles = StyleSheet.create({
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
  button: {
    backgroundColor: colors.secondButtonColor,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.mainActiveColor,
  },
});
