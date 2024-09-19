import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const CrossIconWhite = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={10}
    fill="none"
    {...props}>
    <Path
      fill="#F2F6F8"
      d="M9.659.348a.737.737 0 0 0-1.043 0L5 3.958 1.384.34A.737.737 0 0 0 .34 1.384L3.957 5 .341 8.616A.737.737 0 0 0 1.384 9.66L5 6.043l3.616 3.616A.737.737 0 1 0 9.66 8.616L6.043 5l3.616-3.616a.741.741 0 0 0 0-1.036Z"
    />
  </Svg>
);
