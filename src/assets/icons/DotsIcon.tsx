import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const DotsIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path fill={props.color || '#EEF0F3'} d="M0 0h24v24H0z" />
    <Path
      fill={props.fill || '#848A9B'}
      d="M12 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
    />
  </Svg>
);
