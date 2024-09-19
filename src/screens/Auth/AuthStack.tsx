import {createStackNavigator} from '@react-navigation/stack';
import {LoginScreen} from './LoginScreen';
import {ForgotScreen} from './ForgotScreen';
import {VerificationScreen} from './VerificationScreen';
import {RestoredScreen} from './RestoredScreen';
import {AuthParamList} from '../../types/NavTypes/NavigationTypes';
import {NewPasswordScreen} from './NewPasswordScreen';

const Auth = createStackNavigator<AuthParamList>();

export const AuthStack = ({navigation}: any) => {
  // const {isLoggedIn} = useAppSelector(state => state.app);
  // const {role} = useAppSelector(state => state.user.user);
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     navigation.navigate('Main', {screen: role});
  //   }
  // }, [role]);

  return (
    <Auth.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Auth.Screen name="Login" component={LoginScreen} />
      <Auth.Screen name="Forgot" component={ForgotScreen} />
      <Auth.Screen name="Password" component={NewPasswordScreen} />
      <Auth.Screen name="Verification" component={VerificationScreen} />
      <Auth.Screen name="Restored" component={RestoredScreen} />
    </Auth.Navigator>
  );
};
