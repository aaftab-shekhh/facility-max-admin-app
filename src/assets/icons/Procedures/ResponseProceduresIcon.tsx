import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const ResponseProceduresIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}>
    <Rect width={25} height={25} fill="#FFC107" rx={5} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m7.188 8.532.937.938 1.563-1.563M7.188 12.282l.937.938 1.563-1.563M7.188 16.032l.937.938 1.563-1.563M11.875 8.845H17.5M11.875 12.595H17.5M11.875 16.345H17.5"
    />
  </Svg>
);
