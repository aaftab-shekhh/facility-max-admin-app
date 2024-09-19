import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {memo} from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke="#1B6BC0"
      strokeWidth={1.1}
      d="M10.688 2.111 2.61 5.62a.183.183 0 0 0-.11.168v9.219c0 .134.14.223.261.166l4.113-1.92 3.96-1.744a.183.183 0 0 0 .11-.168V2.28a.183.183 0 0 0-.257-.169Z"
    />
    <Path
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeWidth={1.1}
      d="m11.21 2 7.73 3.608c.064.03.107.096.106.167l-.04 8.789c-.001.13-.134.218-.254.168l-7.542-3.105M2.5 15.294l8.173 2.904 8.33-3.362"
    />
    <Path
      stroke="#1B6BC0"
      strokeWidth={1.1}
      d="M13.012 12.398V6.982l3.115 1.42v5.357"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
