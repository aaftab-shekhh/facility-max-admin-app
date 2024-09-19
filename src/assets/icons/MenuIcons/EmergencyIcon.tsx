import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

export const EmergencyIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}>
    <Circle
      cx={14}
      cy={14}
      r={10.5}
      stroke="#DC3545"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
    />
    <Path
      stroke="#DC3545"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M14 9.334V14M14 18.667h.012"
    />
  </Svg>
);
