import {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {MyContacts} from './MyContacts';
import {colors} from '../../../../styles/colors';
import {UserRole} from '../../../../enums/user';
import {UserRoleType} from '../../../../types/StateType';

export const Contacts = () => {
  const [mode, setMode] = useState<UserRoleType>(UserRole.REQUESTOR);

  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={styles.row}>
        <Pressable
          onPress={() => setMode(UserRole.REQUESTOR)}
          style={
            mode === UserRole.REQUESTOR
              ? styles.navActiveButton
              : styles.navButton
          }>
          <Text
            style={
              mode === UserRole.REQUESTOR
                ? styles.navActiveButtonText
                : styles.navButtonText
            }>
            Requestors
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode(UserRole.SUPERVISOR)}
          style={
            mode === UserRole.SUPERVISOR
              ? styles.navActiveButton
              : styles.navButton
          }>
          <Text
            style={
              mode === UserRole.SUPERVISOR
                ? styles.navActiveButtonText
                : styles.navButtonText
            }>
            Supervisors
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode(UserRole.TECHNICIAN)}
          style={
            mode === UserRole.TECHNICIAN
              ? styles.navActiveButton
              : styles.navButton
          }>
          <Text
            style={
              mode === UserRole.TECHNICIAN
                ? styles.navActiveButtonText
                : styles.navButtonText
            }>
            Technicians
          </Text>
        </Pressable>
      </ScrollView>
      <MyContacts mode={mode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    maxHeight: 40,
    flexDirection: 'row',
    gap: 15,
    backgroundColor: colors.headerColor,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  gap: {gap: 15},
  navButton: {
    minWidth: 100,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  navButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    opacity: 0.5,
  },
  navActiveButton: {
    minWidth: 100,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderColor: colors.bottomActiveTextColor,
  },
  navActiveButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
});
