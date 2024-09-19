import * as React from 'react';
import Svg, {SvgProps, Rect, Path} from 'react-native-svg';
import {memo} from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Rect
      width={16}
      height={12}
      x={4}
      y={6}
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      rx={2}
    />
    <Path
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="m4.5 8 7.5 5 7.5-5"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
