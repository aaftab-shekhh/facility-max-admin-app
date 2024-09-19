import {FC} from 'react';
import {View} from 'react-native';

type SeparatorProps = {
  size: number;
};

export const Separator: FC<SeparatorProps> = ({size}) => {
  return <View style={{height: size}} />;
};
