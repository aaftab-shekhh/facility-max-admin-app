import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const NoApprovedIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}>
    <Rect width={16} height={16} fill="#F7C5CA" rx={4} />
    <Path
      fill="#DC3545"
      d="M12.2 3.807a.663.663 0 0 0-.94 0L8 7.06 4.74 3.8a.665.665 0 0 0-.94.94L7.06 8 3.8 11.26a.665.665 0 0 0 .94.94L8 8.94l3.26 3.26a.664.664 0 1 0 .94-.94L8.94 8l3.26-3.26a.668.668 0 0 0 0-.933Z"
    />
  </Svg>
);
