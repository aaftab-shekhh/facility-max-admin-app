import * as React from 'react';
import Svg, {SvgProps, Path, Rect, G, Defs, ClipPath} from 'react-native-svg';

export const NaturalDisasterIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Rect width={36} height={36} fill="#DE51A6" rx={8} />
    <G
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      clipPath="url(#a)">
      <Path d="M17.499 15.893c3.55 0 6.428-1.199 6.428-2.678 0-1.48-2.878-2.679-6.428-2.679s-6.429 1.2-6.429 2.679c0 1.479 2.878 2.678 6.429 2.678ZM22.718 17.21c-.932.847-2.925 1.437-5.292 1.437-1.44.03-2.87-.225-4.211-.75m8.421 2.646a7.328 7.328 0 0 1-3.6.782 9.075 9.075 0 0 1-2.678-.375m5.753 3.45c-1.018.225-1.96-.171-2.143-.89" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M10 10h15v15H10z" />
      </ClipPath>
    </Defs>
  </Svg>
);
