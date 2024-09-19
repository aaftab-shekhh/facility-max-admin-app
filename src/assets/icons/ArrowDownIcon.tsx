import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const ArrowDownIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}>
    <Path
      stroke={props.color || '#87939E'}
      strokeLinecap="round"
      strokeWidth={2}
      d="m15 8-5 4.5L5 8"
    />
  </Svg>
);
