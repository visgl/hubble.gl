import {useEffect} from 'react';
import {useSelector} from 'react-redux';
export const useWhenReady = onReady => {
  const ready = useSelector(state => state.hubbleGl.map.ready);
  useEffect(() => {
    if (ready) onReady();
  }, [ready]);
};
