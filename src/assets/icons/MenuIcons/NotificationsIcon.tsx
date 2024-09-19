import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs, ClipPath} from 'react-native-svg';

export const NotificationsIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}>
    <G clipPath="url(#a)">
      <Path
        fill={props.fill || '#848A9B'}
        d="M17.625 22.791a2.083 2.083 0 0 1-1.927 2.078l-.156.006h-2.083a2.084 2.084 0 0 1-2.079-1.927l-.005-.157h6.25ZM14.5 5.083a7.292 7.292 0 0 1 7.288 7.042l.004.25v3.92l1.898 3.796a1.146 1.146 0 0 1-.905 1.652l-.12.007H6.335a1.146 1.146 0 0 1-1.072-1.55l.048-.109 1.898-3.796v-3.92A7.292 7.292 0 0 1 14.5 5.083Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M2 3h25v25H2z" />
      </ClipPath>
    </Defs>
  </Svg>
);
