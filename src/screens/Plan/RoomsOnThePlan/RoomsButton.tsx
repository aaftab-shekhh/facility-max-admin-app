import {useNetInfo} from '@react-native-community/netinfo';
import {useAppDispatch, useAppSelector} from '../../../hooks/hooks';
import {RoomButton} from './RoomButton';
import {useLocalStateSelector} from '../../../hooks/useLocalStateSelector';
import {
  getRoomsPointsByPageId,
  setRooms,
} from '../../../bll/reducers/plan-Reducer';
import {FC, useEffect} from 'react';

type RoomsButtonProps = {
  pageId: string;
};

export const RoomsButton: FC<RoomsButtonProps> = ({pageId}) => {
  const {rooms} = useAppSelector(state => state.plan);
  const showRooms = rooms.filter(room => room.show);

  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();
  const {getLocalRoomsByPageId} = useLocalStateSelector();

  const getRooms = () => {
    pageId &&
      (isConnected
        ? dispatch(getRoomsPointsByPageId({pageId}))
        : dispatch(setRooms(getLocalRoomsByPageId(pageId))));
  };

  useEffect(() => {
    getRooms();
  }, [isConnected, pageId]);

  return (
    <>
      {showRooms.map(room => (
        <RoomButton
          key={room.id}
          room={room}
          pageId={pageId}
          getRooms={getRooms}
        />
      ))}
    </>
  );
};
