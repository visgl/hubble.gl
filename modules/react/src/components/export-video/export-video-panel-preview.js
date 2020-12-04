// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';

export class ExportVideoPanelPreview extends Component {
  constructor(props) {
    super(props);
    const user = this.props.mapData.mapStyle.bottomMapStyle.owner;
    const mapId = this.props.mapData.mapStyle.bottomMapStyle.id;

    this.mapRef = React.createRef();
    this.deckRef = React.createRef();

    this.state = {
      timestamp: {
        latitude: 47.65,
        longitude: 7
      },
      mapStyle: `mapbox://styles/${user}/${mapId}`, // Unsure if mapStyle would ever change but allowing it just in case
      glContext: undefined
    };

    this._onLayerSetDomain = this._onLayerSetDomain.bind(this);
    this._renderLayer = this._renderLayer.bind(this);
    this.onMapLoad = this.onMapLoad.bind(this);
  }

  _onLayerSetDomain(idx, colorDomain) {
    // TODO: this isn't dispatched to the redux store yet.
    // layerConfigChange(this.props.mapData.visState.layers[idx], {
    //   colorDomain
    // });
  }

  _renderLayer(overlays, idx) {
    const datasets = this.props.mapData.visState.datasets;
    const layers = this.props.mapData.visState.layers;
    const layerData = this.props.mapData.visState.layerData;
    const hoverInfo = this.props.mapData.visState.hoverInfo;
    const clicked = this.props.mapData.visState.clicked;
    const mapState = this.props.mapData.mapState;
    const interactionConfig = this.props.mapData.visState.interactionConfig;
    const animationConfig = this.props.mapData.visState.animationConfig;

    const layer = layers[idx];
    const data = layerData[idx];
    const {gpuFilter} = datasets[layer.config.dataId] || {};

    const objectHovered = clicked || hoverInfo;
    const layerCallbacks = {
      onSetLayerDomain: val => this._onLayerSetDomain(idx, val)
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
  }

  onMapLoad() {
    // Adds mapbox layer to modal
    const map = this.mapRef.current.getMap();
    const deck = this.deckRef.current.deck;
    map.addLayer(new MapboxLayer({id: 'my-deck', deck}));
    // TODO trying to make map scale to 100% of modal
    // map.on('load', function () {
    //   map.resize();
    // });
    map.on('render', () => this.props.adapter.onAfterRender(() => {this.forceUpdate()}));
    map.resize();
    // map.setCenter([this.props.mapData.mapState.longitude, this.props.mapData.mapState.latitude]);
    // console.log("this.props.mapData.mapState", this.props.mapData.mapState)
  }

  render() {
    // const mapStyle = this.mapData.mapStyle;
    // const mapState = this.props.mapData.mapState;
    // const layers = this.mapData.visState.layers;
    // const layerData = this.mapData.visState.layerData;
    const layerOrder = this.props.mapData.visState.layerOrder;
    // const animationConfig = this.mapData.visState.animationConfig;

    // Map data
    // const mapboxApiAccessToken = this.props.mapData.mapStyle.mapboxApiAccessToken;
    // const mapboxApiUrl = this.props.mapData.mapStyle.mapboxApiUrl;

    // define trip and geojson layers
    let deckGlLayers = [];

    // TODO refactor this. Layers are reverse, filtered, etc. only to be redefined later
    // wait until data is ready before render data layers
    if (layerOrder && layerOrder.length) {
      // last layer render first
      deckGlLayers = layerOrder
        .slice()
        .reverse()
        // .filter(
        //   idx => layers[idx].overlayType === OVERLAY_TYPE.deckgl && layers[idx].id
        // )
        .reduce(this._renderLayer, []);
    }

    const style = {
      position: 'relative',
      width: this.props.resolution[0],
      height: this.props.resolution[1],
      objectFit: 'fill'
    };

    return (
      <div
        id="deck-canvas"
        style={{width: '480px', height: '460px', position: 'relative', overflow: 'auto'}}
      >
        <DeckGL
          ref={this.deckRef}
          viewState={this.props.viewState}
          id="default-deckgl-overlay2"
          layers={deckGlLayers}
          // style={style}
          controller={true}
          glOptions={{stencil: true}}
          onWebGLInitialized={gl => this.setState({glContext: gl})}
          onViewStateChange={this.props.setViewState}
          /* onBeforeRender={this._onBeforeRender} // Not yet
                      onHover={visStateActions.onLayerHover} // Not yet
                      onClick={visStateActions.onLayerClick}*/

          {...this.props.adapter.getProps(this.deckRef, () => {})}
        >
          {this.state.glContext && (
            <StaticMap
              ref={this.mapRef}
              // reuseMaps // Part of default example but causes modal to lose Mapbox tile layer?
              mapStyle={this.state.mapStyle}
              preventStyleDiffing={true}
              gl={this.state.glContext}
              onLoad={this.onMapLoad}
            />
          )}
        </DeckGL>
      </div>
    );
  }
}
