import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const CommunicationProceduresIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}>
    <Rect width={25} height={25} fill="#1280E0" rx={3.457} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m6.875 17.5.813-2.438C6.234 12.914 6.795 10.142 9 8.578c2.204-1.563 5.369-1.435 7.403.3 2.035 1.736 2.31 4.542.643 6.563-1.666 2.022-4.759 2.635-7.233 1.434l-2.938.625"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.167}
      d="M12.5 12.5v.007M10 12.5v.007M15 12.5v.007"
    />
  </Svg>
);
