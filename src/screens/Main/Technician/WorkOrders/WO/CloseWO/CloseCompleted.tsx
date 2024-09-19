import {StyleSheet, Text, View} from 'react-native';
import {checkboxStyles, styleInput} from '../../../../../../styles/styles';
import {AddFile} from '../../../../../../components/AddFile';
import {InputItem} from '../../../../../../components/InputItam';
import {useAppSelector} from '../../../../../../hooks/hooks';
import {colors} from '../../../../../../styles/colors';
import {Asset} from './Asset';
import {DateTimeInput} from '../../../../../../components/DateTimeInput';
import {useCallback, useEffect, useState} from 'react';
import {inventoriesAPI} from '../../../../../../api/inventoryApi';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from 'react-native-bouncy-checkbox-group';
import {Part} from './Part';
import {AddInventory} from './Reasons/AddInventory';
import {CreatePart} from './CreatePart';
import {MyButton} from '../../../../../../components/MyButton';
import {useOrientation} from '../../../../../../hooks/useOrientation';
import {AssignnmentsTeam} from '../AssignnmentsWO/AssigmentsTeam';
import {enumTypeWO} from '../../../../../../enums/workOrders';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const partActions = [
  {id: '0', text: 'Select from current inventory'},
  {id: '1', text: 'Add a new part'},
];

