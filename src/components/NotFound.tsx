import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/colors';
import FastImage from 'react-native-fast-image';

type NotFoundProps = {
  title?: string;
};

export const NotFound: FC<NotFoundProps> = ({title}) => {
  return (
    <View style={styles.notFoundContainer}>
      <FastImage
        source={require('../assets/img/notFoundImage.png')}
        style={{width: 40, height: 40}}
      />
      <Text style={styles.notFoundText}>{title || 'Not found'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notFoundText: {
    maxWidth: 250,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondColor,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
});
