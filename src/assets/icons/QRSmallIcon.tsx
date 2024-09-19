import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const QRSmallIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={17}
    fill="none"
    {...props}>
    <Path stroke="#1B6BC0" d="M1 .5h16v16H1V.5Z" clipRule="evenodd" />
    <Rect
      width={4}
      height={4}
      x={3.667}
      y={3.167}
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      rx={1}
    />
    <Path
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.666 11.833v.007"
    />
    <Rect
      width={4}
      height={4}
      x={10.333}
      y={3.167}
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      rx={1}
    />
    <Path
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.666 5.167v.007"
    />
    <Rect
      width={4}
      height={4}
      x={3.667}
      y={9.833}
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      rx={1}
    />
    <Path
      stroke="#1B6BC0"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.333 5.166v.007M10.333 9.833h2M14.333 9.833v.007M10.333 9.833v2M10.333 13.833h2M12.333 11.833h2M14.333 11.833v2"
    />
  </Svg>
);
