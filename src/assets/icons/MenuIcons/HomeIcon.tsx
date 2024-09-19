import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const HomedIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}>
    <Path
      fill={props.fill || '#848A9B'}
      d="M15.132 3.022a1.75 1.75 0 0 0-2.264 0l-8.75 7.423A1.75 1.75 0 0 0 3.5 11.78v10.97a1.75 1.75 0 0 0 1.75 1.75h5.542a.875.875 0 0 0 .875-.875v-7.292h4.666v7.292c0 .483.392.875.875.875h5.542a1.75 1.75 0 0 0 1.75-1.75V11.78a1.75 1.75 0 0 0-.618-1.335l-8.75-7.423Z"
    />
  </Svg>
);
