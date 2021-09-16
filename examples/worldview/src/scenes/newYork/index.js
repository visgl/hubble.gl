import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useAfterKepler} from '../../app';
import {useKeplerMapState, useKepler} from '../../features/kepler/hooks';
import {loadSampleData} from './data';
import {
  timecodeChange,
  resolutionChange,
  formatChange,
  formatConfigsChange,
  durationSelector,
  adapterSelector
} from '../../features/renderer';
import {viewStateSelector} from '../../features/map';
import {easing} from 'popmotion';

const KEPLER_MAP_ID = 'map';

export const useScene = () => {
  const dispatch = useDispatch();
  const viewState = useSelector(viewStateSelector);
  const duration = useSelector(durationSelector);
  const adapter = useSelector(adapterSelector);

  useKepler({
    mapId: KEPLER_MAP_ID,
    fetchMap: async () => {
      const actions = loadSampleData();
      actions.forEach(a => dispatch(a));
    }
  });

  const newYorkScene = () => {
    // load sample data

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
    if (viewState) {
      const {longitude, latitude, zoom, pitch, bearing} = viewState;
      adapter.animationManager.setKeyframes('kepler', {
        cameraKeyframe: {
          timings: [0, duration],
          keyframes: [
            {longitude, latitude, zoom, pitch, bearing},
            {longitude, latitude, zoom, pitch, bearing: bearing + 90}
          ],
          easings: [easing.easeInOut]
        }
      });
    }
  }, [Boolean(viewState), duration]);

  useAfterKepler(newYorkScene);
  useKeplerMapState('map');
};
