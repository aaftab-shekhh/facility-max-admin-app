import {FC, memo, useEffect, useState} from 'react';
import {View} from 'react-native';
import {assetsAPI} from '../../../../../api/assetsApi';
import {RenderChild} from './RenderChild';
import {createAssetSchema} from '../../../../../utils/validationSchemes';
import {ObjectSchema} from 'yup';
import * as yup from 'yup';
import {useLocalStateSelector} from '../../../../../hooks/useLocalStateSelector';
import {useNetInfo} from '@react-native-community/netinfo';

export type FieldType = {
  id?: string;
  name: string;
  type: string;
  value?: number | string | boolean;
  submitCount: number;
};

type TypeAssetChildrenProps = {
  setNewProps: ({}: {id: string; val: FieldType}) => void;
  errors: any;
  setDefaultProps: (initProps: any) => void;
  onChangeNewValidation: (newValidation: ObjectSchema<any>) => void;
  submitCount: number;
  values: any;
};

export const TypeAssetChildren: FC<TypeAssetChildrenProps> = memo(
  ({values, setNewProps, errors, onChangeNewValidation, submitCount}) => {
    const [childrens, setChildrens] = useState<FieldType[]>([]);

    const {isConnected} = useNetInfo();
    const {getLocalAssetTypeProps} = useLocalStateSelector();

    const {typeId} = values;

    const def = {
      String: '',
      Integer: 0,
      Decimal: 0,
      Boolean: 'false',
      DateTime: null,
      Date: null,
    };

    useEffect(() => {
      (async () => {
        if (typeId) {
          const res = isConnected
            ? await assetsAPI.getPropsByAssetTypeId({typeId})
            : getLocalAssetTypeProps(typeId);
          const fields = res.data.props || res.data.assetProps;

          const activeFields = fields.filter(
            el => el.assetTypesProps[0].isActive,
          );

          setChildrens(activeFields);

          const obj: {[key: string]: any} = {};

          activeFields.forEach(
            ({id, type, ...props}) => (obj[id] = {...props, value: def[type]}),
          );

          let newSchema = yup.object().shape({});
          activeFields.forEach(el => {
            if (el.isBasic) {
              if (
                el.type === 'Decimal' ||
                el.type === 'Integer' ||
                el.type === 'Float'
              ) {
                newSchema = newSchema.concat(
                  yup.object().shape({
                    [el.name]: yup
                      .number()
                      .min(0.01, 'This value can not be blank')
                      .required('This value can not be blank'),
                  }),
                );
              } else {
                newSchema = newSchema.concat(
                  yup.object().shape({
                    [el.name]: yup
                      .string()
                      .required('This value can not be blank'),
                  }),
                );
              }
            } else {
              if (
                el.type === 'Decimal' ||
                el.type === 'Integer' ||
                el.type === 'Float'
              ) {
                newSchema = newSchema.concat(
                  yup.object().shape({
                    [el.name]: yup
                      .number()
                      .min(0.01, 'This value can not be blank'),
                  }),
                );
              } else {
                newSchema = newSchema.concat(
                  yup.object().shape({
                    [el.name]: yup.string(),
                  }),
                );
              }
            }
          });

          onChangeNewValidation(createAssetSchema.concat(newSchema));
        }
      })();
    }, [typeId, isConnected]);

    return (
      <View style={{flex: 1, gap: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
        {childrens?.length > 0 &&
          childrens.map(el => {
            return (
              <View key={el.id} style={{flex: 1, minWidth: 300, height: 60}}>
                <RenderChild
                  id={el.id}
                  values={values}
                  name={el.name}
                  type={el.type}
                  setNewProps={setNewProps}
                  errors={errors}
                  submitCount={submitCount}
                />
              </View>
            );
          })}
      </View>
    );
  },
);
