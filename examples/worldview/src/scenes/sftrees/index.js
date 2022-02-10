/* eslint-disable */
import {useDispatch, useSelector} from 'react-redux';
import {
  timecodeChange,
  resolutionChange,
  formatChange,
  formatConfigsChange
} from '../../features/renderer';
import {useKepler, loadKeplerJson} from '../../features/kepler';
import {updateViewState, viewStateSelector} from '../../features/map';
import {useEffect} from 'react';
import {easing} from 'popmotion';
import {OrthographicView} from '@deck.gl/core';
import {TextLayer} from '@deck.gl/layers';

const resolution = {
  width: 1920,
  height: 1080
};

const viewport = new OrthographicView({}).makeViewport(resolution);

function viewStateLegend(viewState) {
  const show = ['latitude', 'longitude', 'zoom', 'pitch', 'bearing'];
  var legend = '';
  for (const key of show) {
    legend += `${key}: ${viewState[key]}\n`;
  }
  return legend;
}

// const SF = {"latitude":37.75996553215378,"longitude":-122.43586511157562,"zoom":12.29897059083749,"bearing":0,"pitch":0}
const SF = {
  latitude: 37.75048001799724,
  longitude: -122.443076953531,
  zoom: 13.690780757619873,
  bearing: 9.890625,
  pitch: 56.19367007044364
};
const KEPLER_MAP_ID = 'map';
export const useScene = () => {
  const dispatch = useDispatch();

  useKepler({
    mapId: KEPLER_MAP_ID,
    fetchMap: async () => {
      await loadKeplerJson('src/scenes/sftrees/sftrees.json').then(action => {
        dispatch(action);
        dispatch(updateViewState(SF));
      });
    },
    // filterKeyframes: [],
    // layerKeyframes: [],
    // tripKeyframe: {},
    cameraKeyframe: {
      timings: [500, 2500],
      keyframes: [SF, {...SF, pitch: 0, zoom: SF.zoom - 3}],
      easings: [easing.easeInOut]
    }
  });

  useEffect(() => {
    dispatch(
      timecodeChange({
        start: 0,
        end: 4000,
        framerate: 60
      })
    );
    dispatch(resolutionChange(resolution));
    // dispatch(resolutionChange({width: 3840, height: 2160}));
    // dispatch(resolutionChange({width: 5760, height: 5760}));
    // dispatch(resolutionChange({width: 7680, height: 4320}));
    // dispatch(resolutionChange({width: 1920, height: 1920}));
    // dispatch(resolutionChange({width: 1080, height: 1920}));
    // dispatch(resolutionChange({width: 1280, height: 720}));
    // dispatch(resolutionChange({width: 320, height: 180}));
    // The maximum observed pixels supported are 33,177,600
    dispatch(
      formatConfigsChange({
        webm: {
          quality: 0.99
        },
        gif: {
          sampleInterval: 1,
          jpegQuality: 1.0,
          ...resolution
        }
      })
    );
    dispatch(formatChange('webm'));
  }, []);

  const viewState = useSelector(viewStateSelector);

  return [
    new TextLayer({
      id: '%%hud-title',
      data: [{text: 'San Francisco', position: [0, viewport.unproject([0, 80])[1]]}],
      fontFamily: 'sans-serif',
      fontSettings: {
        fontSize: 200,
        sdr: true,
        buffer: 2,
        radius: 8
      },
      getSize: 48,
      getColor: [255, 255, 255, 255],
      getTextAnchor: 'middle'
    }),
    new TextLayer({
      id: '%%hud-map-view-state',
      data: [{text: viewState && viewStateLegend(viewState)}],
      getSize: 32,
      getPosition: viewport.unproject([40, resolution.height - 120]),
      getColor: [255, 255, 255, 255],
      getTextAnchor: 'start'
    })
  ];
};
