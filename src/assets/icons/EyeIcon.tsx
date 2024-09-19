import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

export const EyeIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Circle
      cx={11.999}
      cy={12.003}
      r={1.667}
      stroke={props.color ? props.color : '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      stroke={props.color ? props.color : '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20.335 12.001c-2.223 3.89-5 5.834-8.334 5.834-3.333 0-6.11-1.945-8.333-5.834 2.222-3.889 5-5.833 8.333-5.833 3.334 0 6.111 1.944 8.334 5.833"
    />
  </Svg>
);
