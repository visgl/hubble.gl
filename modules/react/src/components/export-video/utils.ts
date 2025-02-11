// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import {point} from '@turf/helpers';
import transformTranslate from '@turf/transform-translate';
import {WebMercatorViewport} from '@deck.gl/core';
import type {MapViewState} from '@deck.gl/core';

export function scaleToVideoExport(
  viewState: MapViewState,
  container: {width: number; height: number}
) {
  const viewport = new WebMercatorViewport(viewState);
  const nw = viewport.unproject([0, 0]) as [number, number];
  const se = viewport.unproject([viewport.width, viewport.height]) as [number, number];
  const videoViewport = new WebMercatorViewport({
    ...viewState,
    width: container.width,
    height: container.height
  }).fitBounds([nw, se]);
  const {height, width, latitude, longitude, zoom, altitude} = videoViewport;
  return {
    height,
    width,
    latitude,
    longitude,
    pitch: viewState.pitch,
    zoom,
    bearing: viewState.bearing,
    altitude
  };
}

/**
 * Parses camera type and creates keyframe for Hubble to use
 * @param strCameraType of user-selected camera option ex: "Orbit (90º)"
 * @param viewState keyframe JSON that contains long, lat, zoom, bearing, pitch
 */
export function parseSetCameraType(strCameraType: string, viewState: MapViewState) {
  const modifiedViewState = {...viewState}; // Creating a shallow copy otherwise keyframes bugs out
  // Returns arr of important keywords. Should work for 2+ words in future ex: ["Orbit", "90"] | ["North", "South"] | ["Zoom", "In"]
  const match = strCameraType.match(/\b(?!to)\b\S+\w/g);
  // Converts mapState object to turf friendly Point obj (GEOJSON)
  const turfPoint = point([modifiedViewState.longitude, modifiedViewState.latitude]);
  if (match[0] === 'Orbit') {
    modifiedViewState.bearing = modifiedViewState.bearing + parseInt(match[1], 10);
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
 * Used to convert durationMs to [hh:]mm:ss[.ms]
 * @param durationMs duration of animation in milliseconds
 * @param showMs optionally show milliseconds
 * @returns time in format hh:mm:ss.ms
 */
export function printDuration(durationMs: number, showMs = false) {
  const millisecondsInt = Math.floor(durationMs % 1000);
  const secondsInt = Math.floor(durationMs / 1000) % 60;
  const minutesInt = Math.floor(durationMs / (1000 * 60)) % 60;
  const hoursInt = Math.floor(durationMs / (1000 * 60 * 60)) % 24;

  const hours = hoursInt === 0 ? '' : hoursInt < 10 ? `0${hoursInt}:` : `${hoursInt}:`;
  const minutes = minutesInt < 10 ? `0${minutesInt}` : minutesInt;
  const seconds = secondsInt < 10 ? `0${secondsInt}` : secondsInt;
  const milliseconds = showMs ? `.${millisecondsInt.toString()[0]}` : '';

  return `${hours}${minutes}:${seconds}${milliseconds}`;
}

const MB = 8 * 1024 * 1024;
// NOTE: Bit depth and compression ratio is a guess.
const COMPRESSION_RATIO = 0.8;
const BIT_DEPTH = 6;

/**
 * Estimates file size of resulting animation. All formulas are approximations
 * created with small sample of animations on default NY taxi trips data and
 * based off hubble's default framerate and the bitrate/depth of 3rd party encoders
 * @param frameRate frame rate of animation (set by developer)
 * @param resolution [width, height] of animation
 * @param durationMs duration of animation (set by developer)
 * @param mediaType 'GIF', 'WEBM', etc.
 * @returns size in MB
 */
export function estimateFileSize(
  frameRate: number,
  resolution: [number, number],
  durationMs: number,
  mediaType: string
) {
  const seconds = Math.floor(durationMs / 1000);
  if (mediaType === 'gif') {
    // Based off of https://www.youtube.com/watch?v=DDcYvesZsnw for uncompressed video
    // Formula: ((horizontal * vertical * bit depth) / (8 * 1024 * 1024 [convert to megabyte MB])) * (frame rate * time in seconds) * compression ratio
    // Additional resource https://stackoverflow.com/questions/27559103/video-size-calculation
    return `${Math.floor(
      ((resolution[0] * resolution[1] * BIT_DEPTH) / MB) * (frameRate * seconds) * COMPRESSION_RATIO
    )} MB`;
  }
  if (mediaType === 'webm') {
    // Formula: multiplier (arbitrary unit created by analyzing bitrate of outputs) * Mb (megabit) * seconds * .125 (conversion from bit to byte)
    // frameRate determines Mb/s in animations with a lot of movement at 720p. Multiply by seconds and convert to MB (megabyte)
    return `${Math.ceil((resolution[0] / 1280) * frameRate * seconds * 0.125)} MB`;
  }
  if (mediaType === 'png') {
    // Note: Adds one frame to size to account for an extra frame when exporting to pictures.
    return `${Math.floor(
      ((resolution[0] * resolution[1] * BIT_DEPTH) / MB) *
        ((frameRate + 1) * seconds) *
        COMPRESSION_RATIO
    )} MB`;
  }
  if (mediaType === 'jpeg') {
    // Note: Adds one frame to size to account for an extra frame when exporting to pictures.
    return `${Math.floor(
      ((resolution[0] * resolution[1] * BIT_DEPTH) / MB) *
        ((frameRate + 1) * seconds) *
        (COMPRESSION_RATIO - 0.4)
    )} MB`;
  }
  return 'Size estimation unavailable';
}
