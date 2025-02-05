// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {createSelector} from 'reselect';
import type {Layer, MapViewState} from '@deck.gl/core/typed';
// Note: kepler type imports are commented out to avoid issues when hubble is installed by kepler.
// import type {KeplerGlState} from '@kepler.gl/reducers';
// import type {Layer as KeplerLayer} from '@kepler.gl/layers';
// import type {SplitMap, SplitMapLayers} from '@kepler.gl/types';

/**
 * Kepler Layer Creation
 * Forked from kepler.gl
 * https://github.com/keplergl/kepler.gl/blob/master/src/components/map-container.js
 */
const layersSelector = (state: any /* KeplerGlState*/) => state.visState.layers;
const layerDataSelector = (state: any /* KeplerGlState*/) => state.visState.layerData;
const getMapLayersFromSplitMaps = (
  splitMaps: any /* SplitMap[]*/,
  mapIndex?: number
): any[] /* SplitMapLayers*/ | undefined | null => {
  return splitMaps[mapIndex || 0]?.layers;
};

const splitMapSelector = (state: any /* KeplerGlState*/) => state.visState.splitMaps;
const splitMapIndexSelector = (_: any /* KeplerGlState*/, mapIndex: number | undefined) => mapIndex;
const mapLayersSelector = createSelector(
  splitMapSelector,
  splitMapIndexSelector,
  getMapLayersFromSplitMaps
);
// const layerOrderSelector = state => state.visState.layerOrder;
const layersToRenderSelector = createSelector(
  layersSelector,
  layerDataSelector,
  mapLayersSelector,
  // {[id]: true \ false}
  (layers, layerData, splitMapLayers) =>
    layers.reduce(
      (accu: object, layer: any /* KeplerLayer*/, idx: number) => ({
        ...accu,
        [layer.id]:
          layer.config.isVisible &&
          layer.shouldRenderLayer(layerData[idx]) &&
          _isVisibleSplitMapLayer(layer, splitMapLayers) &&
          layer.overlayType === 'deckgl'
      }),
      {}
    )
);

function _isVisibleSplitMapLayer(
  layer: any /* KeplerLayer*/,
  splitMapLayers?: any[] /* SplitMapLayers*/
) {
  // Undefined splitMapLayers means there isn't a split map, so don't refer to it for layer visibility.
  // If splitMapLayers is defined, it means there is a split map and the upstream caller has selected the map to render in video.
  return !splitMapLayers || (splitMapLayers && splitMapLayers[layer.id]);
}

function _onLayerSetDomain(idx: number, colorDomain: any) {
  // TODO: this isn't dispatched to the redux store yet.
  // layerConfigChange(this.props.mapData.visState.layers[idx], {
  //   colorDomain
  // });
}

function renderLayer(
  overlays: any,
  idx: number,
  map: any /* KeplerGlState*/,
  viewState: MapViewState,
  isVisible: boolean,
  beforeId?: string
) {
  const {
    visState: {datasets, layers, layerData, hoverInfo, clicked, interactionConfig, animationConfig},
    mapState
  } = map;

  const layer = layers[idx];
  const data = layerData[idx];
  const {gpuFilter} = datasets[layer.config.dataId] || {};

  const objectHovered = clicked || hoverInfo;
  const layerCallbacks = {
    onSetLayerDomain: (val: any) => _onLayerSetDomain(idx, val)
  };

  // Skip layers that aren't supposed to be visible
  if (!isVisible) {
    return overlays;
  }

  const layerOverlay = layer
    .renderLayer({
      data,
      gpuFilter,
      idx,
      interactionConfig,
      layerCallbacks,
      mapState: {...mapState, ...viewState},
      animationConfig,
      objectHovered
    })
    .map((deckLayer: Layer) =>
      deckLayer.clone({
        pickable: false,
        // @ts-expect-error MapboxOverlay layers are extended to include beforeId
        beforeId,
        visible: true
      })
    );
  return overlays.concat(layerOverlay || []);
}

export function createKeplerLayers(
  map: any /* KeplerGlState*/,
  viewState: MapViewState,
  mapIndex: number = undefined,
  beforeId?: string
) {
  const layersToRender = layersToRenderSelector(map, mapIndex);
  // returns an arr of DeckGL layer objects
  const {layerOrder, layerData, layers} = map.visState;

  if (layerData && layerData.length) {
    // Create same layer order as Kepler
    const overlays = [...layerOrder]
      .map(layerId => ({layerId, visible: layersToRender[layerId]}))
      .reduce(
        (overlays: any, layerMeta, idx) =>
          renderLayer(overlays, idx, map, viewState, layerMeta.visible, beforeId),
        []
      );
    return overlays;
  }
  return [];
}
