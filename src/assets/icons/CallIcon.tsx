import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const CallIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}>
    <Path
      fill={props.fill ? props.fill : '#848A9B'}
      d="M22.072 16.414A5.275 5.275 0 0 1 16.833 21c-7.444 0-13.5-6.056-13.5-13.5A5.274 5.274 0 0 1 7.919 2.26a1.5 1.5 0 0 1 1.558.893l1.98 4.42v.011A1.5 1.5 0 0 1 11.338 9a1.019 1.019 0 0 1-.053.072l-1.952 2.314c.702 1.427 2.195 2.906 3.64 3.61l2.282-1.941a1.501 1.501 0 0 1 1.492-.184l.013.005 4.416 1.98a1.5 1.5 0 0 1 .896 1.558Z"
    />
  </Svg>
);
