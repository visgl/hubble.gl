import React, {useMemo, useCallback} from 'react';
import {Play, Search, Maximize} from './Icons';
import {useDispatch, useSelector} from 'react-redux';
import {
  busySelector,
  durationSelector,
  previewVideo,
  stopVideo,
  renderVideo,
  dimensionSelector
} from '../renderer';
import {AutoSizer} from 'react-virtualized';
import {WithKeplerUI} from '@hubble.gl/react';
import StageContainer from './StageContainer';
import {CameraKeyframes, FilterValueKeyframes} from '@hubble.gl/core';
import {cameraKeyframeSelector, filterKeyframeSelector} from '../timeline/timelineSlice';
import {setFilter} from 'kepler.gl/actions';

const StageBottomToolbar = ({playing, onPreview}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#232426',
        padding: '12px'
      }}
    >
      <Search />
      <div onClick={onPreview}>
        <Play />
      </div>
      <Maximize />
    </div>
  );
};

const StageMapOverlay = ({rendererBusy, currentTime, duration, width, height}) => {
  const loaderStyle = {
    display: rendererBusy === 'rendering' ? 'flex' : 'none',
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.5)',
    width: `${width}px`,
    height: `${height}px`,
    alignItems: 'center',
    justifyContent: 'center'
  };

  const percent = useMemo(() => {
    return Math.floor((currentTime / duration) * 100).toFixed(0);
  }, [currentTime, duration]);

  return (
    <WithKeplerUI>
      {({LoadingSpinner}) => (
        <div className="loader" style={loaderStyle}>
          <LoadingSpinner />
          <div
            className="rendering-percent"
            style={{color: 'white', position: 'absolute', top: '175px'}}
          >
            {percent} %
          </div>
        </div>
      )}
    </WithKeplerUI>
  );
};

const AutoSizeStage = ({children}) => {
  const dimension = useSelector(dimensionSelector);

  const getMapDimensions = useCallback(
    (availableWidth, availableHeight) => {
      const scale = Math.min(availableWidth / dimension.width, availableHeight / dimension.height);

      return {mapWidth: dimension.width * scale, mapHeight: dimension.height * scale};
    },
    [dimension]
  );

  return (
    <AutoSizer>
      {({width, height}) => {
        const {mapWidth, mapHeight} = getMapDimensions(width, height);
        return children({mapHeight, mapWidth, availableHeight: height, availableWidth: width});
      }}
    </AutoSizer>
  );
};

const StageMapBox = ({height, width, children}) => (
  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width, height}}>
    {children}
  </div>
);

export const Stage = ({}) => {
  const rendererBusy = useSelector(busySelector);
  const duration = useSelector(durationSelector);
  const dispatch = useDispatch();

  const cameraKeyframe = useSelector(cameraKeyframeSelector);
  const getCameraKeyframes = useCallback(() => {
    const camera = new CameraKeyframes(cameraKeyframe);
    return camera;
  }, [cameraKeyframe]);

  const filterKeyframe = useSelector(filterKeyframeSelector);

  const getKeyframes = useCallback(() => {
    const keyframes = {};
    if (filterKeyframe) {
      keyframes.timeFilter = new FilterValueKeyframes(filterKeyframe);
    }
    return keyframes;
  }, [filterKeyframe]);

  const prepareFrame = useCallback(
    scene => {
      // console.log(scene)
      // console.log(scene.keyframes.timeFilter.getFrame())
      if (scene.keyframes.timeFilter) {
        const frame = scene.keyframes.timeFilter.getFrame();
        dispatch(
          setFilter(scene.keyframes.timeFilter.filterId, 'value', [frame.left, frame.right])
        );
      }
    },
    [getKeyframes]
  );

  const handlePreview = useCallback(() => {
    if (rendererBusy === false) {
      dispatch(previewVideo({getCameraKeyframes, getKeyframes}));
    } else {
      dispatch(stopVideo());
    }
  }, [rendererBusy, getCameraKeyframes, getKeyframes]);

  const handleRender = useCallback(() => {
    if (rendererBusy === false) {
      dispatch(renderVideo({getCameraKeyframes, getKeyframes}));
    } else {
      dispatch(stopVideo());
    }
  }, [rendererBusy, getCameraKeyframes, getKeyframes]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{flex: 1, position: 'relative'}}>
        <AutoSizeStage>
          {({mapHeight, mapWidth, availableHeight, availableWidth}) => (
            <StageMapBox width={availableWidth} height={availableHeight}>
              {/* <div style={{width: mapWidth, height: mapHeight, backgroundColor: 'green'}} /> */}
              <StageContainer width={mapWidth} height={mapHeight} prepareFrame={prepareFrame} />
              <StageMapOverlay
                rendererBusy={rendererBusy}
                duration={duration}
                width={availableWidth}
                height={availableHeight}
              />
            </StageMapBox>
          )}
        </AutoSizeStage>
      </div>
      <StageBottomToolbar playing={Boolean(rendererBusy)} onPreview={handlePreview} />
      <button onClick={handleRender}>Render</button>
    </div>
  );
};
