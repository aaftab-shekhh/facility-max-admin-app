import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const AssetsIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}>
    <Path
      fill={props.fill}
      fillRule="evenodd"
      stroke="#F5F6FA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.227}
      d="m14.998 22.425 5.345 2.767a1.507 1.507 0 0 0 1.366.01l4.507-2.254a1.506 1.506 0 0 0 .833-1.347v-4.163a1.507 1.507 0 0 0-.833-1.347l-5.193-2.597-5.211 2.7a1.506 1.506 0 0 0-.814 1.337v4.894Z"
      clipRule="evenodd"
    />
    <Path
      fill={props.fill}
      fillRule="evenodd"
      stroke="#F5F6FA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.227}
      d="m3.764 22.845 4.53 2.347a1.505 1.505 0 0 0 1.367.009l5.34-2.67v-5.094a1.505 1.505 0 0 0-.833-1.347l-5.192-2.597-5.212 2.7a1.506 1.506 0 0 0-.814 1.337v3.977a1.506 1.506 0 0 0 .814 1.338Zm5.212-9.458 5.344 2.767a1.505 1.505 0 0 0 1.367.009l5.34-2.67V8.4a1.507 1.507 0 0 0-.833-1.347L15.687 4.8a1.506 1.506 0 0 0-1.367.009L9.79 7.155a1.506 1.506 0 0 0-.814 1.337v4.894Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#F5F6FA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.227}
      d="m9.495 7.729 4.831 2.414a1.506 1.506 0 0 0 1.347 0l4.78-2.389m-4.932 9.013 4.83 2.414a1.506 1.506 0 0 0 1.347 0l4.778-2.389M3.47 16.767 8.3 19.18a1.506 1.506 0 0 0 1.347 0l4.778-2.389M15 10.481v6.025m6.026 3.013v5.272M8.974 19.52v5.272"
    />
  </Svg>
);
