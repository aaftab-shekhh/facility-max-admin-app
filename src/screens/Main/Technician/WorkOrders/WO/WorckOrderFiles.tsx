import {FC, useEffect, useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {colors} from '../../../../../styles/colors';
import {woAPI} from '../../../../../api/woApi';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {NotFound} from '../../../../../components/NotFound';
import {FileItem} from '../../../../../components/FileItem';

type WorckOrderFilesProps = {
  workOrderId: string;
};

export const WorckOrderFiles: FC<WorckOrderFilesProps> = ({workOrderId}) => {
  const [isReqFiles, setIsReqFiles] = useState(true);
  const [isTechFiles, setIsTechFiles] = useState(true);
  const [isPlans, setIsPlans] = useState(true);

  const [requestorFiles, setRequestorFiles] = useState([]);
  const [technicianFile, setTechnicianFile] = useState([]);
  const [plansDiagrams, setPlansDiagrams] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const getFilesAndPlans = async () => {
    setIsLoading(true);
    try {
      const {
        data: {requestorWoFilesCount, technicianWoFilesCount},
      } = await woAPI.getWOFileCounts({workOrderId});

      if (requestorWoFilesCount !== 0) {
        setRequestorFiles(
          (
            await woAPI.getWOFiles({
              workOrderId,
              fileKey: 'requestorFile',
            })
          ).data.rows,
        );
      }
      if (technicianWoFilesCount !== 0) {
        setTechnicianFile(
          (
            await woAPI.getWOFiles({
              workOrderId,
              fileKey: 'technicianFile',
            })
          ).data.rows,
        );
      }
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFilesAndPlans();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingTop: 10, gap: 10}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getFilesAndPlans}
            colors={[colors.mainActiveColor]} // for android
            tintColor={colors.mainActiveColor} // for ios
          />
        }>
        {requestorFiles && requestorFiles.length > 0 && (
          <View style={styles.section}>
            <Pressable
              onPress={() => setIsReqFiles(!isReqFiles)}
              style={[styles.header, isReqFiles && styles.headerOpen]}>
              <Text style={styles.headerText}>Requestor Files</Text>
              {isReqFiles ? (
                <ArrowUpIcon color={colors.textSecondColor} />
              ) : (
                <ArrowDownIcon color={colors.textSecondColor} />
              )}
            </Pressable>
            {isReqFiles && (
              <View style={styles.files}>
                {requestorFiles &&
                  requestorFiles.map(file => {
                    return (
                      <FileItem
                        key={file.id}
                        file={file}
                        refresh={getFilesAndPlans}
                      />
                    );
                  })}
              </View>
            )}
          </View>
        )}
        {technicianFile && technicianFile.length > 0 && (
          <View style={styles.section}>
            <Pressable
              onPress={() => setIsTechFiles(!isTechFiles)}
              style={styles.header}>
              <Text style={styles.headerText}>Technician Files</Text>
              {isTechFiles ? (
                <ArrowUpIcon color={colors.textSecondColor} />
              ) : (
                <ArrowDownIcon color={colors.textSecondColor} />
              )}
            </Pressable>
            {isTechFiles ? (
              <View style={styles.files}>
                {technicianFile.map(file => {
                  return <FileItem key={file.id} file={file} />;
                })}
              </View>
            ) : null}
          </View>
        )}
        {plansDiagrams && plansDiagrams.length > 0 && (
          <View style={styles.section}>
            <Pressable
              onPress={() => setIsPlans(!isPlans)}
              style={styles.header}>
              <Text style={styles.headerText}>Plans & Diagrams</Text>
              {isPlans ? (
                <ArrowUpIcon color={colors.textSecondColor} />
              ) : (
                <ArrowDownIcon color={colors.textSecondColor} />
              )}
            </Pressable>
            {isPlans ? (
              <View style={styles.files}>
                {plansDiagrams.map(file => {
                  return <FileItem key={file.id} file={file} />;
                })}
              </View>
            ) : null}
          </View>
        )}
        {requestorFiles &&
          requestorFiles.length < 1 &&
          technicianFile &&
          technicianFile.length < 1 && (
            <NotFound title="There are currently no files & plans." />
          )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    gap: 10,
  },
  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },

  files: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
