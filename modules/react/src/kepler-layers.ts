// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {createSelector} from 'reselect';
import type {Layer, MapViewState} from '@deck.gl/core';

/**
 * Kepler Layer Creation
 * Forked from kepler.gl
 * https://github.com/keplergl/kepler.gl/blob/master/src/components/map-container.js
 */
const layersSelector = (state: any) => state.visState.layers;
const layerDataSelector = (state: any) => state.visState.layerData;
const mapLayersSelector = (state: any) => state.visState.mapLayers;
// const layerOrderSelector = state => state.visState.layerOrder;
const layersToRenderSelector = createSelector(
  layersSelector,
  layerDataSelector,
  mapLayersSelector,
  // {[id]: true \ false}
  (layers, layerData, mapLayers) =>
    layers.reduce(
      (accu: object, layer: any, idx: number) => ({
        ...accu,
        [layer.id]: layer.shouldRenderLayer(layerData[idx]) && _isVisibleMapLayer(layer, mapLayers) // eslint-disable-line
      }),
      {}
    )
);
/* component private functions */
function _isVisibleMapLayer(layer: any, mapLayers: any) {
  // if layer.id is not in mapLayers, don't render it
  return !mapLayers || (mapLayers && mapLayers[layer.id]);
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
  map: any,
  viewState: MapViewState,
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

  // Layer is Layer class
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
        beforeId
      })
    );
  return overlays.concat(layerOverlay || []);
}

export function createKeplerLayers(map: any, viewState: MapViewState, beforeId?: string) {
  const layersToRender = layersToRenderSelector(map);
  // returns an arr of DeckGL layer objects
  const {layerOrder, layerData, layers} = map.visState;
  if (layerData && layerData.length) {
    return layerOrder
      .slice()
      .reverse()
      .filter(
        (_, idx: number) => layers[idx].overlayType === 'deckgl' && layersToRender[layers[idx].id]
      )
      .reduce(
        (overlays: any, _, idx: number) => renderLayer(overlays, idx, map, viewState, beforeId),
        []
      ); // Slicing & reversing to create same layer order as Kepler
  }
  return [];
}
