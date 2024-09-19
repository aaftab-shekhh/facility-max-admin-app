import {Platform} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';

export const convertToBlob = (file: DocumentPickerResponse) => {
  return {
    name: file.name || file.fileName,
    type: file.type,
    uri: Platform.OS === 'ios' ? file.uri?.replace('file://', '') : file.uri,
  };
};
