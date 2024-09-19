import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {memo} from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={9}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.2}
      d="M1.5 4.5c.4.4 2.5 1.833 4 3l6-6.5"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
