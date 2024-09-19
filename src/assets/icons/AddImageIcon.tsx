import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

export const AddImageIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={38}
    height={38}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.89}
      d="M24.414 29.925H4.727V7.875h28.665v11.813"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.89}
      d="m5.828 28.823 8.82-8.82 6.615 5.512 11.812-10.552M31.5 23.625v6.3"
    />
    <Circle cx={22.365} cy={14.49} r={2.205} fill="#fff" />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.89}
      d="M34.648 26.775h-6.3"
    />
  </Svg>
);
