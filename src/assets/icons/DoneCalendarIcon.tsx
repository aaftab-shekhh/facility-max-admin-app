import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect, SvgProps} from 'react-native-svg';

export const DoneCalendarIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={19}
    fill="none"
    {...props}>
    <Rect
      width={12.697}
      height={12.667}
      x={3.672}
      y={3.958}
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      rx={1.583}
    />
    <Path
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.198 2.375v3.167M6.85 2.375v3.167M3.672 8.708h12.697"
    />
    <G
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      clipPath="url(#a)">
      <Path d="m11.852 10.111 1.249 1.222-1.25 1.221" />
      <Path d="M13.1 11.333H9.354c-.442 0-.865.172-1.178.477a1.61 1.61 0 0 0-.488 1.152c0 .431.176.846.488 1.151.313.306.736.477 1.178.477h2.082" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M6.832 9.5h7.125v5.7H6.832z" />
      </ClipPath>
    </Defs>
  </Svg>
);
