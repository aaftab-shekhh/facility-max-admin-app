import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const DashboardIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={30}
    fill="none"
    {...props}>
    <Path
      fill={props.fill || '#848A9B'}
      d="M6.55 26.25a2.408 2.408 0 0 1-1.766-.735 2.402 2.402 0 0 1-.734-1.765V6.25c0-.688.245-1.276.735-1.766A2.403 2.403 0 0 1 6.55 3.75h7.5v22.5h-7.5Zm10 0V15h10v8.75c0 .688-.245 1.276-.735 1.766s-1.079.735-1.765.734h-7.5Zm0-13.75V3.75h7.5c.687 0 1.276.245 1.766.735s.735 1.078.734 1.765v6.25h-10Z"
    />
  </Svg>
);
