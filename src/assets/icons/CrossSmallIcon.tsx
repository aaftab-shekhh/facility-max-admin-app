import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const CrossSmallIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={7}
    height={7}
    fill="none"
    {...props}>
    <Path
      fill={props.color || '#1B6BC0'}
      d="M4.071 3.48 6.906.647a.389.389 0 0 0-.548-.549L3.523 2.932.688.094A.389.389 0 0 0 .14.642L2.975 3.48.135 6.316a.389.389 0 1 0 .55.548L3.522 4.03l2.835 2.835a.389.389 0 0 0 .548-.548L4.071 3.48Z"
    />
  </Svg>
);
