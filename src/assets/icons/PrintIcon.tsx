import * as React from 'react';
import Svg, {SvgProps, Path, Defs, ClipPath, G, Rect} from 'react-native-svg';

export const PrintIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <G
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      clipPath="url(#a)">
      <Path d="M17 17h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2M17 9V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4" />
      <Rect width={10} height={8} x={7} y={13} rx={2} />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
