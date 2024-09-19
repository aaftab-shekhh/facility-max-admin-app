import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const CriticalIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={21}
    fill="none"
    {...props}>
    <Rect width={20} height={20} y={0.5} fill="#DC3545" rx={5} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M9.75 6.25v6.5M9.75 15.25v.5"
    />
  </Svg>
);
