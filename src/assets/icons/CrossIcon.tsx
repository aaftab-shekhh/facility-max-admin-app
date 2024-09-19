import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const CrossIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    {...props}>
    <Path
      fill="#848A9B"
      d="M12.892.302a.996.996 0 0 0-1.41 0l-4.89 4.88-4.89-4.89a.997.997 0 1 0-1.41 1.41l4.89 4.89-4.89 4.89a.997.997 0 0 0 1.41 1.41l4.89-4.89 4.89 4.89a.997.997 0 0 0 1.41-1.41l-4.89-4.89 4.89-4.89c.38-.38.38-1.02 0-1.4Z"
    />
  </Svg>
);
