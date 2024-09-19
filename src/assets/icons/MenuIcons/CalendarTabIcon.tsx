import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs, ClipPath} from 'react-native-svg';

export const CalendarTabIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={30}
    fill="none"
    {...props}>
    <G clipPath="url(#a)">
      <Path
        fill={props.fill || '#848A9B'}
        d="M27.084 15v8.75a2.5 2.5 0 0 1-2.5 2.5h-17.5a2.5 2.5 0 0 1-2.5-2.5V15h22.5Zm-6.25-11.25A1.25 1.25 0 0 1 22.084 5v1.25h2.5a2.5 2.5 0 0 1 2.5 2.5v3.75h-22.5V8.75a2.5 2.5 0 0 1 2.5-2.5h2.5V5a1.25 1.25 0 1 1 2.5 0v1.25h7.5V5a1.25 1.25 0 0 1 1.25-1.25Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.833 0h30v30h-30z" />
      </ClipPath>
    </Defs>
  </Svg>
);
