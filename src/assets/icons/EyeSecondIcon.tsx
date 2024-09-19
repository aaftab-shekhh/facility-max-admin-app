import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

export const EyeSecondIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}>
    <Circle
      cx={12}
      cy={12.143}
      r={2}
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
      d="M22 12.143c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7"
    />
  </Svg>
);
