import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const SafetyProcedureIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}>
    <Rect width={25} height={25} fill="#F1416C" rx={3.457} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m10.625 12.5 1.25 1.25 2.5-2.5"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.5 6.875a7.5 7.5 0 0 0 5.312 1.875 7.5 7.5 0 0 1-5.312 9.375A7.5 7.5 0 0 1 7.187 8.75 7.5 7.5 0 0 0 12.5 6.875"
    />
  </Svg>
);
