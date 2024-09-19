import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const ArrowRightIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={21}
    fill="none"
    {...props}>
    <Path
      stroke={props.stroke ? props.stroke : '#FFF'}
      strokeLinecap="round"
      strokeWidth={2}
      d="m8 15.5 4-5-4-5"
    />
  </Svg>
);
