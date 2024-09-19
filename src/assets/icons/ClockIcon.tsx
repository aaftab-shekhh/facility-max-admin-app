import * as React from 'react';
import Svg, {SvgProps, Path, Rect, Circle} from 'react-native-svg';

export const ClockIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}>
    <Circle
      cx={12.5}
      cy={12.5}
      r={9}
      stroke={props.stroke ? props.stroke : '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      stroke={props.stroke ? props.stroke : '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.5 7.5v5l3 3"
    />
  </Svg>
);
