import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

export const MakePhoto = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M5.778 7.625h.889c.982 0 1.777-.784 1.777-1.75 0-.483.398-.875.89-.875h5.333c.49 0 .889.392.889.875 0 .966.796 1.75 1.777 1.75h.89c.981 0 1.777.784 1.777 1.75v7.875c0 .966-.796 1.75-1.778 1.75H5.778C4.796 19 4 18.216 4 17.25V9.375c0-.966.796-1.75 1.778-1.75"
    />
    <Circle
      cx={12}
      cy={13}
      r={3}
      stroke="#848A9B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
    />
  </Svg>
);
