import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const ReplaceAssetIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Rect
      width={6}
      height={6}
      x={3}
      y={3}
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={1}
    />
    <Rect
      width={6}
      height={6}
      x={15}
      y={15}
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={1}
    />
    <Path
      fill="#848A9B"
      d="M20.25 11a.75.75 0 0 0 1.5 0h-1.5ZM13 6v-.75a.75.75 0 0 0-.53 1.28L13 6Zm2.47 3.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm1.06-6a.75.75 0 0 0-1.06-1.06l1.06 1.06Zm-4.06 1.94a.75.75 0 0 0 1.06 1.06l-1.06-1.06ZM21.75 11V8h-1.5v3h1.5Zm0-3A2.75 2.75 0 0 0 19 5.25v1.5c.69 0 1.25.56 1.25 1.25h1.5ZM19 5.25h-6v1.5h6v-1.5Zm-6.53 1.28 3 3 1.06-1.06-3-3-1.06 1.06Zm3-4.06-3 3 1.06 1.06 3-3-1.06-1.06ZM3.75 13a.75.75 0 0 0-1.5 0h1.5ZM11 18v.75a.75.75 0 0 0 .53-1.28L11 18Zm-2.47-3.53a.75.75 0 0 0-1.06 1.06l1.06-1.06Zm-1.06 6a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm4.06-1.94a.75.75 0 1 0-1.06-1.06l1.06 1.06ZM2.25 13v3h1.5v-3h-1.5Zm0 3A2.75 2.75 0 0 0 5 18.75v-1.5c-.69 0-1.25-.56-1.25-1.25h-1.5ZM5 18.75h6v-1.5H5v1.5Zm6.53-1.28-3-3-1.06 1.06 3 3 1.06-1.06Zm-3 4.06 3-3-1.06-1.06-3 3 1.06 1.06Z"
    />
  </Svg>
);
