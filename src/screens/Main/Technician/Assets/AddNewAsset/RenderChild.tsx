import React, {FC, memo} from 'react';
import {StyleSheet} from 'react-native';
import {InputItem} from '../../../../../components/InputItam';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {colors} from '../../../../../styles/colors';
import {Text} from 'react-native-svg';
import {FieldType} from './TypeAssetChildren';
import {DateInput} from '../../../../../components/DateInput';

type RenderChildProps = {
  id: string;
  name: string;
  type: string;
  setNewProps: ({}: {id: string; val: FieldType}) => void;
  submitCount: number;
  errors: any;
  values: any;
};

export const RenderChild: FC<RenderChildProps> = memo(
  ({id, name, errors, type, setNewProps, submitCount, values}) => {
    switch (type) {
      case 'String':
        return (
          <InputItem
            label={name}
            defaultValue={values?.props && values.props[id]?.value}
            handleChange={value => {
              setNewProps({id, val: {value, name, type}});
            }}
            touched={submitCount > 0}
            error={errors[name]}
          />
        );
      case 'Integer':
        return (
          <InputItem
            numeric
            label={name}
            defaultValue={values?.props && values.props[id]?.value}
            handleChange={value => {
              setNewProps({id, val: {value: +value, name, type}});
            }}
            touched={submitCount > 0}
            error={errors[name]}
          />
        );
      case 'Decimal':
        return (
          <InputItem
            numeric
            label={name}
            defaultValue={values?.props && values.props[id]?.value}
            handleChange={value => {
              setNewProps({id, val: {value: +value, name, type}});
            }}
            touched={submitCount > 0}
            error={errors[name]}
          />
        );
      case 'Float':
        return (
          <InputItem
            numeric
            label={name}
            defaultValue={values?.props && values.props[id]?.value}
            handleChange={value => {
              setNewProps({id, val: {value: +value, name, type}});
            }}
            touched={submitCount > 0}
            error={errors[name]}
          />
        );
      case 'Boolean':
        if (values?.props && !values?.props[id]) {
          setNewProps({id, val: {value: false, name, type}});
        }

        return (
          <BouncyCheckbox
            size={20}
            style={styles.checkbox}
            fillColor={colors.mainActiveColor}
            innerIconStyle={styles.borderRadius}
            iconStyle={styles.borderRadius}
            textStyle={styles.checkboxText}
            text={name}
            onPress={(isChecked: boolean) => {
              setNewProps({id, val: {value: isChecked, name, type}});
            }}
          />
        );
      case 'DateTime':
        // if (values?.props && !values?.props[id]) {
        //   setNewProps({id, val: {value: new Date().toISOString(), name, type}});
        // }
        return (
          <DateInput
            labelDate={name}
            onChange={value => {
              setNewProps({
                id,
                val: {value: new Date(value).toISOString(), name, type},
              });
            }}
            touched={submitCount > 0}
            error={errors[name]}
          />
        );
      case 'Date':
        // if (values?.props && !values?.props[id]) {
        //   setNewProps({id, val: {value: new Date().toISOString(), name, type}});
        // }
        return (
          <DateInput
            labelDate={name}
            onChange={value => {
              setNewProps({
                id,
                val: {value: new Date(value).toISOString(), name, type},
              });
            }}
            touched={submitCount > 0}
            error={errors[name]}
          />
        );
      default:
        return <Text>Invalid type</Text>;
    }
  },
);

const styles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: 20,
    marginRight: -10,
  },
  borderRadius: {
    borderRadius: 5,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },
});
