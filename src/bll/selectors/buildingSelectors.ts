import {BuildingType} from '../../types/StateType';

export const getRoomsByFloorsId = (
  building: BuildingType | undefined,
  arrFloorsId: string[] | undefined,
) => {
  let res: any[] = [];

  if (arrFloorsId && building) {
    for (let i = 0; i < arrFloorsId?.length; i += 1) {
      const fl = building.floors?.filter(floor => floor.id === arrFloorsId![i]);
      res = fl?.map(floor => res.concat(floor.rooms))[0];
    }
  }
  return res;
};

export const getselectedFloorsById = (
  building: BuildingType | undefined,
  arrFloorsId: string[] | undefined,
) => {
  let res: any[] = [];

  if (arrFloorsId && building) {
    for (let i = 0; i < arrFloorsId?.length; i += 1) {
      res.push(building.floors.find(floor => floor.id === arrFloorsId[i]));
    }
  }
  return res;
};
