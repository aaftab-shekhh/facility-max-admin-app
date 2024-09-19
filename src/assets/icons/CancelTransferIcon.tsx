import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const CancelTransferIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}>
    <Path
      stroke="#848A9B"
      strokeWidth={1.5}
      d="M11.5 19.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM16.5 17 6 6.5"
    />
  </Svg>
);
