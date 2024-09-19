import {FC, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {NotFound} from '../../../../../components/NotFound';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import moment from 'moment';
import {colors} from '../../../../../styles/colors';
import {emergencyProcedureIcons, filesIcons} from '../../../../../bll/icons';
import FastImage from 'react-native-fast-image';
import {handleServerNetworkError} from '../../../../../utils/handleServerNetworkUtils';
import {ProceduresData} from '../../../../../bll/state';
import {ProcedureType} from '../../../../../types/EmergencyTypes';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';

type EmergencyPlanProceduresProps = {
  planId: string;
};

const Procedure = ({item, planId}) => {
  const [isOpen, setIsopen] = useState(false);

  const togleOpen = () => {
    setIsopen(!isOpen);
  };
  const [selectedProcedures, setSelectedProcedures] = useState<ProcedureType[]>(
    [],
  );

  const getProcedures = async () => {
    try {
      const selectedRes = await emergencyAPI.getProcedures({
        type: item.id,
        emergencyPlanId: planId,
      });
      setSelectedProcedures(selectedRes.data.payload);
    } catch (err) {
      handleServerNetworkError(err.response.data);
    } finally {
    }
  };

  useEffect(() => {
    getProcedures();
  }, []);

  return (
    <View style={styles.procedureContainer}>
      <Pressable style={styles.header} onPress={togleOpen}>
        <View style={styles.header}>
          <FastImage
            source={emergencyProcedureIcons[item.id]}
            style={styles.icon}
            defaultSource={emergencyProcedureIcons[item.id]}
          />
          <Text style={styles.title}>
            {item.name} ({selectedProcedures.length})
          </Text>
        </View>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </Pressable>
      {isOpen && (
        <View style={{gap: 10, paddingHorizontal: 10}}>
          {selectedProcedures.length ? (
            selectedProcedures.map(el => (
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <FastImage
                  source={filesIcons[el.mimetype]}
                  style={styles.fileImage}
                />
                <View style={{}}>
                  <Text style={styles.title}>{el.name}</Text>
                  <View style={{flex: 1}}>
                    <Text style={styles.textSecond}>
                      Created {moment(el.createdAt).format('DD/MM/YYYY H:mm A')}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <NotFound title="Procedures Not Found." />
          )}
        </View>
      )}
    </View>
  );
};

export const EmergencyPlanProcedures: FC<EmergencyPlanProceduresProps> = ({
  planId,
}) => {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      keyExtractor={item => item.id}
      data={ProceduresData}
      renderItem={({item}) => <Procedure item={item} planId={planId} />}
      ListEmptyComponent={() => {
        return <NotFound title="Procedures Not Found" />;
      }}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    gap: 10,
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  procedureContainer: {
    gap: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.backgroundLightColor,
  },
  header: {
    gap: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileImage: {
    width: 20,
    height: 20,
  },
  icon: {
    width: 25,
    height: 25,
  },
  title: {
    // flex: 1,
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  textSecond: {
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21,
  },
});
