import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../../../styles/colors';
import {FC, useEffect, useState} from 'react';
import {ArrowUpIcon} from '../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../assets/icons/ArrowDownIcon';
import {emergencyAPI} from '../../../../../api/emergencyApi';
import {ProcedureType} from '../../../../../types/EmergencyTypes';
import moment from 'moment';
import {ProceduresData} from '../../../../../bll/state';
import FastImage from 'react-native-fast-image';
import {emergencyProcedureIcons} from '../../../../../bll/icons';

type ProcedureProps = {
  procedure: ProcedureType;
};

export const Procedure: FC<ProcedureProps> = ({procedure}) => {
  return (
    <View style={procedureStyles.container}>
      <Text style={procedureStyles.title}>{procedure?.name}</Text>
      <Text style={procedureStyles.text}>
        {moment(procedure?.createdAt).format('MM/DD/YYYY h:MM A')}
      </Text>
    </View>
  );
};

const ManageProcedure = ({item}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const res = await emergencyAPI.getProcedures({
            type: item.id,
          });
          setData(res.data.payload);
        } catch (err) {
          console.log('getProceduresByTypeError: ', err.response.data.message);
        }
      })();
    }
  }, [isOpen]);
  return (
    <>
      <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.header}>
        <FastImage
          source={emergencyProcedureIcons[item.id]}
          style={styles.icon}
          defaultSource={emergencyProcedureIcons[item.id]}
        />
        <Text style={styles.headerText}>{item.name}</Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpen && (
        <>
          {data.map(procedure => (
            <Procedure key={procedure.id} procedure={procedure} />
          ))}
        </>
      )}
    </>
  );
};

export const ManageProcedures = () => {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.tableContainer}
      data={ProceduresData}
      renderItem={({item}) => <ManageProcedure item={item} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {paddingVertical: 10},
  tableContainer: {
    marginHorizontal: 15,
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 15,
    gap: 15,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },
  icon: {
    width: 25,
    height: 25,
  },
});

const procedureStyles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  title: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  text: {
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
});
