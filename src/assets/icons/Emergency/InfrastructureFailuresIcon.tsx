import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const InfrastructureFailuresIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Rect width={36} height={36} fill="#B482DC" rx={8} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M14.668 21.334V18a3.333 3.333 0 0 1 6.667 0v3.334"
    />
    <Path
      fill="#fff"
      d="M10.5 17.375a.625.625 0 1 0 0 1.25v-1.25Zm.833 1.25a.625.625 0 1 0 0-1.25v1.25Zm7.292-8.125a.625.625 0 1 0-1.25 0h1.25Zm-1.25.833a.625.625 0 1 0 1.25 0h-1.25Zm7.292 6.042a.625.625 0 1 0 0 1.25v-1.25Zm.833 1.25a.625.625 0 1 0 0-1.25v1.25Zm-12.391-6.4a.625.625 0 1 0-.884.884l.884-.884Zm-.3 1.467a.625.625 0 1 0 .883-.884l-.884.884Zm10.966-.583a.625.625 0 1 0-.884-.884l.884.884Zm-1.467-.3a.625.625 0 1 0 .884.883l-.884-.884ZM10.5 18.624h.833v-1.25H10.5v1.25Zm6.875-8.125v.833h1.25V10.5h-1.25Zm7.292 8.125h.833v-1.25h-.833v1.25Zm-12.442-5.516.583.583.884-.884-.583-.583-.884.884Zm10.666-.884-.583.583.884.884.583-.583-.884-.884Z"
    />
    <Rect
      width={10}
      height={3.333}
      x={13}
      y={21.333}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      rx={1}
    />
  </Svg>
);
