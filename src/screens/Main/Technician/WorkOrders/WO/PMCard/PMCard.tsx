import {FC, memo, useState} from 'react';
import {OrderType} from '../../../../../../types/StateType';
import {PMCardSmall} from './PMCardSmall';
import {PMCardBig} from './PMCardBig';

type PMCardProps = {
  order: OrderType;
  isOpen?: boolean;
  refreshList?: () => void;
  numColumn: number;
};

export const PMCard: FC<PMCardProps> = memo(({isOpen, order, numColumn}) => {
  const [open, setOpen] = useState<boolean>(isOpen || false);

  return (
    <>
      {open ? (
        <PMCardBig order={order} setOpen={setOpen} numColumn={numColumn} />
      ) : (
        <PMCardSmall order={order} setOpen={setOpen} numColumn={numColumn} />
      )}
    </>
  );
});
