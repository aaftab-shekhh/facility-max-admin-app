import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const ProgressIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={16}
    fill="none"
    {...props}>
    <Path
      fill={props.color || '#848A9B'}
      d="M9.97 3.73a.75.75 0 1 0 .56-1.392l-.56 1.391Zm-4 9.933a.75.75 0 0 0 .56-1.392l-.56 1.392ZM7 10a.75.75 0 0 0-1.5 0H7Zm-.75 3.333v.75a.75.75 0 0 0 .75-.75h-.75Zm-3.333-.75a.75.75 0 0 0 0 1.5v-1.5ZM10.53 2.338A6.104 6.104 0 0 0 2.588 5.72l1.391.56A4.604 4.604 0 0 1 9.97 3.73l.56-1.392ZM2.588 5.72a6.104 6.104 0 0 0 3.382 7.943l.56-1.392a4.604 4.604 0 0 1-2.55-5.99L2.587 5.72ZM5.5 10v3.333H7V10H5.5Zm.75 2.583H2.917v1.5H6.25v-1.5Z"
    />
    <Path
      stroke={props.color || '#848A9B'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12.496 4.773v.007M8.916 13.293v.007M11.477 12.246v.007M13.163 10.067v.006M13.543 7.333v.007"
    />
  </Svg>
);
