import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';

export const PauseIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={16}
    fill="none"
    {...props}>
    <Rect
      width={2.667}
      height={9.333}
      x={4.75}
      y={3.333}
      stroke={props.color || '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={1}
    />
    <Rect
      width={2.667}
      height={9.333}
      x={10.083}
      y={3.333}
      stroke={props.color || '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={1}
    />
  </Svg>
);
