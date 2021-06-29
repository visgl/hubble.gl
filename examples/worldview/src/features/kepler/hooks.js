import {useEffect, useCallback, useMemo} from 'react';
import {
  registerEntry,
  setFilter,
  layerVisConfigChange,
  setLayerAnimationTime
  // updateMap
} from 'kepler.gl/actions';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';

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

export const useKepler = ({mapId, fetchMap, filterKeyframes, layerKeyframes, tripKeyframe}) => {
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
