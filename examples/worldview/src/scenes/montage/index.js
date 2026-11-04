/* eslint-disable */
import {useDispatch} from 'react-redux';
import {timecodeChange, resolutionChange, formatChange} from '../../features/renderer';
import {useKepler, loadKeplerJson} from '../../features/kepler';
import {updateViewState} from '../../features/map';
import {useEffect} from 'react';
import {WebMercatorViewport} from '@deck.gl/core';
import {TextLayer} from '@deck.gl/layers';
import {hold} from 'hubble.gl';

const CENTER = {
  latitude: 40.76944617081325,
  longitude: -73.98095085938715,
  zoom: 17.88047290176511,
  bearing: 0,
  pitch: 0
};

// const CENTER = {
//   latitude: 40.76150677393161,
//   longitude: -73.97924658159985,
//   zoom: 17.531339846811306,
//   bearing: 0,
//   pitch: 0
// };

const RESOLUTION = {
  width: 1920,
  height: 1080
};

const RINGS = 2;

function ajacentTile({centerViewState, canvasWidth, canvasHeight, xOffsetScalar, yOffsetScalar}) {
  const viewport = new WebMercatorViewport({
    ...centerViewState,
    width: canvasWidth,
    height: canvasHeight
  });
  const [west, south, east, north] = viewport.getBounds();
  // const [
  //   [west, south],
  //   [east, north]
  // ] = viewport1.getBounds()
  const meterX =
    Math.abs(west - east) *
    viewport.distanceScales.unitsPerDegree[0] *
    viewport.distanceScales.metersPerUnit[0];
  let meterY = Math.abs(south - north);
  meterY *= viewport.distanceScales.unitsPerDegree[1];
  meterY *= viewport.distanceScales.metersPerUnit[1];

  const ajacent = viewport.addMetersToLngLat(
    [centerViewState.longitude, centerViewState.latitude, 0],
    [meterX * xOffsetScalar, meterY * yOffsetScalar, 0]
  );
  const ajacentViewState = {
    ...CENTER,
    longitude: ajacent[0],
    latitude: ajacent[1],
    label: `${xOffsetScalar}_${yOffsetScalar}`
  };
  return ajacentViewState;
}

const keyframes = [];
for (let y = RINGS * 1; y >= RINGS * -1; y--) {
  for (let x = RINGS * -1; x <= RINGS * 1; x++) {
    keyframes.push(
      ajacentTile({
        centerViewState: CENTER,
        canvasWidth: RESOLUTION.width,
        canvasHeight: RESOLUTION.height,
        xOffsetScalar: x,
        yOffsetScalar: y
      })
    );
  }
}

const KEPLER_MAP_ID = 'map';
export const useScene = () => {
  const dispatch = useDispatch();

  useKepler({
    mapId: KEPLER_MAP_ID,
    fetchMap: async () => {
      await loadKeplerJson('src/scenes/montage/nyctrips.json').then(action => {
        dispatch(action);
        dispatch(updateViewState(CENTER));
      });
    },
    // filterKeyframes: [],
    // layerKeyframes: [],
    // tripKeyframe: {},
    cameraKeyframe: {
      width: RESOLUTION.width,
      height: RESOLUTION.height,
      timings: Array(keyframes.length)
        .fill()
        .map((x, i) => i * 1000), // fill array with [0,1000,2000,...]
      keyframes,
      easings: hold,
      interpolators: 'flyTo'
    }
  });

  useEffect(() => {
    dispatch(
      timecodeChange({
        start: 0,
        end: keyframes.length * 1000,
        framerate: 1
      })
    );
    // dispatch(resolutionChange('1920x1080'));
    // dispatch(resolutionChange({width: 3840, height: 2160}));
    dispatch(resolutionChange({width: resolution.width, height: resolution.height}));
    // The maximum observed pixels supported are 33,177,600
    dispatch(formatChange('png'));
  }, []);

  return [
    new TextLayer({
      id: 'montage',
      data: keyframes,
      getPosition: d => [d.longitude, d.latitude],
      getText: d => d.label,
      getColor: d => [255, 255, 255, 255],
      getSize: 32,
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'center'
    })
  ];
};
