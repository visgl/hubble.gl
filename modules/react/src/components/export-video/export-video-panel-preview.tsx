// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
/* global window */

import React, {Component, ForwardedRef, RefObject, forwardRef} from 'react';
import DeckGL from '@deck.gl/react';
import ReactMapGL, {type MapProps, type MapRef, useControl} from 'react-map-gl';
import {MapboxOverlay, MapboxOverlayProps} from '@deck.gl/mapbox';
import type {Deck, DeckProps, Layer, MapViewState} from '@deck.gl/core';
import isEqual from 'lodash.isequal';

import {DeckCanvas} from './styled-components';
import {RenderingSpinner} from './rendering-spinner';
import {createKeplerLayers} from '../../kepler-layers';
import {DeckAdapter} from '@hubble.gl/core';
import {setRef} from './set-ref';

export type ExportVideoPanelPreviewProps = {
  mapData: any;
  resolution: [number, number];
  exportVideoWidth: number;
  disableBaseMap: boolean;
  deckProps?: DeckProps;
  viewState: MapViewState;
  adapter: DeckAdapter;
  mapboxLayerBeforeId?: string;
  rendering: boolean;
  saving: boolean;
  setViewState: (viewState: MapViewState) => void;
  durationMs: number;
  mapProps?: MapProps;
};

type ExportVideoPanelPreviewState = {
  memoDevicePixelRatio: number;
  mapStyle: string;
  mapboxAccessToken?: string;
  deckLayers: Layer[];
};

const DeckGLOverlay = forwardRef<Deck, MapboxOverlayProps>(
  (props: MapboxOverlayProps, ref: ForwardedRef<Deck>) => {
    // MapboxOverlay handles a variety of props differently than the Deck class.
    // https://deck.gl/docs/api-reference/mapbox/mapbox-overlay#constructor
    const deck = useControl<MapboxOverlay>(() => new MapboxOverlay({...props, interleaved: true}));

    deck.setProps(props);

    // @ts-expect-error private property
    setRef(ref, deck._deck);
    return null;
  }
);
DeckGLOverlay.displayName = 'DeckGLOverlay';

export class ExportVideoPanelPreview extends Component<
  ExportVideoPanelPreviewProps,
  ExportVideoPanelPreviewState
> {
  constructor(props: ExportVideoPanelPreviewProps) {
    super(props);
    const mapStyle = this.props.mapData.mapStyle;
    const {url, accessToken} = mapStyle.mapStyles[mapStyle.styleType];

    this.mapRef = React.createRef<MapRef>();
    this.deckRef = React.createRef<Deck>();

    this.state = {
      mapStyle: url, // Unsure if mapStyle would ever change but allowing it just in case
      mapboxAccessToken: accessToken,
      memoDevicePixelRatio: 1,
      deckLayers: []
    };

    this._onMapLoad = this._onMapLoad.bind(this);
    this._resizeVideo = this._resizeVideo.bind(this);
    this._onAfterRender = this._onAfterRender.bind(this);

    this._resizeVideo();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.resolution, this.props.resolution)) {
      this._resizeVideo();
    }
  }

  componentWillUnmount() {
    if (this.mapRef.current) {
      const map = this.mapRef.current.getMap();

      // remove all rendering related handlers to prevent rendering after unmount
      // @ts-ignore _listeners is private
      const listeners = [...map._listeners.render];
      listeners.forEach(listener => {
        map.off('render', listener);
      });
    }
  }

  mapRef: RefObject<MapRef>;
  deckRef: RefObject<Deck>;

  _resizeVideo() {
    const {exportVideoWidth, resolution, disableBaseMap} = this.props;

    this._setDevicePixelRatio(resolution[0] / exportVideoWidth);

    if (disableBaseMap) {
      return;
    }

    if (this.mapRef.current) {
      const map = this.mapRef.current.getMap();
      map.resize();
    }
  }

  _setDevicePixelRatio(devicePixelRatio: number) {
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

  _getContainer() {
    const {exportVideoWidth, resolution} = this.props;
    const aspectRatio = resolution[0] / resolution[1];
    return {height: exportVideoWidth / aspectRatio, width: exportVideoWidth};
  }

  createLayers(beforeId?: string) {
    const {deckProps, mapData, viewState} = this.props;
    // returns an arr of DeckGL layer objects
    if (deckProps && deckProps.layers) {
      return deckProps.layers;
    }
    return createKeplerLayers(mapData, viewState, beforeId);
  }

  _onAfterRender() {
    this.props.adapter.onAfterRender(() => {
      this.forceUpdate();
    }, this.props.disableBaseMap || this.mapRef.current.getMap().areTilesLoaded());
  }

  _onMapLoad() {
    // Adds mapbox layer to modal
    const map = this.mapRef.current.getMap();

    const beforeId = this.props.mapboxLayerBeforeId;
    const keplerLayers = this.createLayers(beforeId);

    this.setState({deckLayers: keplerLayers});

    map.on('render', this._onAfterRender);
  }

  render() {
    const {
      rendering,
      saving,
      viewState,
      setViewState,
      adapter,
      durationMs,
      resolution,
      deckProps,
      mapProps,
      disableBaseMap
    } = this.props;
    const {mapStyle, deckLayers, mapboxAccessToken} = this.state;
    const deck = this.deckRef.current;
    const {width, height} = this._getContainer();
    const doubleResolution = {width: resolution[0] * 2, height: resolution[1] * 2};
    return (
      <>
        <DeckCanvas id="deck-canvas" $width={width} $height={height}>
          {disableBaseMap ? (
            <DeckGL
              ref={ref => setRef(this.deckRef, ref?.deck)}
              {...adapter.getProps({deck, extraProps: {...deckProps, layers: deckLayers}})}
              // {...doubleResolution}
              {...this._getContainer()}
              layers={deckLayers}
            />
          ) : (
            <ReactMapGL
              // style={doubleResolution}
              ref={this.mapRef}
              style={{width, height}}
              antialias
              {...mapProps}
              {...viewState}
              mapStyle={mapStyle}
              mapboxAccessToken={mapboxAccessToken}
              onLoad={this._onMapLoad}
              onMove={e => setViewState(e.viewState)}
              projection={{name: 'mercator'}}
            >
              <DeckGLOverlay
                ref={this.deckRef}
                deviceProps={{type: 'webgl', webgl: {stencil: true}}}
                {...adapter.getProps({deck, extraProps: {...deckProps, layers: deckLayers}})}
              />
            </ReactMapGL>
          )}
        </DeckCanvas>
        {rendering && (
          <RenderingSpinner
            rendering={rendering}
            saving={saving}
            width={width}
            height={height}
            adapter={adapter}
            durationMs={durationMs}
          />
        )}
      </>
    );
  }
}
