import {useEffect, useCallback, useMemo} from 'react';
import {registerEntry, setFilter, layerVisConfigChange} from 'kepler.gl/actions';
import {FilterValueKeyframes, Keyframes} from '@hubble.gl/core';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';

import {
  filterKeyframeSelector,
  layerKeyframeSelector,
  frameSelector
} from '../timeline/timelineSlice';
import {AUTH_TOKENS} from '../../constants';
import {updateViewState} from '../map';
import {createSelectKeplerMap} from './keplerSlice';

export const useKepler = mapId => {
  const dispatch = useDispatch();
  useEffect(() => {
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
      keyframes.kepler_timeFilter = new FilterValueKeyframes(filterKeyframe);
    }
    return keyframes;
  }, [filterKeyframe, layerKeyframe, keplerLayers]);

  return getKeplerKeyframes;
};

export const useKeplerFrame = (keplerLayers = []) => {
  const dispatch = useDispatch();
  const frame = useSelector(frameSelector);

  useEffect(() => {
    // Filter Frame
    if (frame.kepler_timeFilter) {
      // const frame = frame.kepler_timeFilter;
      dispatch(
        setFilter(0, 'value', [frame.kepler_timeFilter.left, frame.kepler_timeFilter.right])
      );
    }

    // Vis Config Frame
    keplerLayers.forEach(layer => {
      // TODO: Use layer ID instead of label.
      const keyframe = frame[`kepler_${layer.config.label}`];
      if (keyframe) {
        // console.log(layer)
        // const frame = keyframe.getFrame();
        // console.log(frame)
        dispatch(layerVisConfigChange(layer, keyframe));
      }
    });

    // Note: Map State is kept in sync using plugin.
  }, [frame]);
};

/**
 * Kepler Layer Creation
 * Forked from kepler.gl
 * https://github.com/keplergl/kepler.gl/blob/master/src/components/map-container.js
 */

const layersSelector = state => state.visState.layers;
const layerDataSelector = state => state.visState.layerData;
const mapLayersSelector = state => state.visState.mapLayers;
// const layerOrderSelector = state => state.visState.layerOrder;
export const layersToRenderSelector = createSelector(
  layersSelector,
  layerDataSelector,
  mapLayersSelector,
  // {[id]: true \ false}
  (layers, layerData, mapLayers) =>
    layers.reduce(
      (accu, layer, idx) => ({
        ...accu,
        [layer.id]: layer.shouldRenderLayer(layerData[idx]) && _isVisibleMapLayer(layer, mapLayers) // eslint-disable-line
      }),
      {}
    )
);
/* component private functions */
function _isVisibleMapLayer(layer, mapLayers) {
  // if layer.id is not in mapLayers, don't render it
  return !mapLayers || (mapLayers && mapLayers[layer.id]);
}
function _onLayerSetDomain(idx, colorDomain) {
  // TODO: this isn't dispatched to the redux store yet.
  // layerConfigChange(this.props.mapData.visState.layers[idx], {
  //   colorDomain
  // });
}

export const useKeplerDeckLayers = mapId => {
  const selectKeplerMap = useMemo(() => createSelectKeplerMap(mapId), [mapId]);
  const map = useSelector(selectKeplerMap);

  const renderLayer = useCallback(
    (overlays, idx) => {
      const {
        visState: {
          datasets,
          layers,
          layerData,
          hoverInfo,
          clicked,
          interactionConfig,
          animationConfig
        },
        mapState
      } = map;

      const layer = layers[idx];
      const data = layerData[idx];
      const {gpuFilter} = datasets[layer.config.dataId] || {};

      const objectHovered = clicked || hoverInfo;
      const layerCallbacks = {
        onSetLayerDomain: val => _onLayerSetDomain(idx, val)
      };

      // Layer is Layer class
      const layerOverlay = layer.renderLayer({
        data,
        gpuFilter,
        idx,
        interactionConfig,
        layerCallbacks,
        mapState,
        animationConfig,
        objectHovered
      });
      return overlays.concat(layerOverlay || []);
    },
    [map]
  );

  return useMemo(() => {
    if (!map) return [];
    const layersToRender = layersToRenderSelector(map);
    // returns an arr of DeckGL layer objects
    const {layerOrder, layerData, layers} = map.visState;
    if (layerData && layerData.length) {
      return layerOrder
        .slice()
        .reverse()
        .filter(idx => layers[idx].overlayType === 'deckgl' && layersToRender[layers[idx].id])
        .reduce(renderLayer, []); // Slicing & reversing to create same layer order as Kepler
    }
    return [];
  }, [map]);
};
