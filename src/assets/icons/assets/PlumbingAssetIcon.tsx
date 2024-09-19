import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const PlumbingAssetIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Rect width={24} height={24} fill="#44B8FF" rx={5} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.022}
      d="M8.453 11.318a4.09 4.09 0 1 0 7.086 0l-3.542-5.452-3.545 5.452h.001Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.022}
      d="M12 15.067c.227.114 1.227.477 2.045-.34.818-.819.454-1.818.34-2.045"
    />
  </Svg>
);
