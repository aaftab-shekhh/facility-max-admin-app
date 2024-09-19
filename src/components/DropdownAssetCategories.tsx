import {FC, useCallback, useEffect, useState} from 'react';
import {DropdownWithLeftIcon} from './DropdownWithLeftIcon';
import {assetsAPI} from '../api/assetsApi';
import {dropdownIcons} from '../bll/icons';

type DropdownAssetCategoriesProps = {
  touched?: boolean;
  onChange: (item: any) => void;
  startValue?: string;
  error?: string;
};

export const DropdownAssetCategories: FC<DropdownAssetCategoriesProps> = ({
  touched,
  startValue,
  error,
  onChange,
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);

  const getCategories = useCallback(async () => {
    const res = await assetsAPI.getAssetCategoriesList({offset: 0, limit: 25});
    setCategories(res.data.categories);
    setCategoriesCount(res.data.count);
  }, []);

  const loadCategories = useCallback(async () => {
    if (categoriesCount > categories.length) {
      const res = await assetsAPI.getAssetCategoriesList({
        offset: categories.length,
        limit: 25,
      });
      setCategories(res.data.categories);
    }
  }, [categories, categoriesCount]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <DropdownWithLeftIcon
      label="Category"
      data={categories}
      startValue={startValue}
      onChange={onChange}
      error={error}
      touched={touched}
      dropdownIcons={dropdownIcons}
      loadData={loadCategories}
      placeholder={'Select a Asset Category'}
      isIcon
    />
  );
};
