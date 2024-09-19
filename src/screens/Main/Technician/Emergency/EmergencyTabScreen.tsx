import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {EmergencyReportIcon} from '../../../../assets/icons/EmergencyReportIcon';
import {EmergencyViewIcon} from '../../../../assets/icons/EmergencyViewIcon';
import {colors} from '../../../../styles/colors';
import {useAppNavigation} from '../../../../hooks/hooks';
import React from 'react';
import {UserRole} from '../../../../enums/user';
import {EmergencyContactIcon} from '../../../../assets/icons/EmergencyContactIcon';

export const EmergencyTabScreen = () => {
  const navigation = useAppNavigation();
  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        // showHideTransition={statusBarTransition}
        // hidden={true}
      />
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: 'EmergencyTab',
                params: {
                  screen: 'EmergencyReport',
                  params: {screen: 'EmergencyReportStep1'},
                },
              },
            });
          }}
          style={[styles.button]}>
          <EmergencyReportIcon />
          <Text style={styles.buttonText}>Report an Emergency</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: 'EmergencyTab',
                params: {
                  screen: 'EmergencyPlans',
                  params: {},
                },
              },
            });
          }}
          style={[styles.button]}>
          <EmergencyViewIcon />
          <Text style={styles.buttonText}>View Emergency Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Main', {
              screen: UserRole.TECHNICIAN,
              params: {
                screen: 'EmergencyTab',
                params: {
                  screen: 'EmergencyPlans',
                  params: {tab: 'emergencyContacts'},
                },
              },
            });
          }}
          style={[styles.button]}>
          <EmergencyContactIcon />
          <Text style={styles.buttonText}>View Emergency Contact</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => {
          navigation.navigate('Main', {
            screen: UserRole.TECHNICIAN,
            params: {
              screen: 'EmergencyTab',
              params: {
                screen: 'CreateEmergency',
                params: {screen: 'CreateEmergencyStep1'},
              },
            },
          });
        }}>
        <Text style={styles.createButtonText}>+ Create New Emergency Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  buttons: {
    maxWidth: 500,
    width: '90%',
    gap: 10,
    marginVertical: 30,
  },

  button: {
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginHorizontal: 15,
    gap: 15,
    borderColor: colors.textSecondColor,
    backgroundColor: colors.backgroundLightColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  buttonActive: {
    borderWidth: 1,
    marginHorizontal: 0,
    backgroundColor: '#1b6bc02a',
    borderRadius: 12,
    borderStyle: 'solid',
    borderColor: colors.mainActiveColor,
  },

  buttonText: {
    textAlign: 'center',
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
  },

  createButton: {
    borderRadius: 10,
    backgroundColor: colors.deleteColor,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  createButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
});
