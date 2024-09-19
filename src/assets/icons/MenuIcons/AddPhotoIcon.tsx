import * as React from 'react';
import Svg, {SvgProps, Path, Defs, ClipPath, G} from 'react-native-svg';

export const AddPhotoIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={38}
    height={38}
    fill="none"
    {...props}>
    <G clipPath="url(#a)">
      <Path
        stroke="#1B6BC0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M22.332 11.917h.013M6.333 21.172l5.778-5.643c1.34-1.26 2.992-1.26 4.333 0l7.222 7.055"
      />
      <Path
        stroke="#1B6BC0"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M30.333 21.446V10.443a2.526 2.526 0 0 0-2.526-2.526H8.859a2.526 2.526 0 0 0-2.526 2.526V25.39a2.526 2.526 0 0 0 2.526 2.527h11.474"
      />
      <Path
        stroke="#1B6BC0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m21 19.752 1.556-1.498c1.443-1.338 3.222-1.338 4.666 0l3.111 2.996"
      />
      <Path
        fill="#1B6BC0"
        d="M23.663 27.166a.75.75 0 0 0 0 1.5v-1.5Zm8 1.5a.75.75 0 0 0 0-1.5v1.5Zm-3.25-4.75a.75.75 0 0 0-1.5 0h1.5Zm-1.5 8a.75.75 0 0 0 1.5 0h-1.5Zm-3.25-3.25h8v-1.5h-8v1.5Zm3.25-4.75v8h1.5v-8h-1.5Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h38v38H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
