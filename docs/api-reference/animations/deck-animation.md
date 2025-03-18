# DeckAnimation

## Usage

```js
new DeckAnimation({
  getLayers: () => ([
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: ...
    })
  ]),
  cameraKeyframe: {
    timings: [0, 6000],
    keyframes: [
      {
        latitude: 46.24,
        longitude: -122.18,
        zoom: 11.5,
        bearing: 140,
        pitch: 60
      },
      {
        latitude: 46.24,
        longitude: -122.18,
        zoom: 11,
        bearing: 0,
        pitch: 90
      }
    ]
  },
  layerKeyframes: [{
    id: 'scatterplot-layer',
    keyframes: [
      {lineWidthScale: 1, getRadius: 10, opacity: 0.8},
      {lineWidthScale: 10, getRadius: 5, opacity: 0.8},
      {lineWidthScale: 10, getRadius: 100, opacity: 0}
    ],
    timings: [0, 2000, 4000]
  }]
})
```

## Source

[modules/core/src/animations/deck-animation.ts](https://github.com/visgl/hubble.gl/blob/master/modules/core/src/animations/deck-animation.ts)