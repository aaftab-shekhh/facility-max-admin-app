import * as React from 'react';
import Svg, {SvgProps, Path, Rect, Circle} from 'react-native-svg';

export const CamponyIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Rect width={36} height={36} fill="#1B6BC0" rx={5} />
    <Circle
      cx={15}
      cy={13}
      r={4}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 27v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M22 9.13a4 4 0 0 1 0 7.75M27 27v-2a4 4 0 0 0-3-3.85"
    />
  </Svg>
);
