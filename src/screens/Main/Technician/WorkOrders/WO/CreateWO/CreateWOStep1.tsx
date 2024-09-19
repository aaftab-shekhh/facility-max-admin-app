import {Pressable, ScrollView, StyleSheet, Switch, View} from 'react-native';
import {
  AccessControl,
  Recurring,
  Services,
  TypeWorkOrders,
} from '../../../../../../bll/state';
import {workOrderIcons} from '../../../../../../bll/icons';
import {FC, useMemo} from 'react';
import {Text} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import FastImage from 'react-native-fast-image';
import CheckBox from '../../../../../../assets/icons/CheckBox';
import {
  enumPriority,
  enumServices,
  enumTypeWO,
} from '../../../../../../enums/workOrders';
import {FormikErrors, FormikProps} from 'formik';
import {CreateWOForm} from '../../../../../../types/FormTypes';
import {switchStyles} from '../../../../../../styles/styles';

type CreateWOStep1Props = {
  values: CreateWOForm;
  setFieldValue: (field: string, value: any) => void;
  clearFields: (fields: string[]) => void;
  errors: FormikErrors<CreateWOForm>;
  submitCount: number;
  assetId?: string;
  subcontractorsForm: FormikProps<any>;
};

type TypeCardType = {
  type: {id: string; name: string};
  selectedType?: string;
  setFieldValue: (field: string, value: any) => void;
  clearFields: (fields: string[]) => void;
  values: CreateWOForm;
  subcontractorsForm: FormikProps<any>;
};

type SubTypeCardType = {
  subType: {id: string; name: string};
  selectedSubType?: string;
  setFieldValue: (field: string, value: any) => void;
};

