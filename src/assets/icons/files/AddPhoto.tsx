import * as React from 'react';
import Svg, {SvgProps, Path, ClipPath, Defs, G} from 'react-native-svg';

export const AddPhoto = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <G clipPath="url(#a)">
      <Path
        stroke="#848A9B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="M14.104 7.526h.009M4 13.372l3.65-3.565c.846-.796 1.89-.796 2.736 0l4.561 4.456"
      />
      <Path
        stroke="#848A9B"
        strokeLinecap="round"
        strokeWidth={1.2}
        d="M19.158 13.545V7.526A2.526 2.526 0 0 0 16.632 5H6.526A2.526 2.526 0 0 0 4 7.526v7.58a2.526 2.526 0 0 0 2.526 2.526h6.316"
      />
      <Path
        stroke="#848A9B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.2}
        d="m13.263 12.475.982-.946c.912-.845 2.036-.845 2.947 0l1.965 1.892"
      />
      <Path
        fill="#848A9B"
        d="M14.945 17.031a.6.6 0 1 0 0 1.2v-1.2Zm5.053 1.2a.6.6 0 1 0 0-1.2v1.2Zm-1.926-3.126a.6.6 0 1 0-1.2 0h1.2Zm-1.2 5.053a.6.6 0 0 0 1.2 0h-1.2Zm-1.927-1.927h5.053v-1.2h-5.053v1.2Zm1.927-3.126v5.053h1.2v-5.053h-1.2Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
