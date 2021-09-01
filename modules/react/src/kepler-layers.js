import {createSelector} from 'reselect';

/**
 * Kepler Layer Creation
 * Forked from kepler.gl
 * https://github.com/keplergl/kepler.gl/blob/master/src/components/map-container.js
 */
const layersSelector = state => state.visState.layers;
const layerDataSelector = state => state.visState.layerData;
const mapLayersSelector = state => state.visState.mapLayers;
// const layerOrderSelector = state => state.visState.layerOrder;
const layersToRenderSelector = createSelector(
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

function renderLayer(overlays, idx, map, viewState) {
  const {
    visState: {datasets, layers, layerData, hoverInfo, clicked, interactionConfig, animationConfig},
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
    .map(deckLayer => deckLayer.clone({pickable: false}));
  return overlays.concat(layerOverlay || []);
}

export function createKeplerLayers(map, viewState) {
  const layersToRender = layersToRenderSelector(map);
  // returns an arr of DeckGL layer objects
  const {layerOrder, layerData, layers} = map.visState;
  if (layerData && layerData.length) {
    return layerOrder
      .slice()
      .reverse()
      .filter(idx => layers[idx].overlayType === 'deckgl' && layersToRender[layers[idx].id])
      .reduce((overlays, idx) => renderLayer(overlays, idx, map, viewState), []); // Slicing & reversing to create same layer order as Kepler
  }
  return [];
}
