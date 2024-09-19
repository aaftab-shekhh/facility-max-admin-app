import {useEffect, useState} from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {}, []);

  return location;
};
