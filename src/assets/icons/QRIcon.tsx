import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const QRIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={39}
    height={38}
    fill="none"
    {...props}>
    <Rect
      width={9.286}
      height={9.133}
      x={7.121}
      y={6.791}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.167}
      rx={1.083}
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.167}
      d="M11.76 26.58v.016"
    />
    <Rect
      width={9.286}
      height={9.133}
      x={22.595}
      y={6.791}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.167}
      rx={1.083}
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.167}
      d="M11.76 11.357v.015"
    />
    <Rect
      width={9.286}
      height={9.133}
      x={7.121}
      y={22.013}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.167}
      rx={1.083}
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.167}
      d="M27.238 11.357v.015M22.595 22.012h4.643M31.881 22.012v.015M22.596 22.013v4.566M22.595 31.146h4.643M27.236 26.58h4.643M31.881 26.578v4.567"
    />
  </Svg>
);
