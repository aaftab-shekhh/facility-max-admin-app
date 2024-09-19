import * as React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import {colors} from '../styles/colors';

export function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  const {isConnected} = useNetInfo();

  const backgroundAndroid =
    props.barStyle === 'light-content'
      ? colors.headerColor
      : colors.backgroundMainColor;

  return isFocused ? (
    <StatusBar
      animated={true}
      backgroundColor={!isConnected ? colors.deleteColor : backgroundAndroid}
      barStyle={props.barStyle}
      // hidden={Platform.OS === 'ios' && !isConnected}
    />
  ) : null;
}
