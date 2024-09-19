import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

export const RelationshipIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Circle
      cx={6}
      cy={18}
      r={2}
      stroke="#6C757D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Circle
      cx={18}
      cy={6}
      r={2}
      stroke="#6C757D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      stroke="#6C757D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m7.5 16.5 9-9"
    />
  </Svg>
);
