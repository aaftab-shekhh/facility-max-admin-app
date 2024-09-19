import {memo, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useAppNavigation} from '../../hooks/hooks';
import {useIsFocused} from '@react-navigation/native';
import {useAppState} from '@react-native-community/hooks';

export const QRModal = memo(() => {
  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === 'active';

  const navigation = useAppNavigation();
  const {hasPermission, requestPermission} = useCameraPermission();

  const [savedDarcode, setSavedDarcode] = useState<Code | undefined>();

  const device = useCameraDevice('back');

  const format = useCameraFormat(device, [
    {photoAspectRatio: 1},
    {photoResolution: {width: 250, height: 250}},
  ]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      !savedDarcode && setSavedDarcode(codes[0]);
    },
  });

  const cameraStyles = useMemo(
    () => ({
      flex: 1,
      height: 250,
      width: 250,
      maxHeight: 250,
      maxWidth: 250,
      borderRadius: 12,
    }),
    [device],
  );

  useEffect(() => {
    savedDarcode &&
      savedDarcode.value &&
      navigation.navigate('QR', {
        screen: 'Successfully',
        params: {id: savedDarcode.value},
      });
  }, [savedDarcode]);

  useEffect(() => {
    if (isFocused) {
      setSavedDarcode(undefined);
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, []);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  return (
    <>
      <Text style={styles.title}>
        Scan the QR code attached to the Asset or Equipment
      </Text>
      <Text style={styles.subtitle}>
        Place the code in the middle of the square
      </Text>
      {device && hasPermission && (
        <View style={styles.container}>
          <Camera
            onInitialized={() => {
              setIsInitialized(true);
            }}
            format={format}
            style={[isInitialized ? cameraStyles : {}]}
            device={device}
            isActive={isActive && isInitialized}
            codeScanner={codeScanner}
          />
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: 250,
    paddingVertical: 20,
    alignSelf: 'center',
    marginHorizontal: 15,
    borderRadius: 12,
  },
  title: {
    textAlign: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27,
    color: '#202534',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: '#202534',
  },
});
