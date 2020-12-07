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

import {point} from '@turf/helpers';
import transformTranslate from '@turf/transform-translate';

/**
 * Parses camera type and creates keyframe for Hubble to use
 * @param {string} strCameraType of user-selected camera option ex: "Orbit (90º)"
 * @param {Object} viewState keyframe JSON that contains long, lat, zoom, bearing, pitch
 * @returns {Object} below:
 *      {
 *        longitude: modifiedViewState.longitude,
 *        latitude: modifiedViewState.latitude,
 *        zoom: modifiedViewState.zoom,
 *        bearing: modifiedViewState.bearing,
 *        pitch: modifiedViewState.pitch
 *      }
 *
 */
export function parseSetCameraType(strCameraType, viewState) {
  const modifiedViewState = {...viewState}; // Creating a shallow copy otherwise keyframes bugs out
  // Returns arr of important keywords. Should work for 2+ words in future ex: ["Orbit", "90"] | ["North", "South"] | ["Zoom", "In"]
  const match = strCameraType.match(/\b(?!to)\b\S+\w/g);
  // Converts mapState object to turf friendly Point obj (GEOJSON)
  const turfPoint = point([modifiedViewState.longitude, modifiedViewState.latitude]);
  if (match[0] === 'Orbit') {
    modifiedViewState.bearing = parseInt(match[1], 10);
  }

  // TODO future option that'll allow user to set X distance (km OR miles) directionally. Options inside turf
  // https://turfjs.org/docs/#transformTranslate
  const setChecker = new Set(['East', 'South', 'West', 'North']);
  if (setChecker.has(match[0])) {
    if (match[0] === 'East') {
      // TODO Temporary solution to catch this branch to master. Doesn't work for "East to North" for example if option allows in future
      const translatedPoly = transformTranslate(turfPoint, 10, 270);
      modifiedViewState.longitude = translatedPoly.geometry.coordinates[0];
    } else if (match[0] === 'South') {
      const translatedPoly = transformTranslate(turfPoint, 10, 0);
      modifiedViewState.latitude = translatedPoly.geometry.coordinates[1];
    } else if (match[0] === 'West') {
      const translatedPoly = transformTranslate(turfPoint, 10, 90);
      modifiedViewState.longitude = translatedPoly.geometry.coordinates[0];
    } else if (match[0] === 'North') {
      const translatedPoly = transformTranslate(turfPoint, 10, 180);
      modifiedViewState.latitude = translatedPoly.geometry.coordinates[1];
    }
  }

  if (match[0] === 'Zoom') {
    if (match[1] === 'In') {
      modifiedViewState.zoom = modifiedViewState.zoom + 3;
    } else if (match[1] === 'Out') {
      modifiedViewState.zoom = modifiedViewState.zoom - 3;
    }
  }
  return modifiedViewState;
}

/**
 * Used to convert durationMs (inherited from ExportVideoPanelContainer) to hh:mm:ss
 * @param {number} durationMs duration of animation in milliseconds
 * @returns {string} time in format hh:mm:ss
 */
export function msConversion(durationMs) {
  const milliseconds = parseInt(durationMs % 1000, 10);
  let seconds = parseInt((durationMs / 1000) % 60, 10);
  let minutes = parseInt((durationMs / (1000 * 60)) % 60, 10);
  // let hours = parseInt((durationMs / (1000 * 60 * 60)) % 24, 10); // Hours can be used if needed in future

  // hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${seconds}.${milliseconds}`;
}

/**
 * Estimates file size of resulting animation
 * @param {number} frameRate frame rate of animation (set by developer)
 * @param {array} resolution [width, height] of animation
 * @param {number} durationMs duration of animation (set by developer)
 * @param {string} mediaType 'GIF', 'WEBM', etc.
 * @returns {string} size in MB
 */
export function estimateFileSize(frameRate, resolution, durationMs, mediaType) {
  // Based off of https://www.youtube.com/watch?v=DDcYvesZsnw for uncompressed video
  // Formula: ((horizontal * vertical * bit depth) / (8 * 1024 * 1024 [convert to megabyte MB])) * (frame rate * time in seconds) * compression ratio
  // Additional resource https://stackoverflow.com/questions/27559103/video-size-calculation
  // NOTE: Bit depth is a guess because I couldn't find it. Same w/ compression ratio
  // TODO Read resource from Imgur dev https://stackoverflow.com/questions/23920098/how-to-estimate-gif-file-size
  if (mediaType === 'gif') {
    // ParseInt to turn it from float to int
    const seconds = parseInt(durationMs / 1000, 10);
    return `${parseInt(
      ((resolution[0] * resolution[1] * 6) / (8 * 1024 * 1024)) * (frameRate * seconds) * 0.8,
      10
    )} MB`;
  }
  return 'Size estimation unavailable';
}
