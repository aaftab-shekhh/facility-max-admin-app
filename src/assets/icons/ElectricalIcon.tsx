import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const ElectricalIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={31}
    fill="none"
    {...props}>
    <Rect width={30} height={30} y={0.54} fill="#FFC107" rx={6.667} />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M19.588 13.873h-3.177l1.894-4.42a.417.417 0 0 0-.383-.58h-4.167a.416.416 0 0 0-.383.253l-2.5 5.833a.417.417 0 0 0 .383.58h2.062l-2.449 6.096c-.166.414.348.765.673.458l4.186-3.953 4.132-3.534a.417.417 0 0 0-.27-.733Zm-3.809.833h2.681l-3.29 2.815-2.82 2.663 1.97-4.906a.416.416 0 0 0-.387-.572h-2.046l2.143-5h3.26l-1.894 4.42a.417.417 0 0 0 .383.58Z"
      clipRule="evenodd"
    />
  </Svg>
);
