import React, {FC, memo} from 'react';
import {RoomOnThePlanType} from '../../../types/StateType';
import {Path, Points, Skia, vec} from '@shopify/react-native-skia';

type RoomOnThePlanProps = {
  width: number;
  height: number;
  room: RoomOnThePlanType;
};

export const RoomOnThePlan: FC<RoomOnThePlanProps> = memo(({room}) => {
  const color = room.points[0].color;

  const roomPoints = [...room.points, room.points[0]];
  const points = roomPoints.map(el => vec(el.x, el.y));

  const path = Skia.Path.Make();

  path.moveTo(room.points[0].x, room.points[0].y);
  for (let i = 1; i <= room.points.length - 1; i += 1) {
    path.lineTo(room.points[i].x, room.points[i].y);
  }

  path.close();

  return (
    <>
      <Path path={path} color={color} opacity={0.3} />
      <Points
        points={points}
        mode="polygon"
        color={color}
        style="stroke"
        strokeWidth={2}
      />
    </>
  );
});
