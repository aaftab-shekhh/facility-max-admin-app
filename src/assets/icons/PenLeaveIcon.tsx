import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const PenLeaveIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke={props.fill || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M9.498 6.667h-3c-1.105 0-2 .852-2 1.904v8.572c0 1.052.895 1.904 2 1.904h9c1.105 0 2-.852 2-1.904v-2.857"
    />
    <Path
      stroke={props.fill || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M9.5 14.286h3L21 6.191a1.953 1.953 0 0 0 0-2.857 2.197 2.197 0 0 0-3 0l-8.5 8.095v2.857M16.498 4.762l3 2.857"
    />
  </Svg>
);
