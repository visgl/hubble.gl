import React, {useState} from 'react';
import {QuickAnimation} from '@hubble.gl/react';
import {CameraKeyframes, Keyframes} from '@hubble.gl/core';
import {PolygonLayer} from '@deck.gl/layers';
import {easing} from 'popmotion';

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.74,
  zoom: 11,
  pitch: 30,
  bearing: 0
};

const getKeyframes = () => {
  return {
    city: new Keyframes({
      features: ['opacity'],
      keyframes: [{opacity: 0}, {opacity: 1}],
      timings: [0, 2000],
      easings: [easing.anticipate]
    })
  };
};

const zipCodeData =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-zipcodes.json';

function getLayers(scene) {
  const cityFrame = scene.keyframes.city.getFrame();
  return [
    new PolygonLayer({
      id: 'polygon-layer',
      data: zipCodeData,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      getPolygon: d => d.contour,
      getFillColor: d => [22, 133, 248],
      getLineColor: [61, 20, 76, 255],
      getLineWidth: 3,
      opacity: cityFrame.opacity,
      material: {
        ambient: 1,
        diffuse: 0,
        shininess: 175,
        specularColor: [255, 255, 255]
      }
    })
  ];
}

export default function App() {
  const [duration] = useState(5000);
  const getCameraKeyframes = viewState => {
    return new CameraKeyframes({
      timings: [0, duration],
      keyframes: [viewState, {...viewState, zoom: viewState.zoom + 2, pitch: viewState.pitch + 20}],
      easings: [easing.easeInOut]
    });
  };

  const deckProps = {
    parameters: {
      clearColor: [61 / 255, 20 / 255, 76 / 255, 1]
    }
  };

  return (
    <QuickAnimation
      initialViewState={INITIAL_VIEW_STATE}
      getCameraKeyframes={getCameraKeyframes}
      getLayerKeyframes={getKeyframes}
      getLayers={getLayers}
      deckProps={deckProps}
      duration={duration}
    />
  );
}
