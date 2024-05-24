import React from 'react';
import {createRoot} from 'react-dom/client';
import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {QuickAnimation, hold, useDeckAnimation} from 'hubble.gl';
import {anticipate, easeIn, reverseEasing} from 'popmotion';

const INITIAL_VIEW_STATE = {
  longitude: -122.402,
  latitude: 37.79,
  zoom: 14
};

const TIMECODE = {
  start: 0,
  end: 5000,
  framerate: 30
};

const RESOLUTION = {
  width: 1920,
  height: 1080
};

const FORMAT_CONFIGS = {
  webm: {
    quality: 0.99
  },
  gif: {
    width: 480,
    height: 270
  }
};

const BACKGROUND = [30 / 255, 30 / 255, 30 / 255, 1];
const BLUE = [37, 80, 129];

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
          data: [{position: [-122.402, 37.79], color: BLUE, radius: 1000}],
          getFillColor: d => d.color,
          getRadius: d => d.radius,
          opacity: 1,
          radiusScale: 1
        }),
        new TextLayer({
          id: 'text',
          data: [{position: [-122.402, 37.79], text: 'Hello World'}],
          opacity: 1,
          getPixelOffset: [0, -64],
          getSize: 64
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
        formatConfigs={FORMAT_CONFIGS}
        animation={animation}
        deckProps={{
          useDevicePixels: 1, // Otherwise retina displays will double resolution.
          // Visualization Props
          parameters: {
            // Background color. Most video formats don't fully support transparency
            clearColor: BACKGROUND
          }
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