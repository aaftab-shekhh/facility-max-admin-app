import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const ContactsTabIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={30}
    fill="none"
    {...props}>
    <Path
      fill={props.fill}
      d="M24.2 26H8.8a3.3 3.3 0 0 1-3.3-3.3V7.3A3.3 3.3 0 0 1 8.8 4h15.4a1.1 1.1 0 0 1 1.1 1.1v19.8a1.1 1.1 0 0 1-1.1 1.1Zm-1.1-2.2v-2.2H8.8a1.1 1.1 0 0 0 0 2.2h14.3Zm-7.7-11a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Zm-3.3 4.4h6.6a3.3 3.3 0 0 0-6.6 0Z"
    />
  </Svg>
);
