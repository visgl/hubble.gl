/* eslint-disable */
import {useDispatch} from 'react-redux';
import {
  timecodeChange,
  resolutionChange,
  formatChange,
  formatConfigsChange
} from '../../features/renderer';
import {useKepler, loadKeplerJson} from '../../features/kepler';
import {updateViewState} from '../../features/map';
import {useEffect} from 'react';
import {easing} from 'popmotion';

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
      timings: [500, 3500],
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
    // dispatch(resolutionChange('1920x1080'));
    dispatch(resolutionChange({width: 3840, height: 2160}));
    dispatch(
      formatConfigsChange({
        gif: {
          sampleInterval: 1,
          width: 1280,
          height: 720,
          jpegQuality: 1.0
        }
      })
    );
    dispatch(formatChange('webm'));
  }, []);

  return [];
};
