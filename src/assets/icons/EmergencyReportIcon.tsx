import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const EmergencyReportIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Path
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="M12 7.5H9a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h8.546M27 18v-7.5a3 3 0 0 0-3-3h-3"
    />
    <Rect
      width={9}
      height={6}
      x={12}
      y={4.5}
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      rx={1.244}
    />
    <Path
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="M12 16.5h6M12 22.5h4.5"
    />
    <Path
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.556}
      d="M20.8 31.258h2.773l7.853-7.895a1.977 1.977 0 0 0 0-2.786 1.953 1.953 0 0 0-2.772 0l-7.853 7.895v2.786Z"
      clipRule="evenodd"
    />
    <Path
      stroke={props.color || '#6C757D'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.556}
      d="m27.27 21.97 2.771 2.787"
    />
  </Svg>
);
