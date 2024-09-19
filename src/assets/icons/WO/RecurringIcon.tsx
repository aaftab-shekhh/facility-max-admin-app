import * as React from 'react';
import Svg, {SvgProps, Path, Defs, ClipPath, Rect, G} from 'react-native-svg';

export const RecurringIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}>
    <G clipPath="url(#a)">
      <Rect width={16} height={17} x={0.168} fill="#1B6BC0" rx={4} />
      <Path
        fill="#fff"
        d="m4.736 6.318.996-.305a.625.625 0 1 1 .366 1.195l-2.39.731a.625.625 0 0 1-.781-.415l-.732-2.39a.625.625 0 1 1 1.196-.366l.275.9a5.868 5.868 0 0 1 9.227-.78 5.864 5.864 0 0 1 1.277 2.196.627.627 0 0 1-.647.823.626.626 0 0 1-.544-.443 4.613 4.613 0 0 0-8.243-1.146Zm7.704 5.121-1.11.277a.627.627 0 0 1-.696-.93.625.625 0 0 1 .394-.282l2.277-.568a.623.623 0 0 1 .382-.05.625.625 0 0 1 .524.468l.605 2.425a.625.625 0 0 1-1.212.303l-.206-.826a5.864 5.864 0 0 1-10.24-1.123l-.163-.396a.625.625 0 0 1 1.157-.474l.163.396a4.613 4.613 0 0 0 8.125.78Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Rect width={16} height={17} x={0.168} fill="#fff" rx={4} />
      </ClipPath>
    </Defs>
  </Svg>
);
