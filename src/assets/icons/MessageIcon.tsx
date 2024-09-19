import * as React from 'react';
import Svg, {SvgProps, Path, Defs, G, ClipPath} from 'react-native-svg';

export const MessageIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}>
    <G clipPath="url(#a)">
      <Path
        fill={props.fill ? props.fill : '#848A9B'}
        fillRule="evenodd"
        d="M19.666 3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H8l-3.333 2.5c-.825.618-2 .03-2-1V6a3 3 0 0 1 3-3h14Zm-8 9h-3a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2Zm5-4h-8a1 1 0 0 0-.117 1.993l.117.007h8a1 1 0 0 0 .117-1.993L16.666 8Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.667 0h24v24h-24z" />
      </ClipPath>
    </Defs>
  </Svg>
);
