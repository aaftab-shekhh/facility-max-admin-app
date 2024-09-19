import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const SearchIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}>
    <Path
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m24.5 24.5-5.067-5.067m0 0a9.334 9.334 0 1 0-13.2-13.2 9.334 9.334 0 0 0 13.2 13.2Z"
    />
  </Svg>
);
