import React from 'react';
import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';

const INITIAL_VIEW_STATE = {
  longitude: -122.402,
  latitude: 37.79,
  zoom: 11
};

export default function App() {
  const layers = [
    new ScatterplotLayer({
      id: 'circle',
      data: [{position: [-122.402, 37.79], color: [255, 0, 0], radius: 1000}],
      getFillColor: d => d.color,
      getRadius: d => d.radius,
      opacity: 1,
      radiusScale: 1
    }),
    new TextLayer({
      id: 'text',
      data: [{position: [-122.402, 37.79], text: 'Hello World'}],
      opacity: 1,
      getAngle: 0
    })
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      width={640}
      height={480}
      layers={layers}
      parameters={{
        clearColor: [255, 255, 255, 1]
      }}
    />
  );
}
