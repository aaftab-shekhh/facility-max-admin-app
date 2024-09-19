import {FC, useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {DropdownWithSearch} from '../../../../../../components/DropdownWithSearch';
import {colors} from '../../../../../../styles/colors';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {
  resetAssetFilters,
  setAssetFiltersField,
} from '../../../../../../bll/reducers/filters-Reducer';
import {dropdownIcons} from '../../../../../../bll/icons';
import {CustomSlider} from '../../../../../../components/CustomSlider';
import {Separator} from '../../../../../../components/Separator';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {EverythingForkEnum} from '../../../../../../enums/assets';
import {DateInput} from '../../../../../../components/DateInput';
import {SCREEN_HEIGHT} from '../../../../../../styles/styles';
import {BuildingType} from '../../../../../../types/StateType';
import {buildingsAPI} from '../../../../../../api/buildingsApi';
import {DropdownWithLeftIcon} from '../../../../../../components/DropdownWithLeftIcon';

type AssetFiltersProps = {
  toggleModal: () => void;
};

export const AssetFilters: FC<AssetFiltersProps> = ({toggleModal}) => {
  const dispatch = useAppDispatch();
  const {assetFilters} = useAppSelector(state => state.filters);
  const {regionId} = useAppSelector(state => state.user.user);

  const [categoryIdes, setCategoryIdes] = useState(
    assetFilters?.categoryIdes || [],
  );
  const [typeIdes, setTypeIdes] = useState(assetFilters?.typeIdes || []);
  const [installDate, setInstallDate] = useState<string>(
    assetFilters?.installDate || undefined,
  );
  const [lastServiceDate, setLastServiceDate] = useState<string>(
    assetFilters?.lastServiceDate || undefined,
  );
  const [minCost, setMinCost] = useState<number>(
    assetFilters?.minCost || undefined,
  );
  const [maxCost, setMaxCost] = useState<number>(
    assetFilters?.maxCost || undefined,
  );
  const [buildingIdes, setBuildingIdes] = useState<string>(
    assetFilters?.buildingIdes,
  );
  // const [minAge, setMinAge] = useState<number>(
  //   assetFilters?.minAge || undefined,
  // );
  // const [maxAge, setMaxAge] = useState<number>(
  //   assetFilters?.maxAge || undefined,
  // );
  // const [hasInventory, setHasInventory] = useState<boolean>(
  //   assetFilters?.hasInventory,
  // );
  const [isCritical, setIsCritical] = useState<boolean>(
    assetFilters?.isCritical,
  );
  const [hasPlans, setHasPlans] = useState<boolean>(assetFilters?.hasPlans);
  const [isArhived, setIsArhived] = useState<boolean>(assetFilters?.isArhived);
  const [sortField, setSortField] = useState<string>(assetFilters?.sortField);
  const [sortDirection, setSortDirection] = useState<string>(
    assetFilters?.sortDirection,
  );

  const [buildings, setBuildings] = useState<BuildingType[]>([]);

  const setFilters = (): void => {
    const obj: any = {
      categoryIdes,
      typeIdes,
      installDate,
      lastServiceDate,
      minCost,
      maxCost,
      // minAge,
      // maxAge,
      // hasInventory,
      buildingIdes: [buildingIdes],
      isCritical,
      hasPlans,
      isArhived,
      sortField,
      sortDirection,
    };
    dispatch(resetAssetFilters());

    for (const el in obj) {
      if (obj[el]) {
        if (Array.isArray(obj[el]) && obj[el].length > 0) {
          dispatch(setAssetFiltersField({[el]: obj[el]}));
        } else if (
          !Array.isArray(obj[el]) &&
          typeof obj[el] === 'string' &&
          obj[el].length > 0
        ) {
          dispatch(setAssetFiltersField({[el]: obj[el]}));
        } else if (!Array.isArray(obj[el]) && typeof obj[el] === 'number') {
          dispatch(setAssetFiltersField({[el]: obj[el]}));
        } else if (typeof obj[el] === 'boolean' && obj[el]) {
          dispatch(setAssetFiltersField({[el]: obj[el]}));
        }
      }
    }
    toggleModal();
  };

  const resetFilters = (): void => {
    dispatch(resetAssetFilters());
    toggleModal();
  };

  const getBuildings = async () => {
    const params: any = {
      regionIds: [regionId],
      size: 1000,
      page: 1,
      sortField: 'name',
      sortDirection: 'ASC',
    };

    const res = await buildingsAPI.getBuildingsList(params);
    setBuildings(res.data.rows);
  };

  useEffect(() => {
    getBuildings();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 10, gap: 10}}>
        <DropdownWithSearch
          placeholder="Asset Category"
          onChange={item => setCategoryIdes(item)}
          keyItem={EverythingForkEnum.CATEGORY}
          search
          multiSelect
          isIcon
          dropdownIcons={dropdownIcons}
          startValue={categoryIdes}
        />
        <DropdownWithSearch
          placeholder="Asset Type"
          onChange={item => setTypeIdes(item)}
          keyItem={EverythingForkEnum.TYPE}
          search
          multiSelect
          dropdownIcons={dropdownIcons}
          startValue={typeIdes}
        />
        <DropdownWithLeftIcon
          label="Buildings"
          placeholder="Select Buildings"
          onChange={item => setBuildingIdes(item.id)}
          startValue={buildingIdes}
          data={buildings}
        />
        <DateInput
          labelDate="Date Installed"
          startValue={installDate}
          onChange={value => {
            setInstallDate(new Date(value).toISOString());
          }}
        />
        <DateInput
          labelDate="Last Service Date"
          startValue={lastServiceDate}
          onChange={value => setLastServiceDate(new Date(value).toISOString())}
        />
        <CustomSlider
          keyItem={EverythingForkEnum.ASSET_COST}
          label="Purchase Price"
          startValue={minCost && maxCost && [minCost, maxCost]}
          onChange={value => {
            setMinCost(value[0]);
            setMaxCost(value[1]);
          }}
        />
        {/* <CustomSlider
          label="Asset Age"
          startValue={minAge && maxAge && [minAge, maxAge]}
          onChange={value => {
            setMinAge(value[0]);
            setMaxAge(value[1]);
          }}
        /> */}
        <Separator size={5} />

        {/* <BouncyCheckbox
          size={20}
          style={styles.checkbox}
          fillColor={colors.borderAssetColor}
          innerIconStyle={styles.borderRadius}
          iconStyle={styles.borderRadius}
          textStyle={styles.checkboxText}
          text="Has Inventory"
          isChecked={hasInventory}
          onPress={(isChecked: boolean) => {
            setHasInventory(isChecked);
          }}
        /> */}
        <BouncyCheckbox
          size={20}
          style={styles.checkbox}
          fillColor={colors.borderAssetColor}
          innerIconStyle={styles.borderRadius}
          iconStyle={styles.borderRadius}
          textStyle={styles.checkboxText}
          text="Is It Critical"
          isChecked={isCritical}
          onPress={(isChecked: boolean) => {
            setIsCritical(isChecked);
          }}
        />
        {/* <BouncyCheckbox
          size={20}
          style={styles.checkbox}
          fillColor={colors.borderAssetColor}
          innerIconStyle={styles.borderRadius}
          iconStyle={styles.borderRadius}
          textStyle={styles.checkboxText}
          text="Has plans"
          isChecked={hasPlans}
          onPress={(isChecked: boolean) => {
            setHasPlans(isChecked);
          }}
        /> */}
        <BouncyCheckbox
          size={20}
          style={styles.checkbox}
          fillColor={colors.borderAssetColor}
          innerIconStyle={styles.borderRadius}
          iconStyle={styles.borderRadius}
          textStyle={styles.checkboxText}
          text="Archived"
          isChecked={isArhived}
          onPress={(isChecked: boolean) => {
            setIsArhived(isChecked);
          }}
        />
        <DropdownWithSearch
          label="Sorted by"
          placeholder="Sorted by"
          onChange={item => setSortField(item.id)}
          startValue={sortField}
          data={[
            {id: 'name', name: 'Name'},
            {id: 'equipmentID', name: 'Equipment ID'},
          ]}
        />
        <DropdownWithSearch
          label="Direction"
          placeholder="Direction"
          onChange={item => setSortDirection(item.id)}
          startValue={sortDirection}
          data={[
            {id: 'ASC', name: 'Ascending'},
            {id: 'DESC', name: 'Decreasing'},
          ]}
        />
      </ScrollView>
      <View style={styles.buttons}>
        <Pressable
          onPress={resetFilters}
          style={[styles.button, styles.buttonReset]}>
          <Text style={[styles.buttonText, styles.buttonTextReset]}>
            Reset All
          </Text>
        </Pressable>
        <Pressable onPress={setFilters} style={styles.button}>
          <Text style={styles.buttonText}>Apply</Text>
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // gap: 10,
    maxHeight: SCREEN_HEIGHT * 0.7,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    flex: 1,
    backgroundColor: colors.mainActiveColor,
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.mainActiveColor,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  buttonTextReset: {
    color: colors.mainActiveColor,
  },
  buttonReset: {
    backgroundColor: '#F4F5F7',
    borderColor: colors.mainActiveColor,
  },
  checkbox: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginRight: -15,
  },
  borderRadius: {
    borderRadius: 5,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textColor,
  },
});
