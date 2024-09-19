import {FC, memo} from 'react';
import {useAppSelector} from '../../../hooks/hooks';
import {RoomOnThePlan} from './RoomOnThePlan';

type RoomsOnThePlanProps = {
  width: number;
  height: number;
  version?: string;
};

export const RoomsOnThePlan: FC<RoomsOnThePlanProps> = memo(
  ({width, height}) => {
    const {rooms} = useAppSelector(state => state.plan);
    const showRooms = rooms.filter(room => room.show);

    return (
      <>
        {showRooms.map(room => (
          <RoomOnThePlan
            key={room.id}
            room={room}
            width={width}
            height={height}
          />
        ))}
      </>
    );
  },
);
