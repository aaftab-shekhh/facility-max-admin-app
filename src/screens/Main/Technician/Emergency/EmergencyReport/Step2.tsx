import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {stylesModal} from '../../../../../styles/styles';
import {InputItem} from '../../../../../components/InputItam';
import {Formik} from 'formik';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/hooks';
import {useEffect, useState} from 'react';
import {colors} from '../../../../../styles/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EmergencyReportStep2Props} from '../../../../../types/NavTypes/TechnicianNavTypes';
import {Location} from './Location';
import {AssetsReport} from './AssetsReport';
import {
  changeTitleDescriptionTC,
  incOrDecEmergencyReportTC,
} from '../../../../../bll/reducers/createNewEmergencyReport';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {reportValidationsSchema} from '../../../../../utils/validationSchemes';
import {EmergencyPlanScenario} from '../../../../../enums/emergency';
import {emergencyAPI} from '../../../../../api/emergencyApi';

export const Step2 = ({navigation}: EmergencyReportStep2Props) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const {currentLevel, description, title, scenario} = useAppSelector(
    state => state.createNewEmergencyResport.newEmergencyReport,
  );

  const action = async (type: string) => {
    setIsLoading(true);
    try {
      dispatch(incOrDecEmergencyReportTC({type}));
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentLevel || currentLevel === 0) {
      navigation.navigate('EmergencyReportStep1');
    }
    if (currentLevel === 2) {
      navigation.navigate('EmergencyReportStep3');
    }
  }, [currentLevel]);

  return (
    <Formik
      initialValues={{
        title: title || '',
        description: description || '',
      }}
      validateOnBlur
      onSubmit={values => {
        const body: {title?: string; description?: string} = {};
        if (values.title) {
          body.title = values.title;
        }
        if (values.description) {
          body.description = values.description;
        }
        dispatch(changeTitleDescriptionTC(body));
      }}
      validationSchema={reportValidationsSchema}>
      {({errors, values, handleChange, touched, handleSubmit, handleBlur}) => {
        return (
          <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
              // style={styles.form}
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}>
              <Location />

              {scenario === EmergencyPlanScenario.INFRASTRUCTURE_FAILURES && (
                <AssetsReport />
              )}
              <Text style={styles.title}>Describe this emergency</Text>
              <InputItem
                label="Title"
                defaultValue={values.title}
                handleChange={handleChange('title')}
                error={errors.title}
                touched={touched.title}
                handleBlur={() => {
                  handleBlur('title');
                  handleSubmit();
                }}
              />
              <InputItem
                label="Description"
                multiline
                defaultValue={values.description}
                handleChange={handleChange('description')}
                error={errors.description}
                touched={touched.description}
                handleBlur={() => {
                  handleBlur('description');
                  handleSubmit();
                }}
              />
            </KeyboardAwareScrollView>

            <View style={stylesModal.modalButtons}>
              <Pressable
                disabled={isLoading}
                onPress={() => action('decrement')}
                style={[stylesModal.modalButton, styles.previous]}>
                {isLoading ? (
                  <ActivityIndicator color={colors.bottomActiveTextColor} />
                ) : (
                  <Text style={stylesModal.modalButtonText}>Previous</Text>
                )}
              </Pressable>
              <Pressable
                onPress={async () => {
                  if (values.title !== '' && values.description !== '') {
                    setIsLoading(true);
                    try {
                      await emergencyAPI.fillContactsAndProcedures();
                      action('increment');
                    } catch (err) {
                      handleServerNetworkError(err.response.data);
                    } finally {
                      setIsLoading(false);
                    }
                  } else {
                    handleSubmit();
                  }
                }}
                disabled={isLoading}
                style={stylesModal.modalButton}>
                {isLoading ? (
                  <ActivityIndicator color={colors.bottomActiveTextColor} />
                ) : (
                  <Text style={stylesModal.modalButtonText}>Next</Text>
                )}
              </Pressable>
            </View>
          </SafeAreaView>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    gap: 10,
    paddingBottom: 65,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  title: {
    paddingRight: 10,
    marginBottom: 10,
    marginTop: 20,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
    color: colors.textColor,
  },
  previous: {
    backgroundColor: colors.textSecondColor,
    borderColor: colors.textSecondColor,
  },
});
