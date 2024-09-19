import {translate} from '@shopify/react-native-skia';
import * as React from 'react';
import Svg, {
  Path,
  Defs,
  SvgProps,
  Stop,
  LinearGradient,
} from 'react-native-svg';

export const Logo2SVG = function (props: SvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={199}
      height={250}
      fill="none"
      style={{
        position: 'absolute',
        left: '50%',
        right: '50%',
        top: '60%',
        transform: [{translateX: -100}],
      }}
      {...props}>
      <Path
        fill="url(#a)"
        fillRule="evenodd"
        d="M103.902 0h-19.45l17.659 2.047-2.959 189.119-23.913-.508c-.782 8.411-1.782 37.426-2.242 52.718h-21.59l-.958-126.934h14.042l1.791 37.108v-39.411h-15.85l-.272-36.085 31.733-1.535-33.78-1.791-.526 39.411H26.615l-.592 62.443H0v68.074l2.76-63.995 23.214 1.112-.638 67.233h148.687l-1.769-107.301 22.498-.951 1.536 108.508 2.047-113.115h-26.172L170.952 62.7l-1.248 73.447h-18.256l-1.225-85.22h-28.151l26.615 2.048-1.868 83.172H105.31L103.902 0Zm1.495 144.529.483 46.78 17.472.372-17.462.592.529 51.103h37.992l2.259-100.59-41.273 1.743Zm46.144-1.949 1.449 100.796h14.891l1.726-101.56-18.066.764Zm-73.487 50.637 21.078-.715-.796 50.874H79.284l-1.23-50.159Zm-48.987-11.296.62 61.455h16.18l.807-60.611-17.607-.844Zm-.054-5.339h17.743l.8-60.14h-19.15l.607 60.14Z"
        clipRule="evenodd"
        opacity={0.5}
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={70.633}
          x2={85.732}
          y1={-142.289}
          y2={327.573}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#fff" />
          <Stop offset={1} stopColor="#1E1E2D" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
