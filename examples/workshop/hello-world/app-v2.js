/* eslint-disable import/first */
/* global hubble, deck, popmotion */

// RENDER SETTINGS
const timecode = {
  start: 0,
  end: 3000,
  framerate: 30
};

const resolution = {
  width: 1920,
  height: 1080
};

const previewEncoder = hubble.PreviewEncoder();
// const webmEncoder = hubble.WebMEncoder({quality: 0.99});
// const gifEncoder = hubble.GifEncoder({width: 480, height: 270});

// -- RENDER SETTINGS END

// ANIMATION SETTINGS
/**
import {
  DeckAnimation,
  DeckAdapter,
  AnimationManager
} from "@hubble.gl/core";
import { anticipate, reverseEasing, easeIn } from "popmotion"; 
import { ScatterplotLayer, TextLayer } from "@deck.gl/layers";
*/

const BLUE = [37, 80, 129];

const VIEW_STATE = {
  longitude: -122.402,
  latitude: 37.79,
  zoom: 14,
  bearing: 0,
  pitch: 0
};

const animation = new hubble.DeckAnimation({
  getLayers: a => {
    /* const frame = a.layerKeyframes['circle'].getFrame();
    console.log(frame); */

    return a.applyLayerKeyframes([
      new deck.ScatterplotLayer({
        id: 'circle',
        data: [
          {
            position: [-122.402, 37.79],
            color: BLUE,
            radius: 1000
          }
        ],
        getFillColor: d => d.color,
        getRadius: d => d.radius,
        opacity: 1, // 0.1
        radiusScale: 1 // 0.01
      }),
      new deck.TextLayer({
        id: 'text',
        data: [
          {
            position: [-122.402, 37.79],
            text: 'Hola Mundo'
          }
        ],
        opacity: 1, // 0.1
        getAngle: 0,
        getPixelOffset: [0, -32],
        getColor: [255, 255, 255],
        getSize: 64
      })
    ]);
  },
  layerKeyframes: [
    {
      id: 'circle',
      keyframes: [
        {
          opacity: 0.1,
          radiusScale: 0.01
        },
        {
          opacity: 1,
          radiusScale: 1
        }
      ],
      timings: [0, 1000],
      easings: popmotion.cubicBezier(0.75, 0.25, 0.25, 0.75)
    },
    {
      id: 'text',
      keyframes: [
        {
          opacity: 0,
          getPixelOffset: [0, -64]
        },
        {
          opacity: 1,
          getPixelOffset: [0, 0]
        }
      ],
      timings: [0, 1000]
    }
  ]
});
// -- ANIMATION SETTINGS END

// VISUALIZATION
/* import { Deck } from "@deck.gl/core"; */

const BACKGROUND = [30 / 255, 30 / 255, 30 / 255, 1];

export const deckgl = new deck.Deck({
  canvas: 'deck-canvas',
  // Resolution Props
  width: resolution.width,
  height: resolution.height,
  useDevicePixels: 1, // Otherwise retina displays will double resolution.
  // Camera Props
  initialViewState: VIEW_STATE,
  controller: true,
  // Visualization Props
  parameters: {
    // Background color. Most video formats don't fully support transparency
    clearColor: BACKGROUND
  }
});
// -- VISUALIZATION END

// RENDERER SETUP
const animator = new hubble.DeckAnimator({
  deck: deckgl,
  animations: [animation]
  // drawOverride: (animator, deckgl) => {
  //   deckgl.setProps(animator.getProps({
  //     onNextFrame: animator.setProps // draw loop
  //   }));
  // }
});

// In v2, draw loop goes inside DeckAnimator
function setProps() {
  deckgl.setProps(
    animator.getProps({
      onNextFrame: setProps // draw loop
    })
  );
}

const embedVideo = blob => {
  if (blob && blob.type === 'image/gif') {
    const gifElement = document.getElementById('gif-render');
    gifElement.style.display = 'block';
    gifElement.src = URL.createObjectURL(blob);
  }
  if (blob && blob.type === 'video/webm') {
    const videoElement = document.getElementById('video-render');
    videoElement.style.display = 'block';
    videoElement.setAttribute('controls', true);
    videoElement.setAttribute('autoplay', true);
    videoElement.src = URL.createObjectURL(blob);
    videoElement.addEventListener('canplaythrough', () => {
      videoElement.play();
    });
  }
};

const render = () => {
  animator.render({
    encoder: previewEncoder,
    timecode,
    onComplete: setProps,
    onSave: embedVideo // display the rendered video in the UI
  });
  deckgl.redraw(true);
};
// -- RENDERER SETUP END

// RENDER RUNTIME
setProps();

animation.setOnLayersUpdate(layers => {
  deckgl.setProps({
    layers
  });
});

// -- RENDER RUNTIME END

// ANIMATION SETTINGS UI
const scrubber = document.getElementById('scrubber');
scrubber.onchange = e =>
  animator.seek({
    timeMs: e.target.value
  });
scrubber.setAttribute('max', timecode.end);

document.body.style.margin = '0px';
const reRenderElement = document.getElementById('re-render');
reRenderElement.onclick = render;
// -- ANIMATION UI END
