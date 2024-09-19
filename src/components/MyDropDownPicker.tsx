import {FC, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {styleInput} from '../styles/styles';

type ItemType = {
  label: string;
  value: string;
  labelStyle?: {};
};

type MyDropDownPickerType = {
  title: string;
  itemsArr: ItemType[];
  startValue?: string;
  onChangeValue: (value: string | undefined) => void;
};

export const MyDropDownPicker: FC<MyDropDownPickerType> = ({
  title,
  itemsArr,
  onChangeValue,
  startValue,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ItemType[]>(itemsArr);
  const [value, setValue] = useState<string | null>(startValue || null);

  return (
    <TouchableWithoutFeedback onPress={() => setOpen(false)}>
      <View style={[styleInput.inputItem, styles.container]}>
        <Text style={styleInput.label}>{title}</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={`${title}`}
          disableBorderRadius={true}
          closeOnBackPressed={true}
          style={styles.dropDown}
          dropDownContainerStyle={styles.dropDownContainer}
          listItemContainerStyle={styles.listItemContainer}
          labelStyle={styles.label}
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          onChangeValue={value => {
            if (value) {
              onChangeValue(value);
            }
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
export const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  dropDown: {
    borderWidth: 0,
    minHeight: 38,
    zIndex: 1,
  },
  dropDownContainer: {
    borderWidth: 0,
    position: Platform.OS !== 'ios' ? 'relative' : 'absolute',
    top: Platform.OS !== 'ios' ? 0 : 38,
    zIndex: 1,
  },
  listItemContainer: {
    borderTopColor: '#DDDDDD',
    borderTopWidth: 1,
    borderStyle: 'solid',
    zIndex: 1,
  },
  label: {
    fontWeight: '400',
    fontSize: 14,
    zIndex: 1,
  },
});
