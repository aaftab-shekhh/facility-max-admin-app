import * as React from 'react';
import Svg, {SvgProps, Path, Rect, Circle} from 'react-native-svg';

export const FireEmergencyIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={37}
    fill="none"
    {...props}>
    <Rect width={36} height={36} y={0.46} fill="#DC3545" rx={8} />
    <Circle
      cx={12.167}
      cy={22.627}
      r={1.667}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
    />
    <Circle
      cx={22.167}
      cy={22.627}
      r={1.667}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
    />
    <Path
      fill="#fff"
      d="M13.832 22.835a.625.625 0 0 0 0 1.25v-1.25Zm6.667 1.25a.625.625 0 1 0 0-1.25v1.25Zm3.333-1.25a.625.625 0 0 0 0 1.25v-1.25Zm1.667.625v.625c.345 0 .625-.28.625-.625h-.625Zm-5-9.167v-.624a.625.625 0 0 0-.599.804l.599-.18Zm1.25 4.167-.599.18c.08.264.323.445.599.445v-.625Zm3.75.625a.625.625 0 1 0 0-1.25v1.25Zm-11.667 5h6.667v-1.25h-6.667v1.25Zm10 0h1.667v-1.25h-1.667v1.25Zm2.292-.625v-5h-1.25v5h1.25Zm0-5a4.792 4.792 0 0 0-4.792-4.792v1.25a3.542 3.542 0 0 1 3.542 3.542h1.25Zm-4.792-4.792h-.833v1.25h.833v-1.25Zm-1.432.805 1.25 4.167 1.197-.36-1.25-4.166-1.197.359Zm1.849 4.612h3.75v-1.25h-3.75v1.25Z"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M18 23.46v-9.167h2.5M10.5 22.627V18.46H18M10.5 15.96l15-5M12.999 18.46v-3.334"
    />
  </Svg>
);
