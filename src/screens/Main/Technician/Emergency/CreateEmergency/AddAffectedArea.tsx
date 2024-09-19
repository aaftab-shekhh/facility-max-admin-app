import {ScrollView, StyleSheet, View} from 'react-native';
import {DropdownWithSearch} from '../../../../../components/DropdownWithSearch';
import {FC, useEffect, useState} from 'react';
import {getBuildingsListTC} from '../../../../../bll/reducers/buildings-reducer';
import {BuildingType} from '../../../../../types/StateType';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {MyButton} from '../../../../../components/MyButton';
import {buildingsAPI} from '../../../../../api/buildingsApi';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {assetsAPI} from '../../../../../api/assetsApi';
import {dropdownIcons} from '../../../../../bll/icons';
import {AssetGetByEntityInclude} from '../../../../../enums/assets';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {getAffectedAreasTC} from '../../../../../bll/reducers/createNewEmergencyPlan';

type AddAffectedAreaProps = {
  emergencyPlanId: string;
  toggleModal: () => void;
};

export const AddAffectedArea: FC<AddAffectedAreaProps> = ({
  emergencyPlanId,
  toggleModal,
}) => {
  const dispatch = useAppDispatch();
  const {buildings} = useAppSelector(state => state.buildings);
  const {customerId} = useAppSelector(state => state.user.user);

  const [selectedBuilding, setSelectedBuilding] = useState<
    string | undefined
  >();

  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [assets, setAssets] = useState([]);

  const [selectedFloors, setSelectedFloors] = useState<string[] | undefined>();
  const [selectedRooms, setSelectedRooms] = useState<string[] | undefined>();
  const [selectedAssets, setSelectedAssets] = useState<string[] | undefined>();

  const add = async () => {
    const resCreate =
      await emergencyAPI.createOrUpdateAffectedAreaEmergencyPlan({
        emergencyPlanId,
        buildingId: selectedBuilding,
      });
    if (selectedFloors?.length) {
      selectedFloors.forEach(async floorId => {
        await emergencyAPI.affectedAreaAddFloor({
          floorId,
          affectedAreaId: resCreate.data.id,
        });
      });
    }
    if (selectedRooms?.length) {
      selectedRooms.forEach(async roomId => {
        await emergencyAPI.affectedAreaAddRoom({
          roomId,
          affectedAreaId: resCreate.data.id,
        });
      });
    }
    if (selectedAssets?.length) {
      selectedAssets.forEach(async assetId => {
        await emergencyAPI.affectedAreaAddAsset({
          assetId,
          affectedAreaId: resCreate.data.id,
        });
      });
    }
    dispatch(getAffectedAreasTC({emergencyPlanId}));
    toggleModal();
  };

  const onChangeBuilding = (item: BuildingType) => {
    setSelectedBuilding(item.id);
  };

  useEffect(() => {
    if (selectedFloors && selectedFloors.length > 0) {
      (async () => {
        try {
          const resRooms = await buildingsAPI.getRoomsByEntity({
            sortField: 'name',
            sortDirection: 'ASC',
            size: 10000,
            page: 1,
            floorIdes: selectedFloors,
          });
          setRooms(resRooms.data.rows);

          const resAssets = await assetsAPI.getAssetsByAntity({
            limit: 1000,
            offset: 0,
            sortField: 'name',
            sortDirection: 'ASC',
            floorIdes: selectedFloors,
            includeCriteria: [
              AssetGetByEntityInclude.CATEGORY,
              AssetGetByEntityInclude.FLOOR,
            ],
          });
          setAssets(
            resAssets.data.assets.map(el => ({
              ...el,
              file: el.category.file,
              iconName: el.category.name,
            })),
          );
        } catch {
          handleServerNetworkError(err.response.data);
        }
      })();

      if (selectedRooms?.length) {
        let roomArr: string[] = [];
        const currentRooms = rooms.filter(room =>
          selectedRooms.some(r => room.id === r),
        );

        currentRooms.forEach(room => {
          if (selectedFloors.some(el => el === room.floor.id)) {
            roomArr.push(room.id);
          }
        });
        setSelectedRooms(roomArr);
      }
      if (selectedAssets?.length) {
        let assetsArr: string[] = [];
        const currentAssets = assets.filter(asset =>
          selectedAssets.some(a => asset.id === a),
        );

        currentAssets.forEach(asset => {
          if (selectedFloors.some(el => el === asset.floor.id)) {
            assetsArr.push(asset.id);
          }
        });
        setSelectedAssets(assetsArr);
      }
    } else {
      setRooms([]);
      setSelectedRooms([]);
      setAssets([]);
      setSelectedAssets([]);
    }
  }, [selectedFloors]);

  useEffect(() => {
    if (selectedBuilding) {
      (async () => {
        try {
          const res = await buildingsAPI.getFloorsByBuildingId({
            sortField: 'name',
            sortDirection: 'ASC',
            size: 1000,
            page: 1,
            buildingId: selectedBuilding,
          });
          setFloors(res.data.rows);
        } catch {
          handleServerNetworkError(err.response.data);
        }
      })();
    }
  }, [selectedBuilding]);

  useEffect(() => {
    dispatch(
      getBuildingsListTC({
        customerId,
        page: 1,
        size: 10,
        sortField: 'name',
        sortDirection: 'ASC',
      }),
    );
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <DropdownWithSearch
          label="Building Name"
          data={buildings}
          onChange={onChangeBuilding}
          startValue={selectedBuilding}
          border
          placeholder="Select a Building"
          isIcon
          dropdownIcons={{
            defaultSource: require('../../../../../assets/img/Building.png'),
          }}
        />
        {floors && floors?.length > 0 && (
          <DropdownWithSearch
            label="Floor"
            data={floors}
            startValue={selectedFloors}
            onChange={setSelectedFloors}
            border
            multiSelect
            placeholder="Select Floors"
          />
        )}
        {rooms && rooms?.length > 0 && (
          <DropdownWithSearch
            label="Rooms/Office"
            data={rooms}
            onChange={setSelectedRooms}
            startValue={selectedRooms}
            border
            multiSelect
            placeholder="Select Rooms"
          />
        )}
        {assets && assets?.length > 0 && (
          <DropdownWithSearch
            label="Asset"
            data={assets}
            onChange={setSelectedAssets}
            startValue={selectedAssets}
            border
            multiSelect
            isIcon
            dropdownIcons={dropdownIcons}
            placeholder="Select Assets"
          />
        )}
      </ScrollView>
      <View style={[styles.buttons]}>
        <MyButton text={'Cancel'} action={toggleModal} style="disabled" />
        <MyButton
          text={'Add'}
          action={add}
          style={!selectedBuilding ? 'disabled' : 'main'}
          disabled={!selectedBuilding}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 10,
    paddingBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    position: 'relative',
  },
});
