import {FC, memo} from 'react';
import {FieldType, TypeAssetChildren} from './TypeAssetChildren';
import {ObjectSchema} from 'yup';

type TypeAssetProps = {
  setFieldType: (value: string) => void;
  setNewProps: ({}: {id: string; val: FieldType}) => void;
  errors: any;
  setDefaultProps: (initProps: any) => void;
  submitCount: number;
  values: any;
  onChangeNewValidation: (newValidation: ObjectSchema<any>) => void;
};

export const TypeAsset: FC<TypeAssetProps> = memo(
  ({
    setNewProps,
    errors,
    setDefaultProps,
    submitCount,
    onChangeNewValidation,
    values,
  }) => {
    const {typeId} = values;

    return (
      <>
        {typeId && typeId !== '' && (
          <TypeAssetChildren
            values={values}
            setNewProps={setNewProps}
            errors={errors}
            setDefaultProps={setDefaultProps}
            onChangeNewValidation={onChangeNewValidation}
            submitCount={submitCount}
          />
        )}
      </>
    );
  },
);