export const CloseCompleted = ({
  handleChange,
  errors,
  setFieldValue,
  values,
  onChangeFile,
  submitCount,
  partsForm,
  estimated,
}: any) => {
  const {workOrder} = useAppSelector(state => state.wo);
  const {buckets, id: workOrderId} = workOrder;

  const {numColumn, onLayout} = useOrientation();
  const [isUsedParts, setIsUsedParts] = useState(false);

  const [parts, setParts] = useState([]);
  const [count, setCount] = useState(0);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const [partAction, setPartAction] = useState<string | number>('0');

  // const getTech = async () => {
  //   setIsLoading(true);
  //   if (workOrderId) {
  //     try {
  //       setTeams(buckets);
  //       const res = await woAPI.getWOTech({workOrderId});
  //       setTeams(prev =>
  //         prev.map(el => ({
  //           ...el,
  //           technicians: res.data
  //             .filter(t => t.technician.buckets.some(b => b.id === el.id))
  //             .map(t => ({
  //               ...t.technician,
  //               WorkOrderTechnician: workOrder.technicians?.find(
  //                 tech => tech.id === t.technician.id,
  //               )?.WorkOrderTechnician,
  //             })),
  //         })),
  //       );
  //     } catch (err) {
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  const getInventory = useCallback(async () => {
    try {
      const res = await inventoriesAPI.getInventories({
        limit: 100,
        offset: 0,
        allocatedToWorkOrderId: workOrder.id,
      });

      setParts(res.data.payload);
      setCount(res.data.count);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  }, [workOrder.id]);

  const deletePart = (id: string) => {
    partsForm.setFieldValue('availableParts', [
      ...partsForm.values.availableParts,
      id,
    ]);
    setParts(prev => prev.filter(el => el.id !== id));
  };

  const onChangeInventories = newParts => {
    partsForm.setFieldValue(
      'allocateParts',
      newParts.map(el => el.id),
    );
    setParts(newParts);
  };

  useEffect(() => {
    // getTech();
    getInventory();
  }, [workOrder]);

  return (
    <View
      style={styles.container}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}>
      <DateTimeInput
        labelDate="Start Date"
        labelTime="Start Time"
        startValue={estimated.startDate}
        onChange={() => {}}
        error={
          errors.startDate ||
          (!estimated.startDate && 'None of the technicians logged time')
        }
        touched
        disabled
      />
      <DateTimeInput
        labelDate="End Date"
        labelTime="End Time"
        startValue={estimated.endDate}
        onChange={() => {}}
        error={
          errors.endDate ||
          (!estimated.endDate && 'None of the technicians logged time')
        }
        touched
        disabled
      />
      <InputItem
        numeric
        label="Total Labor Hours Spent"
        defaultValue={estimated.hoursSpent}
        handleChange={value => {
          setFieldValue('hoursSpent', +value);
        }}
        error={
          errors.hoursSpent ||
          (!estimated.hoursSpent && 'None of the technicians logged time')
        }
        touched
        disabled
      />
      {workOrder.subcontractor && (
        <>
          <InputItem
            label="Subcontractor"
            defaultValue={workOrder.subcontractor.name}
            disabled
          />
          <InputItem
            numeric
            label="Subcontractor fee"
            defaultValue={values.subcontractorFee}
            handleChange={handleChange('subcontractorFee')}
            error={errors.subcontractorFee}
            touched={submitCount > 0}
          />
        </>
      )}
      <AssignnmentsTeam />
      {workOrder.type !== enumTypeWO.AMENITY_SPACE_BOOKING &&
        workOrder.type !== enumTypeWO.RECURRING_MAINTENANCE &&
        workOrder.type !== enumTypeWO.PREVENTATIVE_MAINTENANCE && (
          <>
            <Text style={styles.headerText}>Work Order assets</Text>
            {workOrder?.assets &&
              workOrder.assets.length > 0 &&
              workOrder.assets.map(asset => (
                <Asset key={asset.id} asset={asset} />
              ))}
            <BouncyCheckbox
              size={20}
              style={checkboxStyles.checkbox}
              fillColor={colors.borderAssetColor}
              innerIconStyle={checkboxStyles.borderRadius}
              iconStyle={checkboxStyles.borderRadius}
              textStyle={checkboxStyles.checkboxText}
              text={'Add parts used in this Work Order'}
              isChecked={isUsedParts}
              onPress={(isChecked: boolean) => {
                setIsUsedParts(isChecked);
                partsForm.resetForm();
              }}
            />
            {isUsedParts && (
              <>
                {parts.length + partsForm.values?.newParts?.length < 5 ? (
                  <BouncyCheckboxGroup
                    data={partActions}
                    style={{flexDirection: 'column'}}
                    checkboxProps={{
                      textStyle: styles.checkboxText,
                      fillColor: '#1B6BC0',
                      size: 20,
                      textContainerStyle: {flex: 1, paddingVertical: 5},
                      iconImageStyle: {
                        backgroundColor: '#FFF',
                        borderRadius: 5,
                      },
                    }}
                    //@ts-ignore
                    initial={partAction} //error in the library. this is how it works correctly, otherwise the android app crash
                    onChange={(selectedItem: ICheckboxButton) => {
                      setPartAction(selectedItem.id);
                    }}
                  />
                ) : (
                  <View style={styles.infoContainer}>
                    <View style={styles.mark}>
                      <Text style={styles.markText}>!</Text>
                    </View>
                    <Text style={styles.infoText}>
                      You have reached the maximum number of spare parts that
                      can be added to a work order.
                    </Text>
                  </View>
                )}

                {parts.length > 0 &&
                  parts.map(el => (
                    <Part key={el.id} part={el} deletePart={deletePart} />
                  ))}
                {partsForm.values?.newParts?.length > 0 &&
                  partsForm.values?.newParts.map((el, index) => (
                    <CreatePart
                      key={index + 1}
                      partsForm={partsForm}
                      index={index}
                    />
                  ))}
                {partAction === '0' &&
                  parts.length + partsForm.values?.newParts?.length < 5 && (
                    <AddInventory
                      onChangeInventories={onChangeInventories}
                      selectedParts={parts}
                      maxCount={5 - partsForm.values?.newParts?.length}
                      hideSelected
                    />
                  )}
                {partAction === '1' &&
                  parts.length + partsForm.values?.newParts?.length < 5 && (
                    <MyButton
                      style="primary"
                      action={() => {
                        partsForm.setFieldValue('newParts', [
                          ...partsForm.values?.newParts,
                          {
                            manufacturer: '',
                            manufacturerPartNumber: '',
                            price: '',
                          },
                        ]);
                      }}
                      text="+ Add Part"
                    />
                  )}
              </>
            )}
          </>
        )}
      <InputItem
        numeric
        label="Additional Expenses"
        defaultValue={values.additionalExpenses}
        handleChange={val => setFieldValue('additionalExpenses', +val)}
        error={errors.additionalExpenses}
        touched
      />
      <InputItem
        label="Note"
        handleChange={handleChange('noteText')}
        multiline
        placeholder="Enter your note..."
        error={errors.noteText}
      />
      <Text style={styleInput.label}>Attach Expense Documentation</Text>
      <AddFile onChange={value => onChangeFile(value)} />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.calendarBsckGround,
  },

  switchSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  switchText: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
  },

  status: {
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 14,
  },

  footer: {
    height: 15,
  },

  line: {
    marginTop: 15,
    marginBottom: -5,
    backgroundColor: colors.backgroundGreyColor,
    height: 2,
  },

  assetContainer: {
    gap: 10,
    borderRadius: 8,
    backgroundColor: colors.backgroundLightColor,
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

  assetInfoContainer: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 12,
    marginHorizontal: 10,
    borderRadius: 8,
    gap: 10,
  },

  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    paddingVertical: 10,
    color: colors.textColor,
  },

  checkboxGroup: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },

  checkboxText: {
    flex: 1,
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },

  discriptionText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    textAlignVertical: 'center',
    color: colors.textColor,
    columnGap: 10,
  },

  newAssetFormContainer: {
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
    borderRadius: 8,
  },

  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },
  column: {
    gap: 10,
  },
  row: {
    gap: 10,
    flexDirection: 'row',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.heighPriority,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ffc10723',
    alignItems: 'center',
  },
  infoText: {
    color: colors.heighPriority,
  },
  mark: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: colors.heighPriority,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: 5,
  },
  markText: {
    color: colors.heighPriority,
    fontSize: 10,
  },

  photo: {
    height: 290,
    width: '100%',
    borderRadius: 10,
  },

  cross: {
    position: 'absolute',
    width: 26,
    height: 26,
    backgroundColor: colors.mainActiveColor,
    justifyContent: 'center',
    alignItems: 'center',
    top: 5,
    right: 5,
    borderRadius: 13,
    zIndex: 1,
  },
  addFile: {
    height: 290,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.mainActiveColor,
    backgroundColor: '#44B8FF1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    color: colors.mainActiveColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
});
