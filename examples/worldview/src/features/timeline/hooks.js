import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CameraKeyframes} from '@hubble.gl/core';

import {
  cameraKeyframeSelector,
  cameraFrameSelector,
  updateLayerFrame,
  updateCameraFrame
} from './timelineSlice';
import {dimensionSelector} from '../renderer';
import {updateViewState} from '../map';

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
  const cameraFrame = useSelector(cameraFrameSelector);
  useEffect(() => {
    if (cameraFrame) {
      dispatch(updateViewState(cameraFrame));
    }
  }, [cameraFrame]);
}

export function usePrepareFrame() {
  const dispatch = useDispatch();
  return useCallback(scene => {
    dispatch(updateCameraFrame(scene.getCameraFrame()));
    dispatch(updateLayerFrame(scene.getLayerFrame()));
  });
}
