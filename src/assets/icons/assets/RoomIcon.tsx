import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  LinearGradient,
  Stop,
  Defs,
  Ellipse,
} from 'react-native-svg';

export const RoomIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path fill="url(#a)" d="M11.653 2 1 6.587v12.284l10.653-4.689V2Z" />
    <Path fill="url(#b)" d="m11.601 2 10.653 4.587v12.284L11.6 14.182V2Z" />
    <Path
      fill="url(#c)"
      d="M11.653 14.182 1 18.872 11.296 23l10.908-4.129-10.551-4.689Z"
    />
    <Path
      fill="url(#d)"
      d="M14.355 8.32v7.088l4.078 1.781v-7.01L14.355 8.32Z"
    />
    <Ellipse
      cx={17.771}
      cy={13.517}
      fill="#FFF4DE"
      rx={0.306}
      ry={0.204}
      transform="rotate(21.762 17.77 13.517)"
    />
    <Path
      fill="#C9F7FF"
      stroke="#C8C8C8"
      strokeWidth={0.306}
      d="M3.957 14.233c.017-1.461.04-4.486 0-4.893L8.595 7.3v4.741l-4.638 2.192Z"
    />
    <Path
      fill="url(#e)"
      d="m6.351 8.474-.714.305-1.223 5.047.867-.357 1.07-4.995Z"
    />
    <Path
      fill="url(#f)"
      d="m7.421 8.015-.713.305-1.224 5.047.867-.357 1.07-4.995Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={6.326}
        x2={6.326}
        y1={2}
        y2={18.871}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B5DDF5" />
        <Stop offset={1} stopColor="#A1CDE7" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={16.927}
        x2={16.927}
        y1={2}
        y2={18.871}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#E6F6FF" />
        <Stop offset={1} stopColor="#C2DFEF" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={6.862}
        x2={17.616}
        y1={14.233}
        y2={21.624}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#E3BE78" />
        <Stop offset={1} stopColor="#F5CE85" />
      </LinearGradient>
      <LinearGradient
        id="d"
        x1={16.394}
        x2={16.394}
        y1={8.32}
        y2={17.189}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#C98259" />
        <Stop offset={1} stopColor="#976040" />
      </LinearGradient>
      <LinearGradient
        id="e"
        x1={5.383}
        x2={5.383}
        y1={8.474}
        y2={13.826}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#fff" />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
      <LinearGradient
        id="f"
        x1={6.453}
        x2={6.453}
        y1={8.015}
        y2={13.367}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#fff" />
        <Stop offset={1} stopColor="#fff" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  </Svg>
);
