import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const AddDocumentIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Path
      fill="#fff"
      d="M30.046 11.58 22.17 3.703a1.124 1.124 0 0 0-.796-.329h-13.5a2.25 2.25 0 0 0-2.25 2.25v24.75a2.25 2.25 0 0 0 2.25 2.25h20.25a2.25 2.25 0 0 0 2.25-2.25v-18a1.126 1.126 0 0 0-.33-.796ZM22.5 7.214l4.035 4.035H22.5V7.215Zm5.625 23.16H7.875V5.625H20.25v6.75a1.125 1.125 0 0 0 1.125 1.125h6.75v16.875Z"
    />
  </Svg>
);
