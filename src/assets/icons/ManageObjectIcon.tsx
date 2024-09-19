import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {memo} from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}>
    <Path
      fill={props.color ? props.color : '#848A9B'}
      d="M19.453 22.511a.716.716 0 1 0 0 1.432v-1.432ZM29 23.943a.716.716 0 0 0 0-1.432v1.432Zm-4.057-5.488a.716.716 0 0 0-1.432 0h1.432ZM23.51 28a.716.716 0 0 0 1.432 0H23.51Zm-4.057-4.057H29v-1.432h-9.546v1.432Zm4.057-5.488V28h1.432v-9.545H23.51Z"
    />
    <Path
      stroke={props.color ? props.color : '#848A9B'}
      strokeLinecap="round"
      strokeWidth={1.432}
      d="M27.09 16.546A9.545 9.545 0 0 0 17.547 7 9.545 9.545 0 0 0 8 16.546a9.545 9.545 0 0 0 9.546 9.545"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
