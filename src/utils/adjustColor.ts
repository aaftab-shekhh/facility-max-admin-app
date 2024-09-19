import {convertToRGBA} from 'react-native-reanimated';

export const adjustColor = (hex: string, amount: number) => {
  const [r, g, b] = convertToRGBA(hex);
  return `rgba(${r * 256}, ${g * 256}, ${b * 256}, ${amount})`;
};
