import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CameraKeyframes} from '@hubble.gl/core';

import {cameraKeyframeSelector} from './timelineSlice';
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

export function usePrepareCameraFrame() {
  const dispatch = useDispatch();
  const prepareFrame = useCallback(scene => {
    dispatch(updateViewState(scene.keyframes.camera.getFrame()));
  });
  return prepareFrame;
}
