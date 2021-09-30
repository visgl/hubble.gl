import {useEffect, useMemo} from 'react';
import {
  registerEntry,
  setFilter,
  layerVisConfigChange,
  setLayerAnimationTime
  // updateMap
} from 'kepler.gl/actions';
import {useDispatch, useSelector} from 'react-redux';

import {AUTH_TOKENS} from '../../constants';
import {updateViewState} from '../map';
import {
  createSelectKeplerAnimationConfig,
  createSelectKeplerFilters,
  createSelectKeplerLayers,
  createSelectKeplerMap
} from './keplerSlice';
import {attachAnimation} from '../renderer/rendererSlice';
import {KeplerAnimation} from '@hubble.gl/core';
import {createKeplerLayers} from '@hubble.gl/react';
import {viewStateSelector} from '../map/mapSlice';

export const useKepler = ({
  mapId,
  fetchMap,
  filterKeyframes,
  layerKeyframes,
  tripKeyframe,
  cameraKeyframe
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch((_, getState) => {
      dispatch(
        registerEntry({
          id: mapId,
          mint: true,
          mapboxApiAccessToken: AUTH_TOKENS.MAPBOX_TOKEN
          // mapboxApiUrl,
          // mapStylesReplaceDefault,
          // initialUiState
        })
      );

      const setupAnimation = () => {
        const selectKeplerLayers = createSelectKeplerLayers(mapId);
        const selectKeplerFilters = createSelectKeplerFilters(mapId);
        const selectKeplerAnimationConfig = createSelectKeplerAnimationConfig(mapId);
        const state = getState();
        const layers = selectKeplerLayers(state);
        const filters = selectKeplerFilters(state);
        const animationConfig = selectKeplerAnimationConfig(state);

        const animation = new KeplerAnimation({
          mapId,
          layers,
          layerKeyframes,
          filters,
          filterKeyframes,
          animationConfig,
          tripKeyframe,
          cameraKeyframe,
          onTripFrameUpdate: time => dispatch(setLayerAnimationTime(time)),
          onFilterFrameUpdate: (idx, prop, value) => dispatch(setFilter(idx, prop, value)),
          onLayerFrameUpdate: (layer, visConfig) =>
            dispatch(layerVisConfigChange(layer, visConfig)),
          // onCameraFrameUpdate: cameraFrame => dispatch(updateMap(cameraFrame))
          onCameraFrameUpdate: cameraFrame => dispatch(updateViewState(cameraFrame))
        });

        dispatch(attachAnimation(animation));
      };

      fetchMap().then(() => setupAnimation());
    });
  }, []);
};

export const useKeplerMapState = mapId => {
  const dispatch = useDispatch();
  const selectKeplerMap = useMemo(() => createSelectKeplerMap(mapId), [mapId]);
  const map = useSelector(selectKeplerMap);
  useEffect(() => {
    if (map && map.mapState) {
      const {
        mapState: {latitude, longitude, zoom, bearing, pitch, altitude}
      } = map;
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
  }, [Boolean(map)]);
};

export const useKeplerDeckLayers = mapId => {
  const selectKeplerMap = useMemo(() => createSelectKeplerMap(mapId), [mapId]);
  const map = useSelector(selectKeplerMap);
  const viewState = useSelector(viewStateSelector);
  return useMemo(() => {
    if (!map) return [];
    return createKeplerLayers(map, viewState);
  }, [map && map.mapState, map && map.visState, viewState]);
};
