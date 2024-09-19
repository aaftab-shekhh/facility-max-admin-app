import * as React from 'react';
import Svg, {SvgProps, Path, Rect, Circle} from 'react-native-svg';

export const EmergencyViewIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Path
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="M12 7.5H9a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h8.546M27 18v-7.5a3 3 0 0 0-3-3h-3"
    />
    <Rect
      width={9}
      height={6}
      x={12}
      y={4.5}
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      rx={1.6}
    />
    <Path
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="M12 16.5h6M12 22.5h4.5"
    />
    <Circle
      cx={24.75}
      cy={26.25}
      r={3.75}
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
    />
    <Path
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="m27.2 29.6 3.75 3.75"
    />
  </Svg>
);
