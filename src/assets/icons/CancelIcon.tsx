import * as React from 'react';
import Svg, {SvgProps, Path, Rect, Mask} from 'react-native-svg';

export const CancelIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="none"
    {...props}>
    <Rect
      width={31}
      height={31}
      x={0.5}
      y={0.5}
      fill="#DC3545"
      fillOpacity={0.1}
      rx={4.5}
    />
    <Rect width={31} height={31} x={0.5} y={0.5} stroke="#DC3545" rx={4.5} />
    <Path
      stroke="#DC3545"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 11 11 21M11 11l10 10"
    />
  </Svg>
);
