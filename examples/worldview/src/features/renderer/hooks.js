import {busySelector, previewVideo, stopVideo, renderVideo} from '../renderer';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

export function usePreviewHandler() {
  const rendererBusy = useSelector(busySelector);
  const dispatch = useDispatch();
  const handlePreview = useCallback(() => {
    if (rendererBusy === false) {
      dispatch(previewVideo({}));
    } else {
      dispatch(stopVideo());
    }
  }, [rendererBusy]);
  return handlePreview;
}

export function useRenderHandler() {
  const rendererBusy = useSelector(busySelector);
  const dispatch = useDispatch();
  const handleRender = useCallback(() => {
    if (rendererBusy === false) {
      dispatch(renderVideo({}));
    } else {
      dispatch(stopVideo());
    }
  }, [rendererBusy]);
  return handleRender;
}
