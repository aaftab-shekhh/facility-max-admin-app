import React, {useEffect, useState} from 'react';
import {
  Animated as A,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Provider} from 'react-redux';
import {persistor, store} from './src/bll/store';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import {RootStack} from './src/screens/RootStack';
import {decode, encode} from 'base-64';
import background from './src/assets/img/background.png';
import BootSplash from 'react-native-bootsplash';
import {useOfflineMode} from './src/hooks/useOfflineMode';
import {colors} from './src/styles/colors';
import {SCREEN_HEIGHT} from './src/styles/styles';
import {useNetInfo} from '@react-native-community/netinfo';
import {useAppSelector} from './src/hooks/hooks';
import Animated from 'react-native-reanimated';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {usePermissions} from './src/hooks/usePermissions';
import {MenuProvider} from 'react-native-popup-menu';
import {NavigationContainer} from '@react-navigation/native';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
DropDownPicker.setListMode('SCROLLVIEW');

type Props = {
  onAnimationEnd: () => void;
};

const AnimatedBootSplash = ({onAnimationEnd}: Props) => {
  const [opacity] = useState(() => new A.Value(0));
  const {isConnected} = useNetInfo();
  const {getStoragePermissions, storagePermissions} = usePermissions();
  const {downloadFiles, readFile, modelText, downloadProgress} =
    useOfflineMode();
  const {arhiveLinks, isOfflineMode} = useAppSelector(state => state.app);
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = downloadProgress;
  }, [downloadProgress]);

  const fullProgress = Object.keys(arhiveLinks).length;

  const readFiles = async () => {
    Object.values(arhiveLinks || {}).forEach(
      async (
        el: {
          url: string;
          name: string;
          model: string;
          dirPath: string;
        },
        index,
      ) => {
        progress.value = +(((index + 1) * 100) / fullProgress).toFixed(0);
        await readFile(el.dirPath, el.model);
      },
    );
  };

  const {container, logo} = BootSplash.useHideAnimation({
    manifest: require('./assets/bootsplash_manifest.json'),

    logo: require('./assets/bootsplash_logo.png'),

    statusBarTranslucent: true,
    navigationBarTranslucent: false,

    animate: () => {
      A.timing(opacity, {
        useNativeDriver: true,
        toValue: 1,
        duration: 500,
      }).start(async () => {
        try {
          isConnected && isOfflineMode
            ? Platform.OS === 'ios'
              ? await downloadFiles()
              : storagePermissions
              ? await downloadFiles()
              : getStoragePermissions()
            : Platform.OS === 'ios'
            ? storagePermissions
              ? await readFiles()
              : getStoragePermissions()
            : null;
          // : await readFiles();
        } catch (err) {
          console.log('err lounch', err);
        } finally {
          setTimeout(() => {
            onAnimationEnd();
          }, 1000);
        }
      });
    },
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  useEffect(() => {
    getStoragePermissions();
  }, []);

  return (
    <A.View {...container} style={[container.style, {opacity}]}>
      <StatusBar hidden={true} />
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={styles.background}>
        <Image {...logo} />
        <View style={styles.progressContainer}>
          <View style={[styles.fullProgress]}>
            <Animated.View style={[styles.progress, progressStyle]} />
          </View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.status}>
            {modelText}
          </Text>
        </View>
      </ImageBackground>
      {/* <Image {...brand} /> */}
    </A.View>
  );
};

function App(): JSX.Element {
  const [visible, setVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <MenuProvider>
            {visible ? (
              <AnimatedBootSplash
                onAnimationEnd={() => {
                  setVisible(false);
                }}
              />
            ) : (
              <NavigationContainer>
                <RootStack />
              </NavigationContainer>
            )}
          </MenuProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    color: colors.textSecondColor,
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14,
  },
  progressContainer: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    bottom: SCREEN_HEIGHT * 0.15,
  },
  fullProgress: {
    borderRadius: 5,
    height: 5,
    backgroundColor: '#56567B',
    marginBottom: 2,
  },
  progress: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: '#FFC107',
  },
});
