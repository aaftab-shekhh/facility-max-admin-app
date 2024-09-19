import {useFormik} from 'formik';
import {StyleSheet, View} from 'react-native';
import {InputItem} from '../../../../../../components/InputItam';
import {
  BuildingType,
  FloorType,
  OrderType,
  RoomType,
} from '../../../../../../types/StateType';
import {FC, useEffect, useMemo, useState} from 'react';
import {stylesModal} from '../../../../../../styles/styles';
import {
  AccessControl,
  DropdownServices,
  Priority,
  TypeWorkOrders,
} from '../../../../../../bll/state';
import {DropdownWithLeftIcon} from '../../../../../../components/DropdownWithLeftIcon';
import moment from 'moment';
import {useAppDispatch, useAppSelector} from '../../../../../../hooks/hooks';
import {
  setWorkOrder,
  updateWOTC,
} from '../../../../../../bll/reducers/wo-Reducer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {buildingsAPI} from '../../../../../../api/buildingsApi';
import {CreateWOForm} from '../../../../../../types/FormTypes';
import {workOrderIcons} from '../../../../../../bll/icons';
import {sortedBy} from '../../../../../../utils/sorted';
import {DateTimeInput} from '../../../../../../components/DateTimeInput';
import {MyButton} from '../../../../../../components/MyButton';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';
import {setRequest} from '../../../../../../bll/reducers/offline-reducer';
import {setNewModuleItem} from '../../../../../../bll/reducers/local-reducer';
import {OFFLINE_ACTIONS, OFFLINE_METHOD} from '../../../../../../enums/offline';
import {GetRoomsParams} from '../../../../../../api/ApiTypes';
import {handleServerNetworkError} from '../../../../../../utils/handleServerNetworkUtils';
import {createWOSchema} from '../../../../../../utils/validationSchemes';
import {enumStatuses, enumTypeWO} from '../../../../../../enums/workOrders';

type EditInfoWOProps = {
  order: OrderType;
  setIsEdit: () => void;
  numColumn: number;
};

export const closingStatuses = [
  {id: enumStatuses.NEW, name: enumStatuses.NEW},
  {id: enumStatuses.IN_PROGRESS, name: enumStatuses.IN_PROGRESS},
  {id: enumStatuses.ON_HOLD, name: enumStatuses.ON_HOLD},
  {id: enumStatuses.CANCELLED, name: enumStatuses.CANCELLED},
  {id: enumStatuses.COMPLETED, name: enumStatuses.COMPLETED},
  {id: enumStatuses.PENDING_REVIEW, name: enumStatuses.PENDING_REVIEW},
];

