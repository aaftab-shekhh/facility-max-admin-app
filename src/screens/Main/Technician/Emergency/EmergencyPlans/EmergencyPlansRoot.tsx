import {StyleSheet, View} from 'react-native';
import {EmergencyPlans} from './EmergencyPlans';
import React, {useState} from 'react';
import {EmergencyContacts} from './EmergencyContacts';
import {ManageProcedures} from './ManageProcedures';
import {IncidentHistory} from './IncidentHistory';
import {HeaderTabNavigation} from '../../../../../components/HeaderTabNavigation';
import {FocusAwareStatusBar} from '../../../../../components/FocusAwareStatusBar';

// type ItemType = {
//   label: string;
//   value: string;
// };

// const data: ItemType[] = [
//   {label: 'Item 1', value: '1'},
//   {label: 'Item 2', value: '2'},
//   {label: 'Item 3', value: '3'},
//   {label: 'Item 4', value: '4'},
//   {label: 'Item 5', value: '5'},
//   {label: 'Item 6', value: '6'},
//   {label: 'Item 7', value: '7'},
//   {label: 'Item 8', value: '8'},
// ];

export const EmergancyPlansRoot = ({route}: any) => {
  const {tab} = route.params;
  const [mode, setMode] = useState(tab || 'emergencyPlans');
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [emergencyScenario, setEmergencyScenario] = useState<null | string>(
  //   null,
  // );
  // const [procedureTypes, setProcedureTypes] = useState<null | string>(null);
  // const [assetCategories, setAssetCategories] = useState<null | string>(null);

  // const renderItem = (item: ItemType) => {
  //   return (
  //     <View style={styles.item}>
  //       <Text style={styles.textItem}>{item.label}</Text>
  //     </View>
  //   );
  // };

  // const toggleModal = () => {
  //   setIsModalVisible(!isModalVisible);
  // };

  const renderMode = () => {
    switch (mode) {
      case 'emergencyPlans':
        return <EmergencyPlans />;
      case 'emergencyContacts':
        return <EmergencyContacts />;
      case 'manageProcedures':
        return <ManageProcedures />;
      case 'incidentHistory':
        return <IncidentHistory />;
    }
  };

  const nav = [
    {id: 1, mode: 'emergencyPlans', label: 'Emergency Plans'},
    {id: 2, mode: 'emergencyContacts', label: 'Emergency Contacts'},
    {id: 3, mode: 'manageProcedures', label: 'Manage Procedures'},
    {id: 4, mode: 'incidentHistory', label: 'Incident History'},
  ];

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" />

      <HeaderTabNavigation data={nav} mode={mode} onChange={setMode} />
      {/* <View style={styles.search}>
        <View style={styles.inputItem}>
          <SearchIcon />
          <TextInput placeholder="Enter plan name" style={styles.input} />
        </View>
        <Pressable style={styles.filter} onPress={toggleModal}>
          <FilterIcon />
        </Pressable>
      </View> */}
      {renderMode()}
      {/* <ModalLayout
        title="Filter"
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}>
        <View>
          <ScrollView>
            <DropdownWithSearch
              label="Emergency Scenario"
              startValue={emergencyScenario}
              data={[
                {id: '1', name: 'Item 1'},
                {id: '2', name: 'Item 2'},
              ]}
              onChange={setEmergencyScenario}
              border
            />
            <DropdownWithSearch
              label="Procedure Types"
              startValue={procedureTypes}
              data={[{id: '1', name: 'Item 1'}]}
              onChange={setProcedureTypes}
              border
            />
            <DropdownWithSearch
              label="Asset Categories"
              startValue={assetCategories}
              data={[{id: '1', name: 'Item 1'}]}
              onChange={setAssetCategories}
              border
            />
          </ScrollView>
          <View style={[stylesModal.modalButtons, styles.modalButtons]}>
            <Pressable
              onPress={toggleModal}
              style={[stylesModal.modalButton, stylesModal.modalButtonReset]}>
              <Text
                style={[
                  stylesModal.modalButtonText,
                  stylesModal.modalButtonTextReset,
                ]}>
                Reset All
              </Text>
            </Pressable>
            <Pressable onPress={toggleModal} style={stylesModal.modalButton}>
              <Text style={stylesModal.modalButtonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </ModalLayout> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // row: {
  //   maxHeight: 40,
  //   flexDirection: 'row',
  //   gap: 10,
  //   marginBottom: 10,
  // },
  // search: {
  //   flexDirection: 'row',
  //   gap: 8,
  //   marginHorizontal: 10,
  //   marginBottom: 10,
  // },
  // navButton: {
  //   minWidth: 100,
  //   paddingHorizontal: 10,
  //   height: 40,
  //   marginBottom: 10,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginHorizontal: 10,
  // },
  // navButtonText: {
  //   color: colors.textSecondColor,
  //   fontSize: 16,
  //   fontWeight: '500',
  //   lineHeight: 24,
  // },
  // navActiveButton: {
  //   minWidth: 100,
  //   paddingHorizontal: 10,
  //   height: 40,
  //   marginBottom: 10,
  //   backgroundColor: colors.mainActiveColor,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginHorizontal: 15,
  // },
  // navActiveButtonText: {
  //   color: colors.bottomActiveTextColor,
  //   fontSize: 16,
  //   fontWeight: '500',
  //   lineHeight: 24,
  // },
  // inputItem: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   backgroundColor: colors.backgroundLightColor,
  //   height: 42,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   paddingLeft: 10,
  // },
  // input: {
  //   flex: 1,
  //   paddingHorizontal: 10,
  //   color: colors.textColor,
  // },
  // filter: {
  //   width: 42,
  //   height: 42,
  //   backgroundColor: colors.backgroundLightColor,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  // dropdown: {
  //   marginVertical: 5,
  //   height: 45,
  //   backgroundColor: colors.backgroundLightColor,
  //   borderRadius: 8,
  //   paddingHorizontal: 12,
  //   paddingVertical: 8,
  // },
  // icon: {
  //   marginRight: 5,
  // },
  // item: {
  //   paddingHorizontal: 15,
  //   paddingVertical: 10,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // textItem: {
  //   flex: 1,
  //   fontSize: 14,
  //   fontWeight: '500',
  //   lineHeight: 21,
  //   color: colors.textColor,
  // },
  // placeholderStyle: {
  //   fontSize: 14,
  // },
  // selectedTextStyle: {
  //   fontSize: 14,
  //   fontWeight: '500',
  //   lineHeight: 21,
  //   color: colors.textColor,
  // },
  // iconStyle: {
  //   width: 25,
  //   height: 25,
  // },
  // inputSearchStyle: {
  //   height: 40,
  //   fontSize: 16,
  // },
  // modalButtons: {
  //   marginTop: 20,
  // },
});