const SubTypeCard: FC<SubTypeCardType> = ({
  setFieldValue,
  selectedSubType,
  subType,
}) => {
  return (
    <Pressable
      onPress={() => {
        subType.id === enumServices.HVAC
          ? setFieldValue('subType', enumServices.HVAC_COLD)
          : setFieldValue('subType', subType.id);
      }}
      style={[
        cardStyles.container,
        cardStyles.subTypeContainer,
        (selectedSubType === subType.id ||
          (subType.id === enumServices.HVAC &&
            (selectedSubType === enumServices.HVAC_HOT ||
              selectedSubType === enumServices.HVAC_COLD))) &&
          cardStyles.selectedContainer,
      ]}>
      {subType.id !== enumServices.HVAC ? (
        <>
          <Text style={cardStyles.name}>{subType.name}</Text>
          {selectedSubType === subType.id ? (
            <CheckBox />
          ) : (
            <View style={cardStyles.ring} />
          )}
        </>
      ) : (
        <>
          <Text style={cardStyles.name}>{subType.name}</Text>
          <View style={switchStyles.switchSubContainer}>
            <Text style={[cardStyles.name, {flex: undefined}]}>Too Cold</Text>
            <Switch
              trackColor={{
                false:
                  selectedSubType !== enumServices.HVAC_HOT &&
                  selectedSubType !== enumServices.HVAC_COLD
                    ? '#6C757D'
                    : colors.borderAssetColor,
                true: colors.deleteColor,
              }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor={
                selectedSubType !== enumServices.HVAC_HOT &&
                selectedSubType !== enumServices.HVAC_COLD
                  ? '#6C757D'
                  : colors.borderAssetColor
              }
              onValueChange={isChecked =>
                isChecked
                  ? setFieldValue('subType', enumServices.HVAC_HOT)
                  : setFieldValue('subType', enumServices.HVAC_COLD)
              }
              value={selectedSubType === enumServices.HVAC_HOT}
              style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
            />
            <Text style={[cardStyles.name, {flex: undefined}]}>Too Hot</Text>
          </View>
        </>
      )}
    </Pressable>
  );
};

const TypeCard: FC<TypeCardType> = ({
  type,
  values,
  setFieldValue,
  clearFields,
  subcontractorsForm,
}) => {
  const {type: selectedType} = values;
  const onChange = () => {
    setFieldValue('type', type.id);
    if (type.id === enumTypeWO.PREVENTATIVE_MAINTENANCE) {
      clearFields(['subType', 'expectedCompletionDate']);
      setFieldValue('isContractedPM', false);
      setFieldValue('displayOnCalendars', false);
    } else {
      clearFields([
        'subType',
        'frequencyPM',
        'startDate',
        'expectedDuration',
        'contractValue',
        'paymentTerms',
        'isContractedPM',
        'displayOnCalendars',
        'startWorkOrder',
      ]);
    }
    if (type.id === enumTypeWO.RECURRING_MAINTENANCE) {
      setFieldValue('priority', enumPriority.SCHEDULED);
    } else if (
      type.id !== enumTypeWO.RECURRING_MAINTENANCE &&
      values.priority === enumPriority.SCHEDULED
    ) {
      setFieldValue('priority', enumPriority.MEDIUM);
    }
    if (type.id === enumTypeWO.AMENITY_SPACE_BOOKING) {
      clearFields(['subcontractorId', 'assetsId', 'sendToSubcontractor']);
      subcontractorsForm.setFieldValue('emails', []);
    }
  };

  return (
    <>
      <Pressable
        onPress={onChange}
        style={[
          cardStyles.container,
          selectedType === type.id && cardStyles.selectedContainer,
        ]}>
        <FastImage
          source={workOrderIcons[type.id]}
          style={cardStyles.icon}
          defaultSource={workOrderIcons[type.id] as number}
          resizeMode="cover"
        />
        <Text style={cardStyles.name}>{type.name}</Text>
        {selectedType === type.id ? (
          <CheckBox />
        ) : (
          <View style={cardStyles.ring} />
        )}
      </Pressable>
      {selectedType === enumTypeWO.RECURRING_MAINTENANCE &&
        selectedType === type.id && (
          <>
            {Recurring.map(subType => (
              <SubTypeCard
                key={subType.id}
                subType={subType}
                setFieldValue={setFieldValue}
                selectedSubType={values.subType}
              />
            ))}
          </>
        )}
      {selectedType === enumTypeWO.SERVICE_REQUEST &&
        selectedType === type.id && (
          <>
            {Services.filter(
              el =>
                el.id !== enumServices.HVAC_COLD &&
                el.id !== enumServices.HVAC_HOT,
            ).map(subType => (
              <SubTypeCard
                key={subType.id}
                subType={subType}
                setFieldValue={setFieldValue}
                selectedSubType={values.subType}
              />
            ))}
          </>
        )}
      {selectedType === enumTypeWO.ACCESS_CONTROL &&
        selectedType === type.id && (
          <>
            {AccessControl.map(subType => (
              <SubTypeCard
                key={subType.id}
                subType={subType}
                setFieldValue={setFieldValue}
                selectedSubType={values.subType}
              />
            ))}
          </>
        )}
    </>
  );
};

export const CreateWOStep1: FC<CreateWOStep1Props> = ({
  values,
  setFieldValue,
  clearFields,
  subcontractorsForm,
  assetId,
}) => {
  const filteredTypeWorkOrders = useMemo(() => {
    if (assetId) {
      return TypeWorkOrders.filter(
        el =>
          el.id !== enumTypeWO.PREVENTATIVE_MAINTENANCE &&
          el.id !== enumTypeWO.EMERGENCY &&
          el.id !== enumTypeWO.AMENITY_SPACE_BOOKING,
      );
    } else {
      return TypeWorkOrders.filter(
        el =>
          el.id !== enumTypeWO.PREVENTATIVE_MAINTENANCE &&
          el.id !== enumTypeWO.EMERGENCY,
      );
    }
  }, [assetId]);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {filteredTypeWorkOrders.map(type => (
        <TypeCard
          key={type.id}
          type={type}
          values={values}
          setFieldValue={setFieldValue}
          clearFields={clearFields}
          subcontractorsForm={subcontractorsForm}
        />
      ))}
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 65,
  },
});

export const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLightColor,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 15,
    gap: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedContainer: {
    backgroundColor: '#44B8FF1A',
    borderColor: colors.mainActiveColor,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 11,
    paddingHorizontal: 7,
  },
  subTypeContainer: {
    backgroundColor: colors.disabledInputBackground,
    paddingRight: 18,
    paddingLeft: 26,
  },
  icon: {
    width: 36,
    height: 36,
  },

  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textColor,
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
