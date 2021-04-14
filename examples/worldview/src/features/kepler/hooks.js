import {useEffect} from 'react';
import {registerEntry} from 'kepler.gl/actions';
import {AUTH_TOKENS} from '../../constants';
import {useDispatch, useSelector} from 'react-redux';

import {updateViewState} from '../stage/mapSlice';

export const useKepler = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      registerEntry({
        id: 'map',
        mint: true,
        mapboxApiAccessToken: AUTH_TOKENS.MAPBOX_TOKEN
        // mapboxApiUrl,
        // mapStylesReplaceDefault,
        // initialUiState
      })
    );
  }, []);
};

export const useKeplerMapState = () => {
  const dispatch = useDispatch();
  const keplerMapState = useSelector(state => state.keplerGl.map && state.keplerGl.map.mapState);
  useEffect(() => {
    if (keplerMapState) {
      const {latitude, longitude, zoom, bearing, pitch, altitude} = keplerMapState;
      dispatch(
        updateViewState({
          latitude,
          longitude,
          zoom,
          bearing,
          pitch,
          altitude
        })
      );
    }
  }, [keplerMapState]);
};
