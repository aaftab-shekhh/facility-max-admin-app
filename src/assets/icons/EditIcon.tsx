import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const EditIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke={props.stroke ? props.stroke : '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"
    />
    <Path
      stroke={props.stroke ? props.stroke : '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M9 15h3l8.5-8.5a2.121 2.121 0 0 0-3-3L9 12v3M16 5l3 3"
    />
  </Svg>
);
