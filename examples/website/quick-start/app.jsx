import React from 'react';
import {createRoot} from 'react-dom/client';
import {MapView} from '@deck.gl/core';
import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {QuickAnimation, hold, useDeckAnimation} from 'hubble.gl';
import {anticipate, easeIn, reverseEasing} from 'popmotion';

const INITIAL_VIEW_STATE = {
  longitude: -122.402,
  latitude: 37.79,
  zoom: 11
};

const TIMECODE = {
  start: 0,
  end: 5000,
  framerate: 30
};

const RESOLUTION = {
  width: 640,
  height: 480
};

const Container = ({children}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#11183c',
      overflow: 'hidden'
    }}
  >
    {children}
  </div>
);

export default function App() {
  const animation = useDeckAnimation({
    getLayers: a =>
      a.applyLayerKeyframes([
        new ScatterplotLayer({
          id: 'circle',
          data: [{position: [-122.402, 37.79], color: [255, 0, 0], radius: 1000}],
          getFillColor: d => d.color,
          getRadius: d => d.radius,
          opacity: 0.1,
          radiusScale: 0.01
        }),
        new TextLayer({
          id: 'text',
          data: [{position: [-122.402, 37.79], text: 'Hello World'}],
          opacity: 0.1,
          getAngle: -90
        })
      ]),
    layerKeyframes: [
      {
        id: 'circle',
        keyframes: [
          {opacity: 0.1, radiusScale: 0.01},
          {opacity: 1, radiusScale: 1},
          {opacity: 1, radiusScale: 1},
          {opacity: 1, radiusScale: 20}
        ],
        timings: [0, 1000, 1500, 3000],
        // https://popmotion.io/api/easing/
        easings: [anticipate, hold, anticipate]
      },
      {
        id: 'text',
        keyframes: [
          {opacity: 0, getAngle: -90},
          {opacity: 1, getAngle: 0},
          {opacity: 1, getAngle: 0},
          {opacity: 0, getAngle: 0}
        ],
        timings: [0, 1000, 1500, 2000],
        easings: [reverseEasing(anticipate), hold, easeIn]
      }
    ]
  });

  return (
    <Container>
      <QuickAnimation
        initialViewState={INITIAL_VIEW_STATE}
        resolution={RESOLUTION}
        animation={animation}
        deckProps={{
          views: new MapView({
            clearColor: [255, 255, 255, 1]
          })
        }}
        timecode={TIMECODE}
      />
    </Container>
  );
}

export async function renderToDOM(container) {
  const root = createRoot(container);
  root.render(<App />);
}
