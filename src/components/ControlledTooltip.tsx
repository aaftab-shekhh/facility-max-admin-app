import {FC} from 'react';
import {StyleSheet} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

export const ControlledTooltip: FC<any> = props => {
  return (
    <Tooltip
      isVisible={props.visible}
      backgroundColor={'#fff0'}
      containerStyle={styles.container}
      withPointer={false}
      skipAndroidStatusBar={true}
      withOverlay={false}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'flex-start',
    padding: 0,
    paddingHorizontal: 0,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
  },
});
