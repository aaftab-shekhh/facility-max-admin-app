import {FC, useCallback, useEffect, useState} from 'react';
import {DropdownWithLeftIcon} from './DropdownWithLeftIcon';
import {assetsAPI} from '../api/assetsApi';
import {dropdownIcons} from '../bll/icons';

type DropdownAssetTypesProps = {
  touched?: boolean;
  onChange: (item: any) => void;
  categoryId: string;
  startValue?: string;
  error?: string;
};

export const DropdownAssetTypes: FC<DropdownAssetTypesProps> = ({
  touched,
  startValue,
  error,
  onChange,
  categoryId,
}) => {
  const [types, setTypes] = useState<any[]>([]);
  const [typesCount, setTypesCount] = useState<number>(0);

  const getTypes = useCallback(async () => {
    if (categoryId) {
      const res = await assetsAPI.getTypesAssets({
        categoryIdes: [categoryId],
        offset: 0,
        limit: 25,
      });
      setTypes(res.data.types);
      setTypesCount(res.data.count);
    }
  }, [categoryId]);

  const loadTypes = useCallback(async () => {
    if (categoryId && typesCount > types.length) {
      const res = await assetsAPI.getTypesAssets({
        categoryIdes: [categoryId],
        offset: types.length,
        limit: 25,
      });
      setTypes(prev => [...prev, ...res.data.types]);
      setTypesCount(res.data.count);
    }
  }, [categoryId, types, typesCount]);

  useEffect(() => {
    getTypes();
  }, [categoryId]);

  return (
    <DropdownWithLeftIcon
      label="Type"
      data={types}
      startValue={startValue}
      onChange={onChange}
      error={error}
      touched={touched}
      dropdownIcons={dropdownIcons}
      loadData={loadTypes}
      placeholder={'Select a Type'}
    />
  );
};
