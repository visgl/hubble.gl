import React from 'react';
import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {QuickAnimation, Keyframes, hold} from 'hubble.gl';
import {easing} from 'popmotion';

const INITIAL_VIEW_STATE = {
  longitude: -122.402,
  latitude: 37.79,
  zoom: 11
};
const DURATION = 3000;

export default function App() {
  const getKeyframes = () => {
    return {
      circle: new Keyframes({
        features: ['opacity', 'radiusScale'],
        keyframes: [
          {opacity: 0, radiusScale: 0.01},
          {opacity: 1, radiusScale: 1},
          {opacity: 1, radiusScale: 1},
          {opacity: 1, radiusScale: 20}
        ],
        timings: [0, 1000, 1500, 3000],
        // https://popmotion.io/api/easing/
        easings: [easing.anticipate, hold, easing.anticipate]
      }),
      text: new Keyframes({
        features: ['opacity', 'getAngle'],
        keyframes: [
          {opacity: 0, getAngle: -90},
          {opacity: 1, getAngle: 0},
          {opacity: 1, getAngle: 0},
          {opacity: 0, getAngle: 0}
        ],
        timings: [0, 1000, 1500, 2000],
        easings: [easing.reversed(easing.anticipate), hold, easing.easeIn]
      })
    };
  };
  const getLayers = scene => {
    const circleFrame = scene.keyframes.circle.getFrame();
    const textFrame = scene.keyframes.text.getFrame();
    return [
      new ScatterplotLayer({
        data: [{position: [-122.402, 37.79], color: [255, 0, 0], radius: 1000}],
        getFillColor: d => d.color,
        getRadius: d => d.radius,
        ...circleFrame
      }),
      new TextLayer({
        data: [{position: [-122.402, 37.79], text: 'Hello World'}],
        ...textFrame
      })
    ];
  };
  return (
    <QuickAnimation
      initialViewState={INITIAL_VIEW_STATE}
      width={640}
      height={480}
      getLayers={getLayers}
      getLayerKeyframes={getKeyframes}
      deckProps={{
        parameters: {
          clearColor: [255, 255, 255, 1]
        }
      }}
      duration={DURATION}
    />
  );
}
