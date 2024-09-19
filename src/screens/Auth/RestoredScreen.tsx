import {useAppNavigation} from '../../hooks/hooks';
import {AuthLayout} from './AuthLayout';

export const RestoredScreen = () => {
  const navigation = useAppNavigation();

  const goLogin = () =>
    navigation.navigate('Auth', {
      screen: 'Login',
    });

  return (
    <AuthLayout
      subTitle="Your password was successfully restored"
      buttonText="Back to Sign In"
      onChange={goLogin}
    />
  );
};
