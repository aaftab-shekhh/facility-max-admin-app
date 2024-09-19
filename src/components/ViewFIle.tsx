import {StyleSheet, View} from 'react-native';
import {WebViewModalLayout} from './Layouts/WebViewModalLayout';
import WebView from 'react-native-webview';
import {FC} from 'react';

type ViewFileProps = {
  URL: string;
  name: string;
  toggleModal: () => void;
};

export const ViewFile: FC<ViewFileProps> = ({URL, name, toggleModal}) => {
  return (
    <WebViewModalLayout
      title={name}
      isModalVisible={true}
      toggleModal={toggleModal}>
      <View style={styles.container}>
        <WebView
          source={{
            uri: URL,
          }}
          onLoadProgress={({nativeEvent}) => {
            console.log(nativeEvent.progress);
          }}
          style={styles.webView}
        />
      </View>
    </WebViewModalLayout>
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
