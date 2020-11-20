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

/**
 * This pattern of get frame definition is deprecated. Use Keyframes.getFrame instead.
 */
import {transform} from 'popmotion';

export const cameraFrame = cameraKeyframes => {
  const factor = cameraKeyframes.factor;
  const start = cameraKeyframes.getStartData();
  const end = cameraKeyframes.getEndData();
  const latitude = transform.interpolate([0, 1], [start.latitude, end.latitude], {ease: end.ease});
  const longitude = transform.interpolate([0, 1], [start.longitude, end.longitude], {
    ease: end.ease
  });
  const zoom = transform.interpolate([0, 1], [start.zoom, end.zoom], {
    ease: end.ease
  });
  const bearing = transform.interpolate([0, 1], [start.bearing, end.bearing], {
    ease: end.ease
  });
  const pitch = transform.interpolate([0, 1], [start.pitch, end.pitch], {
    ease: end.ease
  });

  const cameraState = {
    latitude: latitude(factor),
    longitude: longitude(factor),
    zoom: zoom(factor),
    bearing: bearing(factor),
    pitch: pitch(factor)
  };
  return cameraState;
};

export const filterFrame = filterKeyframes => {
  const factor = filterKeyframes.factor;
  const start = filterKeyframes.getStartData();
  const end = filterKeyframes.getEndData();

  const left = transform.interpolate([0, 1], [start[0], end[0]], {
    ease: end.ease
  });
  const right = transform.interpolate([0, 1], [start[1], end[1]], {
    ease: end.ease
  });

  return [left(factor), right(factor)];
};

export const radiusFrame = keyframes => {
  const factor = keyframes.factor;
  const start = keyframes.getStartData();
  const end = keyframes.getEndData();

  const radius = transform.interpolate([0, 1], [start.radius, end.radius], {
    ease: end.ease
  });

  return radius(factor);
};

export const elevationScaleFrame = keyframes => {
  const factor = keyframes.factor;
  const start = keyframes.getStartData();
  const end = keyframes.getEndData();

  const elevationScale = transform.interpolate([0, 1], [start.elevationScale, end.elevationScale], {
    ease: end.ease
  });

  return elevationScale(factor);
};

export const opacityFrame = keyframes => {
  const factor = keyframes.factor;
  const start = keyframes.getStartData();
  const end = keyframes.getEndData();

  const opacity = transform.interpolate([0, 1], [start.opacity, end.opacity], {
    ease: end.ease
  });

  return opacity(factor);
};
