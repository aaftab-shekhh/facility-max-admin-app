import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const StarIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={16}
    fill="none"
    {...props}>
    <Path
      stroke={props.color || '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m8.249 11.833-4.115 2.163.786-4.582L1.587 6.17l4.6-.667 2.057-4.169 2.058 4.17 4.6.666-3.334 3.244.786 4.582-4.105-2.163Z"
      clipRule="evenodd"
    />
  </Svg>
);
