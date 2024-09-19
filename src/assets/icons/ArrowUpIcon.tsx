import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const ArrowUpIcon = (props: SvgProps) => (
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
      d="m5 12 5-4.5 5 4.5"
    />
  </Svg>
);
