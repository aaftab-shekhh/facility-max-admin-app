import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MyButton} from './MyButton';
import ObjectGroupsIcon from '../assets/icons/ObjectGroupsIcon';
import {FC, useEffect, useState} from 'react';
import {colors} from '../styles/colors';
import {CrossSmallIcon} from '../assets/icons/CrossSmallIcon';
import {ModalLayout} from './Layouts/ModalLayout';
import {AddObjectGroupModal} from './AddObjectGroupModal';

type AddObjectGroupsProps = {
  pageId?: string;
  values: any[];
  onChange: (objectGroups: any[]) => void;
  maxCount?: number;
  currentCount: number;
};

export const AddObjectGroups: FC<AddObjectGroupsProps> = ({
  pageId,
  values,
  onChange,
  maxCount,
  currentCount,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [viewObjectGroups, setViewObjectGroups] = useState<any[]>(
    values ? values : [],
  );

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const deleteObjectGroup = (id: string) => {
    setViewObjectGroups(prev => prev.filter(el => el.id !== id));
  };

  useEffect(() => {
    setViewObjectGroups(values ? values : []);
  }, [values]);

  useEffect(() => {
    onChange(viewObjectGroups);
  }, [viewObjectGroups]);

  return (
    <View style={{gap: 10}}>
      {viewObjectGroups.length > 0 && (
        <>
          <Text style={styles.label}>Rooms</Text>
          <View style={styles.selectedAssetsContainer}>
            {viewObjectGroups.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    deleteObjectGroup(item.id);
                  }}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.textSelectedStyle}>{item.name}</Text>
                    <CrossSmallIcon />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      <MyButton
        style="primary"
        text="Add Object Group"
        action={toggleModal}
        leftIcon={<ObjectGroupsIcon />}
      />
      <ModalLayout
        title={'Add Object Group'}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <AddObjectGroupModal
          pageId={pageId}
          values={values}
          onChange={(objectGroups: any[]) => {
            setViewObjectGroups(objectGroups);
          }}
          toggleModal={toggleModal}
          maxCount={maxCount}
          currentCount={currentCount}
        />
      </ModalLayout>
    </View>
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
    backgroundColor: colors.backgroundLightColor,
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
    backgroundColor: '#44B8FF1A',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.mainActiveColor,
  },
});
