import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const ArrowBackIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={41}
    height={40}
    fill="none"
    {...props}>
    <Path
      stroke={props.stroke ? props.stroke : '#848A9B'}
      strokeLinecap="round"
      strokeWidth={2}
      d="M24.063 11c-1 1.275-5 5.95-7 8.5l7 8.5"
    />
  </Svg>
);