export const EditInfoWO: FC<EditInfoWOProps> = ({
  order,
  setIsEdit,
  numColumn,
}) => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const {workorder} = useAppSelector(state => state.local.db);
  const {customerId, id, role, regionId} = useAppSelector(
    state => state.user.user,
  );

  const {getLocalBuildings, getLocalFloors, getLocalRooms} =
    useLocalStateSelector();

  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [floors, setFloors] = useState<FloorType[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const types = TypeWorkOrders.filter(
    el => el.name !== enumTypeWO.PREVENTATIVE_MAINTENANCE,
  );

  const filteredStatuses = useMemo(() => {
    return closingStatuses;
  }, [role, id, order.creatorId]);

  const localEdit = (data: any) => {
    dispatch(
      setRequest({
        action: OFFLINE_ACTIONS.EDIT_WO,
        method: OFFLINE_METHOD.PATCH,
        model: 'workorder',
        id: order.id,
        body: data,
      }),
    );

    dispatch(
      setNewModuleItem({
        model: 'workorder',
        id: order.id,
        body: {...workorder[order.id], ...values},
      }),
    );

    dispatch(setWorkOrder({...order, ...values}));
    setIsEdit();
  };

  const netEdit = async (data: any) => {
    try {
      dispatch(updateWOTC(data));

      setIsEdit();
    } catch (err) {
      console.log(err);
    }
  };

  const edit = async (values: any) => {
    let data = new FormData();

    for (const el in values) {
      if (!Array.isArray(values[el])) {
        data.append(`${el}`, values[el]);
      } else {
        values[el].forEach((id: string | {id: string}) => {
          typeof id === 'string'
            ? data.append(el + '[]', id)
            : data.append(el + '[]', id.id);
        });
      }
    }

    isConnected ? netEdit(data) : localEdit(values);
  };

  const initialValues = {
    workOrderId: order.id,
    type: order.type,
    subType: order.subType,
    priority: order.priority,
    buildingId: order.buildingId,
    floorId: order.floorId,
    roomId: order.roomId,
  } as CreateWOForm;

  const {
    values,
    errors,
    handleChange,
    setFieldValue,
    handleSubmit,
    validateForm,
    submitCount,
  } = useFormik({
    initialValues,
    onSubmit: edit,
    validationSchema: createWOSchema,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (submitCount > 0 && Object.values(errors).length > 0) {
      handleServerNetworkError({message: Object.values(errors)[0]});
    }
  }, [submitCount, errors]);

  useEffect(() => {
    isConnected
      ? (async () => {
          const res = await buildingsAPI.getBuildingsListByRegion({
            customerId,
            regionIds: [regionId],
            page: 1,
            size: 100,
            sortField: 'name',
            sortDirection: 'ASC',
            keySearchValue: '',
          });
          setBuildings(
            res.data.rows.map(el => ({
              ...el,
              file: el.avatar,
            })),
          );
        })()
      : setBuildings(getLocalBuildings({regionId}).payload as BuildingType[]);
  }, [isConnected, regionId, customerId]);

  useEffect(() => {
    if (order.subType) {
      setFieldValue('subType', order.subType);
    }
    if (order.title) {
      setFieldValue('title', order.title);
    }
    if (order.priority) {
      setFieldValue('priority', order.priority);
    }
    if (order.floorId) {
      setFieldValue('floorId', order.floorId);
    }
    if (order.roomId) {
      setFieldValue('roomId', order.roomId);
    }
  }, [order]);

  useEffect(() => {
    if (values.buildingId) {
      isConnected
        ? (async () => {
            if (values.type !== enumTypeWO.AMENITY_SPACE_BOOKING) {
              const res = await buildingsAPI.getFloorsByBuildingId({
                buildingId: values.buildingId,
                page: 1,
                size: 10,
                sortField: 'name',
                sortDirection: 'ASC',
              });
              setFloors(res.data.rows);
            } else {
              const params: GetRoomsParams = {
                buildingId: values.buildingId,
                isAmenity: true,
                page: 1,
                size: 10,
                sortField: 'name',
                sortDirection: 'ASC',
                keySearchValue: '',
              };
              const res = await buildingsAPI.getRoomsByEntity(params);
              setRooms(res.data.rows);
            }
          })()
        : setFloors(
            getLocalFloors({buildingId: values.buildingId})
              .payload as FloorType[],
          );
    }
  }, [values.buildingId, values.type, isConnected]);

  useEffect(() => {
    if (values.floorId) {
      isConnected
        ? (async () => {
            const res = await buildingsAPI.getRoomsByEntity({
              floorIdes: [values.floorId!],
              page: 1,
              size: 10,
              sortField: 'name',
              sortDirection: 'ASC',
              keySearchValue: '',
            });
            setRooms(res.data.rows);
          })()
        : setRooms(
            getLocalRooms({floorId: values.floorId}).payload as RoomType[],
          );
    }
  }, [values.floorId, isConnected]);

  return (
    <>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 70,
          marginHorizontal: 15,
          gap: 10,
        }}>
        <InputItem
          disabled={order.creator.id !== id}
          label="Title"
          defaultValue={order.title}
          handleChange={v => {
            setFieldValue('title', v);
          }}
        />
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <DropdownWithLeftIcon
            label="WO Type"
            disable
            onChange={item => {
              setFieldValue('type', item.id);
              setFieldValue('subType', null);
              if (
                values.type !== enumTypeWO.AMENITY_SPACE_BOOKING &&
                item.id === enumTypeWO.AMENITY_SPACE_BOOKING
              ) {
                setFloors([]);
                setFieldValue('floorId', null);
              }
              if (
                values.type === enumTypeWO.AMENITY_SPACE_BOOKING &&
                item.id !== enumTypeWO.AMENITY_SPACE_BOOKING
              ) {
                setFieldValue('roomId', null);
                validateForm();
              }
            }}
            startValue={values.type}
            data={types}
            dropdownIcons={workOrderIcons}
            isIcon
          />
          {values.type === enumTypeWO.SERVICE_REQUEST && (
            <DropdownWithLeftIcon
              disable
              label="Service Type"
              onChange={item => setFieldValue('subType', item.name)}
              startValue={values.subType}
              data={DropdownServices}
            />
          )}
          {values.type === enumTypeWO.ACCESS_CONTROL && (
            <DropdownWithLeftIcon
              disable
              label="Access Control"
              onChange={item => setFieldValue('subType', item.name)}
              startValue={values.subType}
              data={AccessControl}
            />
          )}
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <DropdownWithLeftIcon
            disable
            label="Work Order status"
            onChange={item => setFieldValue('status', item.id)}
            startValue={order.status}
            data={filteredStatuses}
          />
          <DropdownWithLeftIcon
            label="Priority"
            onChange={item => setFieldValue('priority', item.id)}
            startValue={values.priority}
            data={Priority}
          />
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <InputItem
            disabled
            label="Created On"
            defaultValue={moment(order.createdDate).format('M/D/YYYY')}
          />
          <InputItem
            disabled
            label="Creator"
            defaultValue={`${order.creator?.firstName} ${order.creator?.lastName}`}
          />
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <DropdownWithLeftIcon
            label="Building"
            onChange={item => {
              setFieldValue('buildingId', item.id);
              setFieldValue('floorId', null);
              setFieldValue('roomId', null);
            }}
            isIcon
            dropdownIcons={{
              defaultSource: require('../../../../../../assets/img/Building.png'),
            }}
            startValue={values.buildingId}
            data={sortedBy('name', buildings)}
            placeholder="Select a Building"
          />
          {values.buildingId &&
            floors?.length > 0 &&
            values.type !== enumTypeWO.AMENITY_SPACE_BOOKING && (
              <DropdownWithLeftIcon
                label="Floor (Optional)"
                onChange={item => {
                  setFieldValue('floorId', item.id);
                  setFieldValue('roomId', null);
                }}
                data={sortedBy('name', floors)}
                startValue={values.floorId}
                placeholder="Select a Floor"
              />
            )}
          {(values.floorId ||
            values.type === enumTypeWO.AMENITY_SPACE_BOOKING) &&
            rooms?.length > 0 && (
              <DropdownWithLeftIcon
                label={
                  values.type === enumTypeWO.AMENITY_SPACE_BOOKING
                    ? 'Amenity Space'
                    : 'Room/Office (Optional)'
                }
                onChange={item => {
                  setFieldValue('roomId', item.id);
                }}
                data={sortedBy('name', rooms)}
                startValue={values.roomId}
                placeholder={
                  values.type === enumTypeWO.AMENITY_SPACE_BOOKING
                    ? 'Select Amenity Space'
                    : 'Select Room/Office'
                }
                error={errors.roomId}
                touched={submitCount > 0}
              />
            )}
        </View>
        <View style={numColumn === 1 ? styles.column : styles.row}>
          <DateTimeInput
            labelDate="Expected Completion Date"
            labelTime="Time"
            startValue={values.expectedCompletionDate}
            onChange={value => {
              setFieldValue(
                'expectedCompletionDate',
                new Date(value).toISOString(),
              );
            }}
            error={errors.expectedCompletionDate}
          />
          <InputItem
            numeric
            label="Estimated labor hours"
            defaultValue={values.estimatedLaborHoursTech}
            handleChange={handleChange('estimatedLaborHoursTech')}
            error={errors.estimatedLaborHoursTech}
          />
        </View>
        <InputItem
          label="Description"
          defaultValue={order.description}
          handleChange={handleChange('description')}
          multiline
          error={errors.description}
        />
      </KeyboardAwareScrollView>
      <View style={stylesModal.modalButtons}>
        <MyButton text={'Cancel'} action={setIsEdit} style="mainBorder" />
        <MyButton text={'Save'} action={() => handleSubmit()} style="main" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  column: {
    gap: 10,
  },
  row: {
    gap: 10,
    flexDirection: 'row',
  },
});
