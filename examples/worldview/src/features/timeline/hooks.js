import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CameraKeyframes} from '@hubble.gl/core';

import {cameraKeyframeSelector, frameSelector, updateFrame} from './timelineSlice';
import {dimensionSelector} from '../renderer';
import {updateViewState} from '../stage/mapSlice';

export function useCameraKeyframes() {
  const cameraKeyframe = useSelector(cameraKeyframeSelector);
  const dimension = useSelector(dimensionSelector);
  const getCameraKeyframes = useCallback(() => {
    const camera = new CameraKeyframes({
      ...cameraKeyframe,
      width: dimension.width,
      height: dimension.height
    });
    return camera;
  }, [cameraKeyframe]);

  return getCameraKeyframes;
}

export function useCameraFrame() {
  const dispatch = useDispatch();
  const frame = useSelector(frameSelector);
  useEffect(() => {
    if (frame.camera) {
      dispatch(updateViewState(frame.camera));
    }
  }, [frame]);
}

export function usePrepareFrame() {
  const dispatch = useDispatch();
  const prepareFrame = useCallback(scene => {
    const sceneFrame = Object.entries(scene.keyframes).reduce((frame, [key, keyframe]) => {
      frame[key] = keyframe.getFrame();
      return frame;
    }, {});
    dispatch(updateFrame(sceneFrame));
  });
  return prepareFrame;
}
