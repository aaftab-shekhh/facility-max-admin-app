import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const QuitIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}>
    <Path
      fill="#DC3545"
      d="M2 18c-.55 0-1.021-.196-1.413-.588A1.922 1.922 0 0 1 0 16V2C0 1.45.196.979.588.587A1.922 1.922 0 0 1 2 0h7v2H2v14h7v2H2Zm11-4-1.375-1.45 2.55-2.55H6V8h8.175l-2.55-2.55L13 4l5 5-5 5Z"
    />
  </Svg>
);
