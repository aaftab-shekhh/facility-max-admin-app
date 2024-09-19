import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

export const MapPinIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={19}
    fill="none"
    {...props}>
    <Path
      stroke="#848A9B"
      strokeWidth={1.2}
      d="M14.853 7.835c0 1.486-.658 3.931-1.754 6.011-.545 1.034-1.18 1.941-1.86 2.582-.684.643-1.363.972-2.012.972-.65 0-1.33-.328-2.013-.972-.68-.64-1.315-1.548-1.86-2.582C4.26 11.766 3.6 9.321 3.6 7.835 3.6 4.98 6.082 2.6 9.227 2.6c3.144 0 5.626 2.38 5.626 5.235Z"
    />
    <Path
      stroke="#848A9B"
      strokeWidth={1.2}
      d="M12.275 8.476c0 1.52-1.326 2.817-3.046 2.817-1.72 0-3.047-1.298-3.047-2.817 0-1.52 1.327-2.817 3.047-2.817 1.72 0 3.046 1.297 3.046 2.817Z"
    />
  </Svg>
);
