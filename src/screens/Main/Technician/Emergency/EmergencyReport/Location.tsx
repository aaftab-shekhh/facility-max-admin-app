import {useEffect, useState} from 'react';
import {buildingsAPI} from '../../../../../api/buildingsApi';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {DropdownWithLeftIcon} from '../../../../../components/DropdownWithLeftIcon';
import {
  changeReporRegionTC,
  changeReportBuildingTC,
  changeReportFloorTC,
  changeReportRoomTC,
} from '../../../../../bll/reducers/createNewEmergencyReport';
import {regionAPI} from '../../../../../api/regionApi';
import {StyleSheet, View} from 'react-native';
import {useOrientation} from '../../../../../hooks/useOrientation';

export const Location = () => {
  const dispatch = useAppDispatch();
  const {customerId} = useAppSelector(state => state.user.user);
  const {region, building, floor, room} = useAppSelector(
    state => state.createNewEmergencyResport.newEmergencyReport,
  );

  const {numColumn, onLayout} = useOrientation();

  const [regions, setRegions] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await regionAPI.getRegionsByCustomerId({
        customerId,
        page: 1,
        size: 100,
        sortField: 'name',
        sortDirection: 'ASC',
      });
      setRegions(res.data.rows);
    })();
  }, [customerId]);

  useEffect(() => {
    if (region?.id) {
      (async () => {
        const res = await buildingsAPI.getBuildingByRegionId({
          customerId,
          regionIds: [region?.id],
          page: 1,
          size: 100,
          sortField: 'name',
          sortDirection: 'ASC',
        });
        setBuildings(
          res.data.rows.map(el => ({
            ...el,
            file: el.avatar,
          })),
        );
      })();
    }
  }, [region?.id, customerId]);

  useEffect(() => {
    if (building?.id) {
      (async () => {
        const res = await buildingsAPI.getFloorsByBuildingId({
          buildingId: building?.id,
          page: 1,
          size: 100,
          sortField: 'name',
          sortDirection: 'ASC',
          keySearchValue: '',
        });
        setFloors(res.data.rows);
      })();
    }
  }, [building?.id]);

  useEffect(() => {
    if (floor?.id) {
      (async () => {
        const res = await buildingsAPI.getRoomsByEntity({
          floorIdes: [floor?.id],
          page: 1,
          size: 100,
          sortField: 'name',
          sortDirection: 'ASC',
          keySearchValue: '',
        });
        setRooms(res.data.rows);
      })();
    }
  }, [floor?.id]);

  return (
    <View
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}
      style={{gap: 10}}>
      <View style={numColumn === 1 ? styles.column : styles.row}>
        <DropdownWithLeftIcon
          label="Region"
          onChange={item => {
            // dispatch(changeReportRoomTC({}));
            // dispatch(changeReportFloorTC({}));
            // dispatch(changeReportBuildingTC({}));
            dispatch(changeReporRegionTC({regionId: item.id}));
          }}
          data={regions}
          startValue={region?.id}
          placeholder="Select a Region"
        />
        {region?.id && buildings.length > 0 && (
          <DropdownWithLeftIcon
            label="Building"
            onChange={item => {
              // dispatch(changeReportRoomTC({}));
              // dispatch(changeReportFloorTC({}));
              if (item.id) {
                dispatch(changeReportBuildingTC({buildingId: item.id}));
              }
            }}
            isIcon
            dropdownIcons={{
              defaultSource: require('../../../../../assets/img/Building.png'),
            }}
            data={buildings}
            startValue={building?.id}
            placeholder="Select a Building"
          />
        )}
      </View>
      <View style={numColumn === 1 ? styles.column : styles.row}>
        {building?.id && floors.length > 0 && (
          <DropdownWithLeftIcon
            label="Floor"
            onChange={item => {
              // dispatch(changeReportRoomTC({}));
              dispatch(changeReportFloorTC({floorId: item.id}));
            }}
            data={floors}
            startValue={floor?.id}
            placeholder="Select a Floor"
          />
        )}
        {floor?.id && rooms.length > 0 && (
          <DropdownWithLeftIcon
            label="Room"
            onChange={item => {
              dispatch(changeReportRoomTC({roomId: item.id}));
            }}
            data={rooms}
            startValue={room?.id}
            placeholder="Select a Room"
          />
        )}
      </View>
    </View>
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
