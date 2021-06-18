import {busySelector, previewVideo, stopVideo, renderVideo} from '../renderer';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

export function usePreviewHandler({getCameraKeyframes, getLayerKeyframes}) {
  const rendererBusy = useSelector(busySelector);
  const dispatch = useDispatch();
  const handlePreview = useCallback(() => {
    if (rendererBusy === false) {
      dispatch(previewVideo({getCameraKeyframes, getLayerKeyframes}));
    } else {
      dispatch(stopVideo());
    }
  }, [rendererBusy, getCameraKeyframes, getLayerKeyframes]);
  return handlePreview;
}

export function useRenderHandler({getCameraKeyframes, getLayerKeyframes}) {
  const rendererBusy = useSelector(busySelector);
  const dispatch = useDispatch();
  const handleRender = useCallback(() => {
    if (rendererBusy === false) {
      dispatch(renderVideo({getCameraKeyframes, getLayerKeyframes}));
    } else {
      dispatch(stopVideo());
    }
  }, [rendererBusy, getCameraKeyframes, getLayerKeyframes]);
  return handleRender;
}
