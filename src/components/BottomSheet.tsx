import {Dimensions, Keyboard, StyleSheet, View} from 'react-native';
import React, {useCallback, useImperativeHandle} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {colors} from '../styles/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;

type BottomSheetProps = {
  children?: React.ReactNode;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

export const BottomSheet = React.forwardRef<
  BottomSheetRefProps,
  BottomSheetProps
>(({children}, ref) => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);
  const insets = useSafeAreaInsets();
  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;

    translateY.value = withSpring(destination, {damping: 50});
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  useImperativeHandle(ref, () => ({scrollTo, isActive}), [scrollTo, isActive]);

  const context = useSharedValue({y: 0});
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 2.5) {
        scrollTo(0);
      } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y, MAX_TRANSLATE_Y],
      [0, 5],
      Extrapolate.CLAMP,
    );

    return {
      height: -translateY.value - 65 - insets.bottom,
      paddingBottom: insets.bottom,
      borderRadius,
      transform: [{translateY: translateY.value}],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? 1 : 0),
    };
  }, []);

  const rBackdropProps = useAnimatedProps(() => {
    return {
      pointerEvents: active.value ? 'auto' : 'none',
    } as any;
  }, []);

  return (
    <>
      <Animated.View
        onTouchStart={() => {
          // Dismiss the BottomSheet
          scrollTo(0);
          Keyboard.dismiss();
        }}
        animatedProps={rBackdropProps}
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.4)',
          },
          rBackdropStyle,
        ]}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.line} />
          <View style={{flex: 1, marginBottom: insets.bottom + 10}}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
});

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    // height: '100%',
    width: '100%',
    backgroundColor: colors.backgroundMainColor,
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});
