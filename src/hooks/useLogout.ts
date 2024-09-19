import {setIsLoggedIn} from '../bll/reducers/app-reducer';
import {useAppDispatch} from './hooks';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  dispatch(setIsLoggedIn(false));
};
