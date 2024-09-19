import * as React from 'react';
import Svg, {SvgProps, Path, Rect, Circle} from 'react-native-svg';

export const SecurityIncidentsIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Rect width={36} height={36} fill="#848A9B" rx={8} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M18.001 10.5a10 10 0 0 0 7.083 2.5 10 10 0 0 1-7.083 12.5A10 10 0 0 1 10.918 13 10 10 0 0 0 18 10.5"
    />
    <Circle
      cx={18.001}
      cy={17.166}
      r={0.833}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M17.999 18v2.083"
    />
  </Svg>
);
