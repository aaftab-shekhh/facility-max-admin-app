import * as React from 'react';
import Svg, {SvgProps, Path, Rect, Circle} from 'react-native-svg';

export const RegulationProceduresIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}>
    <Rect width={25} height={25} fill="#28A745" rx={5} />
    <Circle
      cx={8.125}
      cy={8.125}
      r={1.25}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={16.875}
      cy={8.125}
      r={1.25}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={8.125}
      cy={16.875}
      r={1.25}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={16.875}
      cy={16.875}
      r={1.25}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.125 9.375v6.25M9.375 8.125h6.25M9.375 16.875h6.25M16.875 9.375v6.25"
    />
  </Svg>
);
