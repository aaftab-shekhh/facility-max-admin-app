import {useCallback, useState} from 'react';
import {SCREEN_WIDTH} from '../styles/styles';

export const useOrientation = () => {
  const [numColumn, setNumColumn] = useState(
    Math.floor(SCREEN_WIDTH / 350) || 1,
  );

  const onLayout = useCallback((width: number) => {
    setNumColumn(Math.floor(width / 350) || 1);
  }, []);

  return {numColumn, onLayout};
};
