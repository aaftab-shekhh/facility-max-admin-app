import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

export const InfoIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Circle
      cx={12}
      cy={12}
      r={9}
      stroke={props.stroke ? props.stroke : '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      stroke={props.stroke ? props.stroke : '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M11.999 8h.01"
    />
    <Path
      stroke={props.stroke ? props.stroke : '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11 12h1v4h1"
    />
  </Svg>
);
