import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const CalendarIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}>
    <Rect
      width={15.916}
      height={16}
      x={4.144}
      y={5.748}
      stroke={props.stroke ? props.stroke : '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      rx={2.75}
    />
    <Path
      stroke={props.stroke ? props.stroke : '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M16.081 3.749v4M8.123 3.749v4M4.144 11.749h15.917"
    />
  </Svg>
);
