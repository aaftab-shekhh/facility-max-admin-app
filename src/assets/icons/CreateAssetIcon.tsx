import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const CreateAssetIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={37}
    height={36}
    fill="none"
    {...props}>
    <Path
      stroke={props.color ? props.color : '#1B6BC0'}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m15.5 24.649 4.612 2.388a1.301 1.301 0 0 0 1.18.008l3.89-1.945a1.3 1.3 0 0 0 .718-1.162v-3.593a1.3 1.3 0 0 0-.719-1.163l-4.481-2.24-4.498 2.329a1.3 1.3 0 0 0-.702 1.154v4.224Z"
      clipRule="evenodd"
    />
    <Path
      stroke={props.color ? props.color : '#1B6BC0'}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m5.804 25.012 3.91 2.025a1.3 1.3 0 0 0 1.18.008l4.608-2.304v-4.396a1.3 1.3 0 0 0-.72-1.163l-4.48-2.24-4.498 2.329a1.3 1.3 0 0 0-.702 1.154v3.432a1.3 1.3 0 0 0 .702 1.155Zm4.498-8.163 4.612 2.388a1.301 1.301 0 0 0 1.18.008l4.608-2.304v-4.396a1.3 1.3 0 0 0-.72-1.163l-3.889-1.944a1.3 1.3 0 0 0-1.179.007l-3.91 2.026a1.3 1.3 0 0 0-.702 1.154v4.224Z"
      clipRule="evenodd"
    />
    <Path
      stroke={props.color ? props.color : '#1B6BC0'}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m10.75 11.966 4.17 2.083a1.3 1.3 0 0 0 1.162 0l4.125-2.061m-6.917-1.354 4.811 2.407m.389 5.393 4.811 2.407M8.09 18.434l4.811 2.407m3.05-1.076 4.169 2.084a1.3 1.3 0 0 0 1.162 0l4.124-2.061M5.55 19.765 9.72 21.85a1.3 1.3 0 0 0 1.162 0l4.124-2.061m.495-5.447v5.2m5.2 2.6v4.55m-10.4-4.55v4.55"
    />
    <Path
      stroke={props.color ? props.color : '#1B6BC0'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M25.666 28h6.667M29 24.667v6.666"
    />
  </Svg>
);
