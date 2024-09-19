import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const AllocatePartsIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.5 7h-5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-5M10.5 14l10-10M15.5 4h5v5"
    />
  </Svg>
);
