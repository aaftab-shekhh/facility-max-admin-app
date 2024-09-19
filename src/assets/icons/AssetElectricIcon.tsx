import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const AssetElectricIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={37}
    height={36}
    fill="none"
    {...props}>
    <Rect width={36} height={36} x={0.5} fill="#E2A42A" rx={8} />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M24.003 16H20.19l2.273-5.303a.501.501 0 0 0-.46-.697h-5a.5.5 0 0 0-.46.303l-3 7a.501.501 0 0 0 .46.697h2.474l-2.938 7.314c-.2.497.417.918.807.55l5.024-4.743 4.958-4.241a.5.5 0 0 0-.325-.88Zm-4.571 1h3.217L18.7 20.378l-3.385 3.195 2.365-5.887a.5.5 0 0 0-.464-.686H14.76l2.572-6h3.912l-2.273 5.303a.501.501 0 0 0 .46.697Z"
      clipRule="evenodd"
    />
  </Svg>
);
