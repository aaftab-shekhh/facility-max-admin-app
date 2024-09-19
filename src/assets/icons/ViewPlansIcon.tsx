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
      width={12}
      height={12}
      x={8.002}
      y={8}
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
      d="m8.002 14.5 6.492-6.491"
    />
    <Path
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M13.495 20.004 20 13.5l-6.504 6.504Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M8.962 19.064 18.985 9.13M15.998 8V6a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
