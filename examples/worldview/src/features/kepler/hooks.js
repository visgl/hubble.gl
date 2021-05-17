import {useEffect, useCallback} from 'react';
import {registerEntry, setFilter, layerVisConfigChange} from 'kepler.gl/actions';
import {FilterValueKeyframes, Keyframes} from '@hubble.gl/core';
import {useDispatch, useSelector} from 'react-redux';

import {filterKeyframeSelector, layerKeyframeSelector} from '../timeline/timelineSlice';
import {AUTH_TOKENS} from '../../constants';
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

export const useKeplerKeyframes = keplerLayers => {
  const filterKeyframe = useSelector(filterKeyframeSelector);
  const layerKeyframe = useSelector(layerKeyframeSelector);

  const getKeplerKeyframes = useCallback(() => {
    let keyframes = {};

    if (Object.keys(layerKeyframe).length > 0) {
      keyframes = Object.entries(layerKeyframe).reduce((acc, [key, value]) => {
        // TODO: Use layer ID instead of label.
        const matchedLayer = keplerLayers.find(layer => layer.config.label === value.label);
        if (matchedLayer) {
          const features = Object.keys(matchedLayer.config.visConfig);
          acc[key] = new Keyframes({...value, features});
        } else {
          throw new Error(`Error making kepler layer keyframe. Layer not found: '${value.label}'`);
        }
        return acc;
      }, keyframes);
    }
    // console.log(keyframes, keplerLayers);
    if (filterKeyframe) {
      // TODO: Support more than one filter.
      keyframes.hubble_timeFilter = new FilterValueKeyframes(filterKeyframe);
    }
    return keyframes;
  }, [filterKeyframe, layerKeyframe, keplerLayers]);

  return getKeplerKeyframes;
};

export const usePrepareKeplerFrame = keplerLayers => {
  const dispatch = useDispatch();

  const prepareFrame = useCallback(
    scene => {
      // console.log(scene)
      // console.log(scene.keyframes.timeFilter.getFrame())
      // Filter Frame
      if (scene.keyframes.hubble_timeFilter) {
        const frame = scene.keyframes.hubble_timeFilter.getFrame();
        dispatch(
          setFilter(scene.keyframes.hubble_timeFilter.filterId, 'value', [frame.left, frame.right])
        );
      }

      // Vis Config Frame
      keplerLayers.forEach(layer => {
        // TODO: Use layer ID instead of label.
        const keyframe = scene.keyframes[layer.config.label];
        if (keyframe) {
          // console.log(layer)
          const frame = keyframe.getFrame();
          // console.log(frame)
          dispatch(layerVisConfigChange(layer, frame));
        }
      });

      // Note: Map State is kept in sync using plugin.
    },
    [keplerLayers]
  );

  return prepareFrame;
};
