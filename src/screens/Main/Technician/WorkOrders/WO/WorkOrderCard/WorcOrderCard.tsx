import {FC, memo, useState} from 'react';
import {OrderType} from '../../../../../../types/StateType';
import {colors} from '../../../../../../styles/colors';
import {enumPriority} from '../../../../../../enums/workOrders';
import {WOCardSmall} from './WOCardSmall';
import {WOCardBig} from './WOCardBig';

export const backgroundColor: any = {
  [enumPriority.MEDIUM]: colors.bottomActiveTextColor,
  [enumPriority.HIGH]: colors.bottomActiveTextColor,
  [enumPriority.LOW]: colors.bottomActiveTextColor,
  [enumPriority.CRITICAL]: colors.bottomActiveTextColor,
  [enumPriority.SCHEDULED]: colors.bottomActiveTextColor,
  Emergency: '#FFEDED',
};

export const backing: any = {
  [enumPriority.MEDIUM]: colors.mediumPriority,
  [enumPriority.HIGH]: colors.heighPriority,
  [enumPriority.LOW]: colors.lowPriority,
  [enumPriority.CRITICAL]: colors.criticalPriority,
  [enumPriority.SCHEDULED]: colors.scheduledPriority,
  Emergency: colors.criticalPriority,
};

type WorkOrderCardProps = {
  order: OrderType;
  isOpen?: boolean;
  hideMoreInfo?: boolean;
  refreshList?: () => void;
  numColumn: number;
};

export const WorkOrderCard: FC<WorkOrderCardProps> = memo(
  ({order, isOpen, numColumn, hideMoreInfo}) => {
    const [open, setOpen] = useState<boolean>(isOpen || false);

    return (
      <>
        {open ? (
          <WOCardBig
            order={order}
            setOpen={setOpen}
            numColumn={numColumn}
            hideMoreInfo={hideMoreInfo}
          />
        ) : (
          <WOCardSmall order={order} setOpen={setOpen} numColumn={numColumn} />
        )}
      </>
    );
  },
);
