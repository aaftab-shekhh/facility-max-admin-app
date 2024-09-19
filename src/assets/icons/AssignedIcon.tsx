import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const AssignedIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={16}
    fill="none"
    {...props}>
    <Rect
      width={10.667}
      height={10.667}
      x={3.417}
      y={2.667}
      stroke={props.color || '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={2}
    />
    <Path
      stroke={props.color || '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m6.75 8 1.333 1.333 2.667-2.667"
    />
  </Svg>
);
