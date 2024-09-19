import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {AddFile} from '../../../../../../components/AddFile';
import {ChangeEvent, FC, useEffect, useState} from 'react';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {CreateWOForm} from '../../../../../../types/FormTypes';
import {AssetType} from '../../../../../../types/StateType';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {filesIcons} from '../../../../../../bll/icons';
import FastImage from 'react-native-fast-image';
import {FormikErrors} from 'formik';
import CheckBox from '../../../../../../assets/icons/CheckBox';
import {NotFound} from '../../../../../../components/NotFound';
import {InputItem} from '../../../../../../components/InputItam';

type CreateWOStep3Props = {
  setFiles: (value: DocumentPickerResponse[]) => void;
  files: DocumentPickerResponse[];
  errors: FormikErrors<CreateWOForm>;
  values: CreateWOForm;
  submitCount: number;
  handleChange: {
    (e: ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent<any>) => void;
  };
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void> | Promise<FormikErrors<CreateWOForm>>;
};

type AssetProps = {
  asset: AssetType;
  values: CreateWOForm;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void> | Promise<FormikErrors<CreateWOForm>>;
};

const Asset: FC<AssetProps> = ({asset, values, setFieldValue}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  let [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  let [selectedMOPs, setSelectedMOPs] = useState<string[]>([]);

  const [plans, setPlans] = useState<any[]>([]);
  const [mops, setMops] = useState<any[]>([]);

  const getPages = async () => {
    const res = await assetsAPI.getAssetPagesByAssetId(asset.id);
    setPlans(res.data.pages);
  };

  const getMOPs = async () => {
    const res = await assetsAPI.getAssetFiles({
      id: asset.id,
      params: {getKey: 'assetMopId'},
    });
    setMops(res.data.files);
  };

  const attachPlan = (id: string) => {
    setFieldValue(
      'plansId',
      selectedPlans.filter(plan => plan !== id),
    );
  };

  const deattachPlan = (id: string) => {
    !selectedPlans.some(planId => planId === id) &&
      setFieldValue('plansId', [...selectedPlans, id]);
  };

  const attachMOP = (id: string) => {
    setFieldValue(
      'mopsId',
      selectedMOPs.filter(mop => mop !== id),
    );
  };

  const deattachMOP = (id: string) => {
    !selectedMOPs.some(mopId => mopId === id) &&
      setFieldValue('mopsId', [...selectedMOPs, id]);
  };

  useEffect(() => {
    if (isOpen) {
      getPages();
      getMOPs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (values.plansId) {
      setSelectedPlans(values.plansId);
    }
    if (values.mopsId) {
      setSelectedMOPs(values.mopsId);
    }
  }, [values.plansId, values.mopsId]);

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.header, isOpen && styles.headerOpen]}>
        <Text style={styles.headerText}>{asset.name}</Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpen && (
        <View style={styles.assetData}>
          {plans.length === 0 && mops.length === 0 && (
            <NotFound title="Plans & MOPs not found" />
          )}
          {plans.length > 0 && (
            <>
              <Text style={styles.title}>Plans</Text>
              {plans.map(el => (
                <View key={el.id} style={styles.fileContainer}>
                  <FastImage
                    source={
                      el.rootFile?.mimetype?.split('/')[0] === 'image' ||
                      el.rootFile?.childFile?.split('/')[0] === 'image'
                        ? {uri: el.rootFile.url}
                        : filesIcons[el.rootFile?.mimetype || 'default']
                    }
                    style={styles.fileImage}
                    resizeMode="cover"
                  />
                  <View style={styles.checkbox}>
                    <Text style={styles.checkboxText}>
                      {el.rootFile?.name || el.childFile?.name}
                    </Text>
                    {selectedPlans.some(planId => planId === el.id) ? (
                      <Pressable hitSlop={20} onPress={() => attachPlan(el.id)}>
                        <CheckBox />
                      </Pressable>
                    ) : (
                      <Pressable
                        hitSlop={20}
                        onPress={() => deattachPlan(el.id)}>
                        <View style={styles.ring} />
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}

          {mops.length > 0 && (
            <>
              <Text style={styles.title}>MOPs</Text>

              {mops.map(el => (
                <View key={el.id} style={styles.fileContainer}>
                  <FastImage
                    source={
                      el.mimetype?.split('/')[0] === 'image'
                        ? {uri: el.url}
                        : filesIcons[el.mimetype]
                    }
                    style={styles.fileImage}
                    resizeMode="cover"
                  />
                  <View style={styles.checkbox}>
                    <Text style={styles.checkboxText}>{el.name}</Text>
                    {selectedMOPs.some(mopId => mopId === el.id) ? (
                      <Pressable hitSlop={20} onPress={() => attachMOP(el.id)}>
                        <CheckBox />
                      </Pressable>
                    ) : (
                      <Pressable
                        hitSlop={20}
                        onPress={() => deattachMOP(el.id)}>
                        <View style={styles.ring} />
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </View>
  );
};

export const CreateWOStep3: FC<CreateWOStep3Props> = ({
  setFiles,
  files,
  values,
  errors,
  handleChange,
  submitCount,
  setFieldValue,
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <InputItem
        label="Special instructions for technician"
        placeholder="Enter your instructions..."
        handleChange={handleChange('specialInstructions')}
        defaultValue={values.specialInstructions}
        multiline
        error={errors.specialInstructions}
        touched={submitCount > 0}
      />
      <Text style={styles.title}>Add Photos & Files</Text>
      <AddFile onChange={value => setFiles(value)} files={files} />
      {values.assetsId && values.assetsId.length && (
        <>
          <Text style={[styles.title, styles.subTitle]}>
            Would you like to attach any of these asset plans or MOPs to the
            work order?
          </Text>
          {values.assetsId.map(item => (
            <Asset
              key={item.id}
              asset={item}
              values={values}
              setFieldValue={setFieldValue}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 70,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: colors.textColor,
  },
  subTitle: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },
  assetData: {
    gap: 10,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 15,
  },
  checkbox: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  checkboxText: {
    flex: 1,
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
  },
  fileImage: {
    width: 24,
    height: 24,
    borderRadius: 8,
  },
  ring: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: colors.textSecondColor,
    borderWidth: 1,
    borderStyle: 'solid',
  },
});
