import {busySelector, previewVideo, stopVideo, renderVideo} from '../renderer';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

export function usePreviewHandler({getCameraKeyframes, getKeyframes}) {
  const rendererBusy = useSelector(busySelector);
  const dispatch = useDispatch();
  const handlePreview = useCallback(() => {
    if (rendererBusy === false) {
      dispatch(previewVideo({getCameraKeyframes, getKeyframes}));
    } else {
      dispatch(stopVideo());
    }
  }, [rendererBusy, getCameraKeyframes, getKeyframes]);
  return handlePreview;
}

export function useRenderHandler({getCameraKeyframes, getKeyframes}) {
  const rendererBusy = useSelector(busySelector);
  const dispatch = useDispatch();
  const handleRender = useCallback(() => {
    if (rendererBusy === false) {
      dispatch(renderVideo({getCameraKeyframes, getKeyframes}));
    } else {
      dispatch(stopVideo());
    }
  }, [rendererBusy, getCameraKeyframes, getKeyframes]);
  return handleRender;
}
