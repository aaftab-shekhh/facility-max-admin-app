import * as React from 'react';
import Svg, {SvgProps, G, Circle, Path, Defs, ClipPath} from 'react-native-svg';
export const ProfileIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}>
    <G fill={props.fill ? props.fill : '#848A9B'} clipPath="url(#a)">
      <Circle cx={14.333} cy={9.733} r={3.733} />
      <Path d="M6.867 24.2c-1.03 0-1.887-.846-1.66-1.852a8.745 8.745 0 0 1 2.527-4.418c1.75-1.663 4.124-2.597 6.6-2.597 2.475 0 4.849.934 6.6 2.597a8.746 8.746 0 0 1 2.527 4.418c.226 1.006-.63 1.852-1.66 1.852H6.866Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h28v28H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
