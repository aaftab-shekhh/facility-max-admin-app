import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const DeleteIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      fill={props.fill ? props.fill : '#848A9B'}
      d="M9.856 5.142h4.286a2.143 2.143 0 1 0-4.286 0Zm-1.286 0a3.429 3.429 0 0 1 6.857 0h5.358a.643.643 0 0 1 0 1.286h-1.123l-1.043 12.517a3.643 3.643 0 0 1-3.63 3.34h-5.98a3.643 3.643 0 0 1-3.63-3.34L4.336 6.428H3.213a.643.643 0 1 1 0-1.286H8.57ZM6.66 18.838A2.357 2.357 0 0 0 9.01 21h5.979a2.357 2.357 0 0 0 2.348-2.162l1.036-12.41H5.626l1.035 12.41Zm3.41-9.41a.643.643 0 0 1 .643.643v7.286a.643.643 0 0 1-1.286 0V10.07a.643.643 0 0 1 .643-.643Zm4.5.643a.643.643 0 1 0-1.285 0v7.286a.643.643 0 1 0 1.285 0V10.07Z"
    />
  </Svg>
);
