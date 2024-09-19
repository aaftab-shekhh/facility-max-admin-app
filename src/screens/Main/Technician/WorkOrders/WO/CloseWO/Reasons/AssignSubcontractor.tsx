import {StyleSheet, Text, View} from 'react-native';
import {FC} from 'react';
import {styleInput} from '../../../../../../../styles/styles';
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from 'react-native-bouncy-checkbox-group';
import {colors} from '../../../../../../../styles/colors';
import {AddNewSubcontractorDropdown} from '../../../AddNewSubcontractor/AddNewSubcontractorDropdown';

const staticData = [
  {id: '1', text: 'Yes', value: true},
  {id: '0', text: 'No', value: false},
];

type AssignSubcontractorProps = {
  onCangeNotifi: (notifi: boolean) => void;
  onChangeSubcontractor?: (subcontractorId: string) => void;
  selectAdd?: () => void;
};

export const AssignSubcontractor: FC<AssignSubcontractorProps> = ({
  onCangeNotifi,
  onChangeSubcontractor,
  selectAdd,
}) => {
  return (
    <View style={{gap: 10}}>
      <AddNewSubcontractorDropdown
        onChangeSubcontractors={onChangeSubcontractor && onChangeSubcontractor}
        selectAdd={selectAdd}
      />

      <View style={styleInput.inputItem}>
        <Text style={styleInput.label}>
          Subcontractor has already been notified?
        </Text>
      </View>

      <View style={styleInput.inputItem}>
        <BouncyCheckboxGroup
          data={staticData}
          style={styles.checkboxGroup}
          checkboxProps={{
            textStyle: styles.checkboxText,
            fillColor: '#1B6BC0',
            size: 18,
            textContainerStyle: {paddingVertical: 5},
            iconImageStyle: {
              backgroundColor: '#FFF',
              width: 8,
              height: 8,
              borderRadius: 5,
            },
          }}
          onChange={(selectedItem: ICheckboxButton) => {
            onCangeNotifi(selectedItem.value);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxGroup: {
    flexDirection: 'column',
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },
  newSubcontractorButton: {
    marginTop: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondColor,
  },
  dropdown: {
    height: 45,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  containerStyle: {
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    paddingTop: 0,
    marginTop: -10,
    borderTopColor: colors.backgroundLightColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  placeholderStyle: {
    fontSize: 14,
    color: colors.textColor,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: colors.textColor,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    color: colors.textColor,
  },
  icon: {
    marginRight: 5,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    gap: 5,
  },
  itemHeader: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSecondText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondColor,
  },
  isApproved: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 5,
  },
  approved: {
    color: colors.selectCheck,
  },
  notApproved: {
    color: colors.deleteColor,
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
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 14,
    color: colors.mainActiveColor,
  },
  textButtonStyle: {
    color: colors.mainActiveColor,
  },
});
