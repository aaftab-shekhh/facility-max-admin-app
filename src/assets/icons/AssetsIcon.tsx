import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {memo} from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m12 18.416 4.813 2.492a1.356 1.356 0 0 0 1.23.008l4.06-2.03a1.356 1.356 0 0 0 .75-1.212v-3.75a1.356 1.356 0 0 0-.75-1.212l-4.677-2.339-4.693 2.431A1.357 1.357 0 0 0 12 14.01v4.407Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m1.881 18.795 4.08 2.113a1.357 1.357 0 0 0 1.23.008l4.81-2.404v-4.587a1.357 1.357 0 0 0-.75-1.213l-4.676-2.339-4.694 2.431a1.356 1.356 0 0 0-.733 1.205v3.581a1.356 1.356 0 0 0 .733 1.205Zm4.694-8.518 4.812 2.492a1.357 1.357 0 0 0 1.23.008l4.81-2.404V5.785a1.357 1.357 0 0 0-.75-1.212l-4.06-2.03a1.357 1.357 0 0 0-1.23.009l-4.08 2.113a1.357 1.357 0 0 0-.732 1.205v4.407Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m7.043 5.181 4.35 2.175a1.357 1.357 0 0 0 1.213 0l4.305-2.152M9.693 3.792l5.02 2.51m.406 5.63 5.02 2.51m-15.873-2.51 5.021 2.51m3.182-1.122 4.35 2.175a1.358 1.358 0 0 0 1.213 0l4.303-2.152M1.617 13.32l4.35 2.175a1.358 1.358 0 0 0 1.213 0l4.303-2.152M12 7.66v5.427m5.426 2.713v4.748M6.574 15.799v4.748"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
