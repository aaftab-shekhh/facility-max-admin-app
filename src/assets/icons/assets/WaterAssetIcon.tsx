import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const WaterAssetIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={26}
    fill="none"
    {...props}>
    <Rect width={25} height={25} y={0.5} fill="#44B8FF" rx={5} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.042}
      d="M8.388 11.806a4.167 4.167 0 1 0 7.22 0l-3.61-5.556-3.61 5.556h0Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.042}
      d="M12 15.625c.232.116 1.25.486 2.083-.347.834-.834.463-1.852.348-2.084"
    />
  </Svg>
);
