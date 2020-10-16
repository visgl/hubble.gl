// Copyright (c) 2020 Uber Technologies, Inc.
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
import {DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';

export function sceneBuilder(animationLoop) {
  const keyframes = {
    camera: new CameraKeyframes({
      timings: [0, 1000], // TODO change to 5000 later. 1000 for dev testing
      keyframes: [
        {
          longitude: -122.4,
          latitude: 37.74,
          zoom: 1,
          pitch: 30,
          bearing: 0
        },
        {
          longitude: -122.4,
          latitude: 37.74,
          zoom: 1.8,
          bearing: 35,
          pitch: 70
        }
      ],
      easings: [easing.easeInOut]
    })
  };
  const currentCamera = animationLoop.timeline.attachAnimation(keyframes.camera);

  return new DeckScene({
    animationLoop,
    keyframes,
    lengthMs: 1000, // TODO change to 5000 later. 1000 for dev testing
    width: 480,
    height: 460,
    currentCamera
  });
}
