import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {stylesModal} from '../../../../styles/styles';
import {DropdownWithLeftIcon} from '../../../../components/DropdownWithLeftIcon';
import {useAppDispatch, useAppSelector} from '../../../../hooks/hooks';
import {useCallback, useEffect, useState} from 'react';
import {colors} from '../../../../styles/colors';
import {AddPlanIcon} from '../../../../assets/icons/AddPlanIcon';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {createPlanTC} from '../../../../bll/reducers/plan-Reducer';
import {CrossIcon} from '../../../../assets/icons/CrossIcon';
import {PDFFileIcon} from '../../../../assets/icons/files/PDFFileIcon';
import {plansAPI} from '../../../../api/plansApi';
import {sortedBy} from '../../../../utils/sorted';
import {handleServerNetworkError} from '../../../../utils/handleServerNetworkUtils';
import {dropdownIcons} from '../../../../bll/icons';

export const AddPlanScreen = ({navigation}: any) => {
  const dispatch = useAppDispatch();

  const {floors} = useAppSelector(state => state.buildings);
  const [isLoading, setIsLoading] = useState(false);
  const [planTypes, setPlanTypes] = useState([]);
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedFloor, setSelectedFlor] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[]>(
    [] as DocumentPickerResponse[],
  );

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
        type: Platform.OS === 'ios' ? 'com.adobe.pdf' : 'application/pdf',
      });

      setFileResponse(response);
    } catch (err) {
      // console.warn(err);
    }
  }, []);

  const deleteFile = () => {
    setFileResponse([] as DocumentPickerResponse[]);
  };

  const [errors, setErrors] = useState<any>({
    type: null,
    floor: null,
    file: null,
  });

  const checkerrors = () => {
    if (selectedFloor === '' || !selectedType || fileResponse.length === 0) {
      if (!selectedType) {
        setErrors((prev: any) => ({
          ...prev,
          type: 'It is requered to select a Plan type',
        }));
      } else {
        setErrors((prev: any) => ({
          ...prev,
          type: null,
        }));
      }
      if (selectedFloor === '') {
        setErrors((prev: any) => ({
          ...prev,
          floor: 'It is requered to select a floor',
        }));
      } else {
        setErrors((prev: any) => ({
          ...prev,
          floor: null,
        }));
      }
      if (fileResponse.length === 0) {
        setErrors((prev: any) => ({
          ...prev,
          file: 'It is requered to select a file',
        }));
      } else {
        setErrors((prev: any) => ({
          ...prev,
          file: null,
        }));
      }
      return false;
    } else {
      setTouched(false);
      return true;
    }
  };

  const save = async () => {
    setTouched(true);

    if (checkerrors()) {
      setIsLoading(true);
      try {
        for (let i = 0; i < fileResponse.length; i += 1) {
          let data = new FormData();

          data.append('file', {
            name: fileResponse[i].name,
            type: fileResponse[i].type,
            uri:
              Platform.OS === 'ios'
                ? fileResponse[i].uri?.replace('file://', '')
                : fileResponse[i].uri,
          });

          data.append('planTypeId', selectedType);

          data.append('floorId', selectedFloor);

          await dispatch(createPlanTC(data));
        }
        setIsLoading(false);

        navigation.goBack();
      } catch (err) {
        handleServerNetworkError(err.response.data);
      }
    }
  };

  const getPlanTypes = async () => {
    const res = await plansAPI.getPlanTypes();
    setPlanTypes(res.data.planTypes);
  };

  useEffect(() => {
    checkerrors();
  }, [selectedType, selectedFloor, fileResponse.length]);

  useEffect(() => {
    getPlanTypes();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollBlock}
        showsVerticalScrollIndicator={false}>
        <DropdownWithLeftIcon
          label="Choose plan type"
          data={sortedBy('name', planTypes)}
          startValue={selectedType}
          onChange={item => {
            setSelectedType(item.id);
          }}
          dropdownIcons={dropdownIcons}
          isIcon
          error={errors.type}
          touched={touched}
        />
        <DropdownWithLeftIcon
          label="Choose floor"
          data={sortedBy('name', floors)}
          onChange={item => {
            setSelectedFlor(item.id);
          }}
          startValue={selectedFloor}
          error={errors.floor}
          touched={touched}
        />
        <Pressable style={styles.addFile} onPress={handleDocumentSelection}>
          <AddPlanIcon />
          <Text style={styles.fileName}>Click to Upload File</Text>
        </Pressable>
        {touched && errors.file && (
          <View style={[styles.subLabel]}>
            <View style={styles.mark}>
              <Text style={styles.markText}>!</Text>
            </View>
            <Text style={styles.labelErrorText}>{errors.file}</Text>
          </View>
        )}
        {fileResponse.length > 0 &&
          fileResponse.map(el => (
            <View style={styles.filesContainer}>
              <View style={styles.fileContainer}>
                <PDFFileIcon />
                <Text style={styles.fileName}>{el.name}</Text>
                <Text style={styles.fileSize}>
                  {(el.size / 1000000).toFixed(2)} MB
                </Text>
                <Pressable
                  onPress={() => {
                    deleteFile();
                  }}>
                  <CrossIcon />
                </Pressable>
              </View>
            </View>
          ))}
      </ScrollView>
      <View style={styles.saveButton}>
        <Pressable
          style={[
            stylesModal.modalButton,
            (!selectedType ||
              selectedFloor === '' ||
              fileResponse.length === 0) && {
              backgroundColor: colors.textSecondColor,
              borderColor: colors.textSecondColor,
            },
          ]}
          onPress={save}>
          {isLoading ? (
            <ActivityIndicator color={colors.bottomActiveTextColor} />
          ) : (
            <Text style={stylesModal.modalButtonText}>Save</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  scrollBlock: {},
  addFile: {
    marginVertical: 15,
    paddingVertical: 25,
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.textSecondColor,
    backgroundColor: colors.backgroundLightColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filesContainer: {
    gap: 15,
    marginBottom: 10,
  },
  fileContainer: {
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  fileName: {
    flex: 0.75,
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  fileSize: {
    flex: 0.25,
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  saveButton: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },

  subLabel: {
    flexDirection: 'row',
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 2,
  },
  mark: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: colors.deleteColor,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: 5,
  },
  markText: {
    color: colors.deleteColor,
    fontSize: 10,
  },
  labelErrorText: {
    color: colors.deleteColor,
    fontSize: 12,
    lineHeight: 18,
  },
});
