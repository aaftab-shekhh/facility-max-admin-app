import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';

export const MonitoringProceduresIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}>
    <Rect width={25} height={25} fill="#F58839" rx={5} />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M13.838 8.616H9.017a2.009 2.009 0 0 0-2.01 2.01v4.017a2.009 2.009 0 0 0 2.01 2.009h4.821a2.009 2.009 0 0 0 2.01-2.009v-4.018a2.009 2.009 0 0 0-2.01-2.009Zm-6.027 2.01A1.205 1.205 0 0 1 9.017 9.42h4.821a1.205 1.205 0 0 1 1.206 1.205v4.018a1.205 1.205 0 0 1-1.206 1.205H9.017a1.205 1.205 0 0 1-1.206-1.205v-4.018Z"
      clipRule="evenodd"
    />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="m17.635 9.485-2.391 1.556a.403.403 0 0 0-.183.332l-.022 2.1a.403.403 0 0 0 .183.34l2.413 1.57a.403.403 0 0 0 .622-.337V9.823a.402.402 0 0 0-.622-.338Zm-.182 4.822-1.608-1.046.017-1.663 1.591-1.035v3.743Z"
      clipRule="evenodd"
    />
  </Svg>
);
