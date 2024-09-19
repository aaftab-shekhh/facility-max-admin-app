import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const MenuTabIco = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={29}
    height={28}
    fill="none"
    {...props}>
    <Path
      stroke={props.fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M4.4 7.001h21m-21 7h21m-21 7h21"
    />
  </Svg>
);
