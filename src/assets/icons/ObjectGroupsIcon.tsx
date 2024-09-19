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
      width={6}
      height={6}
      x={4}
      y={4}
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={1}
    />
    <Rect
      width={6}
      height={6}
      x={14}
      y={4}
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={1}
    />
    <Rect
      width={6}
      height={6}
      x={4}
      y={14}
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={1}
    />
    <Path
      fill="#1B6BC0"
      d="M14 16.25a.75.75 0 0 0 0 1.5v-1.5Zm6 1.5a.75.75 0 0 0 0-1.5v1.5ZM17.75 14a.75.75 0 0 0-1.5 0h1.5Zm-1.5 6a.75.75 0 0 0 1.5 0h-1.5ZM14 17.75h6v-1.5h-6v1.5ZM16.25 14v6h1.5v-6h-1.5Z"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
