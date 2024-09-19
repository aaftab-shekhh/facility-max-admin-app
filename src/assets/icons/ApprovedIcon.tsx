import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const ApprovedIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}>
    <Rect width={16} height={16} fill="#28A745" rx={5} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.25}
      d="m4 8 3 2.5L12 5"
    />
  </Svg>
);
