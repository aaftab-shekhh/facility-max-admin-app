import * as React from 'react';
import Svg, {SvgProps, Path, Circle, Rect} from 'react-native-svg';

export const CastleIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Rect
      width={14}
      height={10}
      x={5}
      y={11}
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      rx={2}
    />
    <Circle
      cx={12}
      cy={16}
      r={1}
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
    />
    <Path
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M8 11V7a4 4 0 1 1 8 0v4"
    />
  </Svg>
);
