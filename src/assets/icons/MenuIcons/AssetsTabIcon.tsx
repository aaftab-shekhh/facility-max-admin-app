import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const AssetsTabIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={30}
    fill="none"
    {...props}>
    <Rect width={30} height={30} x={0.3} fill={props.color} rx={15} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m15.298 21.05 4.355 2.256a1.227 1.227 0 0 0 1.113.007l3.673-1.836a1.228 1.228 0 0 0 .679-1.098v-3.393a1.228 1.228 0 0 0-.679-1.097l-4.231-2.116-4.247 2.2a1.228 1.228 0 0 0-.663 1.09v3.988Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m6.143 21.393 3.693 1.912a1.228 1.228 0 0 0 1.113.008l4.351-2.176v-4.15a1.227 1.227 0 0 0-.678-1.098l-4.232-2.116-4.247 2.2a1.228 1.228 0 0 0-.663 1.09v3.24a1.227 1.227 0 0 0 .663 1.09Zm4.247-7.708 4.356 2.255a1.229 1.229 0 0 0 1.113.008l4.351-2.175V9.62a1.228 1.228 0 0 0-.678-1.097l-3.673-1.837a1.228 1.228 0 0 0-1.113.008l-3.693 1.912a1.227 1.227 0 0 0-.663 1.09v3.988Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m10.813 9.075 3.937 1.968a1.228 1.228 0 0 0 1.097 0l3.895-1.947m-6.531-1.278 4.542 2.272m.367 5.093 4.543 2.272M8.301 15.183l4.543 2.272m2.88-1.015 3.936 1.967a1.227 1.227 0 0 0 1.097 0l3.894-1.946M5.903 16.44l3.937 1.967a1.227 1.227 0 0 0 1.097 0l3.894-1.946m.468-5.144v4.91m4.91 2.455v4.297m-9.82-4.297v4.297"
    />
  </Svg>
);
