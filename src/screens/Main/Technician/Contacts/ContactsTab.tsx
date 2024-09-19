import {createStackNavigator} from '@react-navigation/stack';
import {ArrowBackIcon} from '../../../../assets/icons/ArrowBackIcon';
import {Contacts} from './Contacts';
import {ContactInfo} from './ContactInfo';
import {HeaderButtons} from '../../../../components/HeaderButtons';
import {colors} from '../../../../styles/colors';
import {ContactsParamList} from '../../../../types/NavTypes/TechnicianNavTypes';

const ContactsStack = createStackNavigator<ContactsParamList>();

export const ContactsTab = () => {
  return (
    <ContactsStack.Navigator
      initialRouteName="Contacts"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundMainColor,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}>
      <ContactsStack.Screen
        name="Contacts"
        component={Contacts}
        options={{
          headerStyle: {
            backgroundColor: colors.headerColor,
          },
          headerTitleStyle: {
            color: colors.bottomActiveTextColor,
          },
          title: 'Contacts',
          headerLeft: () => null,
          headerRight: () => (
            <HeaderButtons fill={colors.bottomActiveTextColor} />
          ),
        }}
      />
      <ContactsStack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          title: 'Contact',
          headerBackTitleVisible: false,
          headerBackImage: () => <ArrowBackIcon />,
        }}
      />
    </ContactsStack.Navigator>
  );
};
