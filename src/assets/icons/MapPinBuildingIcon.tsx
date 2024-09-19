import * as React from 'react';
import Svg, {Circle, ClipPath, Defs, G, Path} from 'react-native-svg';

export const MapPinBuildingIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={53}
    height={71}
    fill="none"
    {...props}>
    <Path
      fill={props.fill ? props.fill : '#4A5369'}
      d="M53 26.915C53 41.78 26.5 71 26.5 71S0 41.78 0 26.915C0 12.05 11.864 0 26.5 0S53 12.05 53 26.915Z"
    />
    <Circle cx={26.5} cy={25.5} r={15.5} fill="#fff" />
    <G
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      clipPath="url(#a)">
      <Path d="M19.5 32.5h15M21.167 32.5V20.833l6.667-3.333v15" />
      <Path d="M32.833 32.5v-8.333l-5-3.334M24.5 22.5v.008M24.5 25v.008M24.5 27.5v.008M24.5 30v.008" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M17 15h20v20H17z" />
      </ClipPath>
    </Defs>
  </Svg>
);
