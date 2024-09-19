import * as React from 'react';
import Svg, {SvgProps, G, Path, Circle, Defs, ClipPath} from 'react-native-svg';
import {memo} from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={18}
    fill="none"
    {...props}>
    <G
      stroke={props.color ? props.color : '#fff'}
      strokeWidth={0.873}
      clipPath="url(#a)">
      <Path d="M13.475 5.973c0 1.053-.462 2.786-1.23 4.26-.38.732-.825 1.375-1.3 1.828-.478.455-.95.684-1.398.684-.448 0-.92-.229-1.397-.684-.476-.453-.92-1.095-1.301-1.828C6.08 8.759 5.62 7.026 5.62 5.973c0-2.022 1.736-3.7 3.927-3.7s3.928 1.678 3.928 3.7Z" />
      <Circle cx={9.548} cy={6.2} r={2.182} />
      <Path d="M6.93 10.564 3 11.948c-.759.268-.782 1.332-.036 1.633l6.249 2.52a.873.873 0 0 0 .667-.006l5.96-2.53c.723-.307.703-1.34-.032-1.62l-3.642-1.381" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path
          fill={props.color ? props.color : '#fff'}
          d="M.82.09h17.454v17.455H.82z"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
