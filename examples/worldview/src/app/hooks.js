import {useEffect} from 'react';
import {useSelector} from 'react-redux';
export const useAfterKepler = onRegistered => {
  const registered = useSelector(state => state.app.keplerRegistered);
  useEffect(() => {
    if (registered) onRegistered();
  }, [registered]);
};
