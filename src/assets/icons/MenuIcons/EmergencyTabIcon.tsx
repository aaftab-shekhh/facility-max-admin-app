import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const EmergencyTabIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={30}
    fill="none"
    {...props}>
    <Path
      fill={props.fill}
      d="M15.7 2.5c6.903 0 12.5 5.596 12.5 12.5s-5.597 12.5-12.5 12.5C8.794 27.5 3.2 21.904 3.2 15S8.794 2.5 15.7 2.5Zm0 16.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm0-11.25a1.25 1.25 0 0 0-1.242 1.104l-.009.146v7.5a1.25 1.25 0 0 0 2.492.146l.008-.146v-7.5A1.25 1.25 0 0 0 15.7 7.5Z"
    />
  </Svg>
);
