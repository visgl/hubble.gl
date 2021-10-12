/* eslint-disable */
import {useDispatch} from 'react-redux';
import {timecodeChange, resolutionChange, formatChange} from '../../features/renderer';
import {useKepler, loadKeplerJson} from '../../features/kepler';
import {updateViewState} from '../../features/map';
import {useEffect} from 'react';
import {WebMercatorViewport} from '@deck.gl/core';
import {hold} from 'hubble.gl';

const CENTER = {
  latitude: 40.76150677393161,
  longitude: -73.97924658159985,
  zoom: 17.531339846811306,
  bearing: 0,
  pitch: 0
};

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
    latitude: ajacent[1]
  };
  return ajacentViewState;
}

const TOP_LEFT = ajacentTile({
  centerViewState: CENTER,
  canvasWidth: 1920,
  canvasHeight: 1080,
  xOffsetScalar: -1,
  yOffsetScalar: 1
});
const TOP_MIDDLE = ajacentTile({
  centerViewState: CENTER,
  canvasWidth: 1920,
  canvasHeight: 1080,
  xOffsetScalar: 0,
  yOffsetScalar: 1
});
const TOP_RIGHT = ajacentTile({
  centerViewState: CENTER,
  canvasWidth: 1920,
  canvasHeight: 1080,
  xOffsetScalar: 1,
  yOffsetScalar: 1
});
const CENTER_LEFT = ajacentTile({
  centerViewState: CENTER,
  canvasWidth: 1920,
  canvasHeight: 1080,
  xOffsetScalar: -1,
  yOffsetScalar: 0
});
const CENTER_MIDDLE = ajacentTile({
  centerViewState: CENTER,
  canvasWidth: 1920,
  canvasHeight: 1080,
  xOffsetScalar: 0,
  yOffsetScalar: 0
});
const CENTER_RIGHT = ajacentTile({
  centerViewState: CENTER,
  canvasWidth: 1920,
  canvasHeight: 1080,
  xOffsetScalar: 1,
  yOffsetScalar: 0
});
const BOTTOM_LEFT = ajacentTile({
  centerViewState: CENTER,
  canvasWidth: 1920,
  canvasHeight: 1080,
  xOffsetScalar: -1,
  yOffsetScalar: -1
});
const BOTTOM_MIDDLE = ajacentTile({
  centerViewState: CENTER,
  canvasWidth: 1920,
  canvasHeight: 1080,
  xOffsetScalar: 0,
  yOffsetScalar: -1
});
const BOTTOM_RIGHT = ajacentTile({
  centerViewState: CENTER,
  canvasWidth: 1920,
  canvasHeight: 1080,
  xOffsetScalar: 1,
  yOffsetScalar: -1
});

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
      width: 1920,
      height: 1080,
      timings: [0, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
      keyframes: [
        TOP_LEFT,
        TOP_MIDDLE,
        TOP_RIGHT,
        CENTER_LEFT,
        CENTER_MIDDLE,
        CENTER_RIGHT,
        BOTTOM_LEFT,
        BOTTOM_MIDDLE,
        BOTTOM_RIGHT
      ],
      easings: hold,
      interpolators: 'flyTo'
    }
  });

  useEffect(() => {
    dispatch(
      timecodeChange({
        start: 0,
        end: 10000,
        framerate: 1
      })
    );
    dispatch(resolutionChange('1920x1080'));
    // dispatch(resolutionChange({width: 3840, height: 2160}));
    // dispatch(resolutionChange({width: 5760, height: 5760}));
    // dispatch(resolutionChange({width: 7680, height: 4320}));
    // dispatch(resolutionChange({width: 1920, height: 1920}));
    // dispatch(resolutionChange({width: 1080, height: 1920}));
    // dispatch(resolutionChange({width: 1280, height: 720}));
    // dispatch(resolutionChange({width: 320, height: 180}));
    // The maximum observed pixels supported are 33,177,600
    dispatch(formatChange('png'));
  }, []);

  return [];
};
