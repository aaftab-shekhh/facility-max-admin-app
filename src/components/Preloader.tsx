import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {colors} from '../styles/colors';

export const Preloader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={colors.mainActiveColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000032',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
