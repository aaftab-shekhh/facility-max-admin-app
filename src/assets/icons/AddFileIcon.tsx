import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const AddFileIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Path
      fill="#fff"
      d="M16.5 24V11.775l-3.9 3.9-2.1-2.175L18 6l7.5 7.5-2.1 2.175-3.9-3.9V24h-3ZM9 30a2.89 2.89 0 0 1-2.12-.882A2.883 2.883 0 0 1 6 27v-4.5h3V27h18v-4.5h3V27a2.89 2.89 0 0 1-.882 2.12A2.883 2.883 0 0 1 27 30H9Z"
    />
  </Svg>
);
