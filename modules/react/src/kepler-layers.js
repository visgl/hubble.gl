import {createSelector} from 'reselect';
import {renderDeckGlLayer, prepareLayersToRender} from 'kepler.gl/dist/utils/layer-utils';

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
  prepareLayersToRender
);

function _onLayerSetDomain(idx, colorDomain) {
  // TODO: this isn't dispatched to the redux store yet.
  // layerConfigChange(this.props.mapData.visState.layers[idx], {
  //   colorDomain
  // });
}

export function createKeplerLayers(map, viewState) {
  const layersToRender = layersToRenderSelector(map);

  const {
    visState: {
      datasets,
      layers,
      layerData,
      hoverInfo,
      clicked,
      interactionConfig,
      animationConfig,
      layerOrder
    },
    mapState
  } = map;

  const props = {
    datasets,
    layers,
    layerData,
    hoverInfo,
    clicked,
    mapState: {...mapState, ...viewState},
    interactionConfig,
    animationConfig
  };

  // returns an arr of DeckGL layer objects
  if (layerData && layerData.length) {
    return layerOrder
      .slice()
      .reverse()
      .filter(idx => layersToRender[layers[idx].id])
      .reduce((overlays, idx) => {
        const layerCallbacks = {
          onSetLayerDomain: val => _onLayerSetDomain(idx, val)
        };
        const layerOverlay = renderDeckGlLayer(props, layerCallbacks, idx);
        return overlays.concat(layerOverlay || []);
      }, []);
  }
  return [];
}
