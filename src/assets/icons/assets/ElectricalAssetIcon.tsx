import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const ElectricalAssetIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    zIndex={1}
    {...props}>
    <Rect width={24} height={24} fill="#FFC107" rx={5} />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M16.026 10.905h-2.6l1.55-3.615a.341.341 0 0 0-.313-.475h-3.408a.341.341 0 0 0-.314.207l-2.045 4.771a.341.341 0 0 0 .314.475h1.686l-2.002 4.985c-.137.339.284.626.55.375l3.424-3.233 3.38-2.89a.34.34 0 0 0-.222-.6Zm-3.116.681h2.193l-2.691 2.303-2.307 2.178 1.612-4.013a.34.34 0 0 0-.316-.468H9.727l1.753-4.089h2.666l-1.55 3.614a.34.34 0 0 0 .314.475Z"
      clipRule="evenodd"
    />
  </Svg>
);
