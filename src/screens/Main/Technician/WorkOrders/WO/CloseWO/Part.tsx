import {FC, useState} from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './CloseCompleted';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {colors} from '../../../../../../styles/colors';
import {InfoItem} from '../../../../../../components/InfoItem';
import {DeleteIcon} from '../../../../../../assets/icons/DeleteIcon';

type PartProps = {
  deletePart: (id: string) => void;
  part: {
    bin: string;
    building: string;
    createdAt: string;
    equipmentId: string;
    id: string;
    manufacturer: string;
    manufacturerPartNumber: string;
    price: number;
    room: any;
    shelf: string;
    status: string;
    stockAge: number;
    type: {
      categories: {
        file: any;
        id: string;
        name: string;
      };
      id: string;
      name: string;
    };
    workOrder: {
      id: string;
      number: number;
      title: string;
    };
  };
};

export const Part: FC<PartProps> = ({part, deletePart}) => {
  const partName = 'Inventory Part: #' + part.id.split('-')[0];

  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={styles.assetContainer}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.header, isOpen && styles.headerOpen]}>
        <Text style={styles.headerText}>{partName}</Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpen && (
        <>
          <View style={[styles.assetInfoContainer, {backgroundColor: '#fff'}]}>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  deletePart(part.id);
                }}>
                <DeleteIcon />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <InfoItem
                title="Manufacturer"
                text={part.manufacturer || '-'}
                hiddeBorder
              />
              <InfoItem
                title="Manufacturer Part #"
                text={part.manufacturerPartNumber || '-'}
                hiddeBorder
              />
              <InfoItem
                title="Item cost"
                text={part.price || '-'}
                hiddeBorder
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};
