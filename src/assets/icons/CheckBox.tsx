import * as React from 'react';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
import {memo} from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}>
    <Rect
      width={20}
      height={20}
      fill={props.fill ? props.fill : '#44B8FF'}
      rx={10}
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.2}
      d="m5.5 10.5 4 2.625L15 7"
    />
  </Svg>
);
const CheckBox = memo(SvgComponent);
export default CheckBox;
