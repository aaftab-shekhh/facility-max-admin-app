import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const PdfPlanFileIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Rect width={24} height={24} fill="#1B6BC0" rx={6.667} />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M6 18h12M7.333 18V8.667L12.666 6v12M16.667 18v-6.667l-4-2.666M10 10v.007M10 12v.007M10 14v.007M10 16v.007"
    />
  </Svg>
);
