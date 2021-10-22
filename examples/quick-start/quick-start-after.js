import React from 'react';
import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {QuickAnimation, hold, DeckAnimation} from 'hubble.gl';
import {easing} from 'popmotion';

const INITIAL_VIEW_STATE = {
  longitude: -122.402,
  latitude: 37.79,
  zoom: 11
};

const animation = new DeckAnimation({
  getLayers: a =>
    a.applyLayerKeyframes([
      new ScatterplotLayer({
        id: 'circle',
        data: [{position: [-122.402, 37.79], color: [255, 0, 0], radius: 1000}],
        getFillColor: d => d.color,
        getRadius: d => d.radius,
        opacity: 0,
        radiusScale: 0.01
      }),
      new TextLayer({
        id: 'text',
        data: [{position: [-122.402, 37.79], text: 'Hello World'}],
        opacity: 0,
        getAngle: -90
      })
    ]),
  layerKeyframes: [
    {
      id: 'circle',
      keyframes: [
        {opacity: 0, radiusScale: 0.01},
        {opacity: 1, radiusScale: 1},
        {opacity: 1, radiusScale: 1},
        {opacity: 1, radiusScale: 20}
      ],
      timings: [0, 1000, 1500, 3000],
      // https://popmotion.io/api/easing/
      easings: [easing.anticipate, hold, easing.anticipate]
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
      easings: [easing.reversed(easing.anticipate), hold, easing.easeIn]
    }
  ]
});

const TIMECODE = {
  start: 0,
  end: 5000,
  framerate: 30
};

const RESOLUTION = {
  width: 640,
  height: 480
};

export default function App() {
  return (
    <QuickAnimation
      initialViewState={INITIAL_VIEW_STATE}
      resolution={RESOLUTION}
      animation={animation}
      deckProps={{
        parameters: {
          clearColor: [255, 255, 255, 1]
        }
      }}
      timecode={TIMECODE}
    />
  );
}
