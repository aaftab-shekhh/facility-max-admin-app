import * as React from 'react';
import Svg, {SvgProps, Path, Rect, Circle} from 'react-native-svg';

export const RecoveryProceduresIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}>
    <Rect width={25} height={25} fill="#17A2B8" rx={5} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.374 11.25h1.875V9.375L9.062 7.188a3.75 3.75 0 0 1 5 5l3.75 3.75a1.326 1.326 0 1 1-1.876 1.874l-3.75-3.75a3.75 3.75 0 0 1-5-5l2.188 2.188"
    />
  </Svg>
);
