import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const HealthEmergenciesIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={37}
    fill="none"
    {...props}>
    <Rect width={36} height={36} y={0.46} fill="#1B6BC0" rx={8} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M18.833 10.96c.46 0 .834.373.834.833v3.78l3.273-1.89a.833.833 0 0 1 1.138.305l.834 1.444a.833.833 0 0 1-.305 1.138l-3.273 1.89 3.273 1.89c.398.23.535.74.305 1.14l-.834 1.443a.833.833 0 0 1-1.138.305l-3.273-1.891v3.78c0 .46-.373.833-.834.833h-1.666a.833.833 0 0 1-.834-.833v-3.78l-3.273 1.89a.833.833 0 0 1-1.138-.305l-.834-1.444a.833.833 0 0 1 .305-1.138l3.273-1.89-3.273-1.89a.833.833 0 0 1-.305-1.138l.834-1.444a.833.833 0 0 1 1.138-.305l3.273 1.89v-3.78c0-.46.373-.833.834-.833h1.666Z"
      clipRule="evenodd"
    />
  </Svg>
);
