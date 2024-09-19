import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const RemoveAllocationIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}>
    <Path
      stroke="#DC3545"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11 7.5H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-5M10 14.5l10-10M15 4.5h5v5"
    />
  </Svg>
);
