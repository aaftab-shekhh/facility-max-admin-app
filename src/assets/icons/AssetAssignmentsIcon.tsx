import * as React from 'react';
import Svg, {SvgProps, Circle, Path} from 'react-native-svg';
import {memo} from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Circle
      cx={12}
      cy={12}
      r={2}
      stroke="#6C757D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      stroke="#6C757D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 18c-3.6 0-6.6-2-9-6 2.4-4 5.4-6 9-6 3.6 0 6.6 2 9 6a18.27 18.27 0 0 1-1.18 1.743M14 18.5l1.667 1.5L19 17"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
