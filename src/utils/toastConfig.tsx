import {StyleSheet, Text, View} from 'react-native';
import {ErrorToast} from 'react-native-toast-message';
import {colors} from '../styles/colors';

export const toastConfig = {
  success: ({text1, text2}: {text1: string; text2: string}) => (
    <View style={[styles.lining, {backgroundColor: colors.selectCheck}]}>
      <View style={styles.container}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.message}>{text2}</Text>
      </View>
    </View>
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={styles.title}
      text2Style={styles.message}
    />
  ),
  customError: ({text1, text2}: {text1: string; text2: string}) => (
    <View style={[styles.lining, {backgroundColor: colors.deleteColor}]}>
      <View style={styles.container}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.message}>{text2}</Text>
      </View>
    </View>
  ),
  notification: ({text1, text2}: {text1: string; text2: string}) => (
    <View style={[styles.lining, {backgroundColor: colors.selectCheck}]}>
      <View style={styles.container}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.message}>{text2}</Text>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  lining: {
    width: '90%',
    paddingLeft: 5,
    borderRadius: 8,
    marginTop: 5,
  },
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopStartRadius: 3,
    borderBottomStartRadius: 3,
    borderTopEndRadius: 8,
    borderBottomEndRadius: 8,
    gap: 3,
    backgroundColor: colors.backgroundAssetCard,
  },
  title: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
  },
  message: {
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '400',
  },
});
