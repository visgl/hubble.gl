import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useKeplerMapState} from '../../features/kepler/hooks';
import {loadSampleData} from './data';
import {updateCameraKeyframes} from '../../features/timeline/timelineSlice';
import {
  timecodeChange,
  resolutionChange,
  formatChange,
  formatConfigsChange,
  durationSelector
} from '../../features/renderer';
import {useWhenReady} from '../../features/stage/hooks';
import {easing} from 'popmotion';
import {viewStateSelector} from '../../features/stage/mapSlice';

export const useNewYorkScene = () => {
  const dispatch = useDispatch();
  const viewState = useSelector(viewStateSelector);
  const duration = useSelector(durationSelector);

  const newYorkScene = () => {
    // load sample data
    const actions = loadSampleData();
    actions.forEach(a => dispatch(a));
    dispatch(timecodeChange({start: 0, end: 5000, framerate: 30}));
    dispatch(resolutionChange('1920x1080'));
    dispatch(
      formatConfigsChange({
        gif: {
          sampleInterval: 100,
          width: 1280,
          height: 720,
          jpegQuality: 1.0
        }
      })
    );
    dispatch(formatChange('gif'));
  };

  useEffect(() => {
    const {longitude, latitude, zoom, pitch, bearing} = viewState;
    dispatch(
      updateCameraKeyframes({
        timings: [0, duration],
        keyframes: [
          {longitude, latitude, zoom, pitch, bearing},
          {longitude, latitude, zoom, pitch, bearing: bearing + 90}
        ],
        easings: [easing.easeInOut]
      })
    );
  }, [viewState, duration]);

  useWhenReady(newYorkScene);
  useKeplerMapState();
};
