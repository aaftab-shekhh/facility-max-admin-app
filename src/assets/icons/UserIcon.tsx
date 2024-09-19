import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

export const UserIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={19}
    fill="none"
    {...props}>
    <Circle
      cx={9.499}
      cy={7.476}
      r={2.829}
      stroke="#848A9B"
      strokeWidth={1.2}
    />
    <Path
      stroke="#848A9B"
      strokeWidth={1.2}
      d="M13.69 15.476c0-2.525-1.877-4.572-4.19-4.572-2.315 0-4.191 2.047-4.191 4.572"
    />
    <Circle cx={9.5} cy={9} r={7.4} stroke="#848A9B" strokeWidth={1.2} />
  </Svg>
);
