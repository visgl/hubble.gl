// Copyright (c) 2021 Uber Technologies, Inc.
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
import {nearestEven} from '../../utils';
import isEqual from 'lodash.isequal';
import {DebugOverlay} from './DebugOverlay';

export class Map extends Component {
  constructor(props) {
    super(props);

    this.mapRef = React.createRef();
    this.deckRef = React.createRef();

    this.state = {
      glContext: undefined,
      memoDevicePixelRatio: window.devicePixelRatio // memoize
    };

    this._onMapLoad = this._onMapLoad.bind(this);
    this._resizeVideo = this._resizeVideo.bind(this);

    this._resizeVideo();
  }

  componentDidUpdate(prevProps) {
    const {resolution, previewSize} = this.props;
    if (
      !isEqual(prevProps.resolution, resolution) ||
      !isEqual(prevProps.previewSize, previewSize)
    ) {
      this._resizeVideo();
    }
  }

  componentWillUnmount() {
    const {memoDevicePixelRatio} = this.state;
    this._setDevicePixelRatio(memoDevicePixelRatio);
  }

  _resizeVideo() {
    const {previewSize, resolution} = this.props;
    this._setDevicePixelRatio(nearestEven(resolution.width / previewSize.width, 9));
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

  _onMapLoad() {
    const {
      adapter,
      deckProps: {layers},
      updateTimeCursor
    } = this.props;
    // Adds mapbox layer to modal
    const map = this.mapRef.current.getMap();
    const deck = this.deckRef.current.deck;

    // var mapboxLayers = map.getStyle().layers;
    // console.log(mapboxLayers)

    // If there aren't any layers, combine map and deck with a fake layer.
    if (!layers.length) {
      map.addLayer(new MapboxLayer({id: '%%blank-layer', deck}));
    }

    for (let i = 0; i < layers.length; i++) {
      // TODO: layer mapbox and deck layers in order according to kepler config.
      // map.addLayer(new MapboxLayer({id: layers[i].id, deck}), "tunnel-simple");

      // Adds DeckGL layers to Mapbox so Mapbox can be the bottom layer. Removing this clips DeckGL layers
      map.addLayer(new MapboxLayer({id: layers[i].id, deck}));
    }

    map.on('render', () =>
      adapter.onAfterRender(timeMs => {
        updateTimeCursor(timeMs);
      })
    );
  }

  render() {
    const {
      adapter,
      viewState,
      previewSize,
      setViewState,
      deckProps,
      staticMapProps,
      resolution,
      debug
    } = this.props;
    const {glContext} = this.state;
    const deck = this.deckRef.current && this.deckRef.current.deck;

    const deckStyle = {
      width: '100%',
      height: '100%'
    };

    const containerStyle = {
      width: `${previewSize.width}px`,
      height: `${previewSize.height}px`,
      position: 'relative'
    };

    return (
      <div id="deck-canvas" style={containerStyle}>
        <DeckGL
          ref={this.deckRef}
          viewState={{...viewState, maxPitch: 90}}
          id="hubblegl-overlay"
          style={deckStyle}
          controller={true}
          glOptions={{stencil: true}}
          onWebGLInitialized={gl => this.setState({glContext: gl})}
          onViewStateChange={({viewState: vs}) => setViewState(vs)}
          width={resolution.width}
          height={resolution.height}
          {...adapter.getProps({deck, extraProps: deckProps})}
        >
          {glContext && (
            <StaticMap
              ref={this.mapRef}
              preventStyleDiffing={true}
              gl={glContext}
              onLoad={this._onMapLoad}
              {...staticMapProps}
            />
          )}
        </DeckGL>
        {debug && (
          <DebugOverlay
            deckRef={this.deckRef}
            containerRef={this.containerRef}
            resolution={resolution}
            previewSize={previewSize}
          />
        )}
      </div>
    );
  }
}
