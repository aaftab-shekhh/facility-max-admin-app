import {FC} from 'react';
import {StyleSheet, Text} from 'react-native';
import {colors} from '../../styles/colors';

type DevProps = {
  children?: JSX.Element | JSX.Element[];
};

export const Dev: FC<DevProps> = ({children}) => {
  return (
    <>
      {__DEV__ ? (
        <>
          <Text style={styles.text}>↓↓↓ DEV ↓↓↓</Text>
          {children}
          <Text style={styles.text}>↑↑↑ DEV ↑↑↑</Text>
        </>
      ) : (
        <Text style={styles.textDev}>In development</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {fontSize: 10, color: 'red', textAlign: 'center'},
  textDev: {color: colors.textColor},
});
