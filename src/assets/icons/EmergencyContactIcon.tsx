import * as React from 'react';
import Svg, {SvgProps, Path, Circle, Rect} from 'react-native-svg';

export const EmergencyContactIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Path
      stroke="#848A9B"
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
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      rx={1.244}
    />
    <Path
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="M12 16.5h6M12 22.5h4.5"
    />
    <Circle
      cx={23.876}
      cy={23.792}
      r={2.167}
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20.625 31.375v-1.083c0-1.197.97-2.167 2.167-2.167h2.166c1.197 0 2.167.97 2.167 2.167v1.083M27.666 21.696a2.167 2.167 0 0 1 0 4.197M30.375 31.375v-1.083a2.167 2.167 0 0 0-1.625-2.086"
    />
  </Svg>
);
