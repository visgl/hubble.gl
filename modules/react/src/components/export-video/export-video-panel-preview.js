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
      glContext: undefined,
      memoDevicePixelRatio: window.devicePixelRatio // memoize
    };

    this._onLayerSetDomain = this._onLayerSetDomain.bind(this);
    this._renderLayer = this._renderLayer.bind(this);
    this._onMapLoad = this._onMapLoad.bind(this);
    this._resizeVideo = this._resizeVideo.bind(this);
    this._getContainerHeight = this._getContainerHeight.bind(this);

    this._resizeVideo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resolution !== this.props.resolution) {
      this._resizeVideo();
    }
  }

  componentWillUnmount() {
    const {memoDevicePixelRatio} = this.state;
    this._setDevicePixelRatio(memoDevicePixelRatio);
  }

  _resizeVideo() {
    const {exportVideoWidth, resolution} = this.props;
    this._setDevicePixelRatio(resolution[0] / exportVideoWidth);
    if (this.mapRef.current) {
      const map = this.mapRef.current.getMap();
      map.resize();
    }
  }

  _setDevicePixelRatio(devicePixelRatio) {
    /**
     * TODO: This is the only way to trick mapbox into scaling its render buffer up
     * to match the desired resolution. It is built to always fit it's render buffer size
     * to it's CSS container size, which makes it impossible to make a small "preview" box.
     *
     * deck.gl has the useDevicePixels prop, which would have been used if it also changed mapbox.
     * https://github.com/visgl/luma.gl/pull/1155 for background.
     *
     * Compare implementations of luma.gl to mapbox for context:
     * https://github.com/visgl/luma.gl/blob/f622105e30c4dcda434f80ebc4680356003b12fa/modules/gltools/src/utils/device-pixels.js#L31
     * https://github.com/mapbox/mapbox-gl-js/blob/3136a53235cf17b732e84c9945c4e85ba3369a93/src/ui/map.js#L2324
     *
     * In luma the scaler can be overriden by useDevicePixels.
     *
     * The workaround is to change window.devicePixelRatio while the component is mounted to scale up the render buffers of deck and mapbox.
     * This is hacky and can cause issues in certain applications. We should try to produce a better solution.
     */
    // @ts-ignore
    window.devicePixelRatio = devicePixelRatio;
  }

  _onLayerSetDomain(idx, colorDomain) {
    // TODO: this isn't dispatched to the redux store yet.
    // layerConfigChange(this.props.mapData.visState.layers[idx], {
    //   colorDomain
    // });
  }

  _renderLayer(overlays, idx) {
    const {
      mapData: {visState, mapState}
    } = this.props;

    const {
      datasets,
      layers,
      layerData,
      hoverInfo,
      clicked,
      interactionConfig,
      animationConfig
    } = visState;

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

  _getContainerHeight() {
    const {exportVideoWidth, resolution} = this.props;
    const aspectRatio = resolution[0] / resolution[1];
    return exportVideoWidth / aspectRatio;
  }

  _onMapLoad() {
    // Adds mapbox layer to modal
    const map = this.mapRef.current.getMap();
    const deck = this.deckRef.current.deck;
    map.addLayer(new MapboxLayer({id: 'my-deck', deck}));
    // TODO trying to make map scale to 100% of modal
    // map.on('load', function () {
    //   map.resize();
    // });
    map.on('render', () =>
      this.props.adapter.onAfterRender(() => {
        this.forceUpdate();
      })
    );
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

    const deckStyle = {
      width: '100%',
      height: '100%'
    };

    const containerStyle = {
      width: `${this.props.exportVideoWidth}px`,
      height: `${this._getContainerHeight()}px`,
      position: 'relative',
      overflow: 'auto'
    };

    return (
      <div id="deck-canvas" style={containerStyle}>
        <DeckGL
          ref={this.deckRef}
          viewState={this.props.viewState}
          id="hubblegl-overlay"
          layers={deckGlLayers}
          style={deckStyle}
          controller={true}
          glOptions={{stencil: true}}
          onWebGLInitialized={gl => this.setState({glContext: gl})}
          onViewStateChange={this.props.setViewState}
          // onClick={visStateActions.onLayerClick}
          {...this.props.adapter.getProps(this.deckRef, () => {})}
        >
          {this.state.glContext && (
            <StaticMap
              ref={this.mapRef}
              // reuseMaps // Part of default example but causes modal to lose Mapbox tile layer?
              mapStyle={this.state.mapStyle}
              preventStyleDiffing={true}
              gl={this.state.glContext}
              onLoad={this._onMapLoad}
            />
          )}
        </DeckGL>
      </div>
    );
  }
}
