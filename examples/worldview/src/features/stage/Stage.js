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
import {CameraKeyframes, FilterValueKeyframes, Keyframes} from '@hubble.gl/core';
import {
  cameraKeyframeSelector,
  filterKeyframeSelector,
  layerKeyframeSelector
} from '../timeline/timelineSlice';
import {setFilter, layerVisConfigChange} from 'kepler.gl/actions';
import {updateViewState} from './mapSlice';

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
  const layerKeyframe = useSelector(layerKeyframeSelector);

  const keplerLayers = useSelector(
    state => state.keplerGl.map && state.keplerGl.map.visState.layers
  );

  const getKeyframes = useCallback(() => {
    let keyframes = {};

    if (Object.keys(layerKeyframe).length > 0) {
      keyframes = Object.entries(layerKeyframe).reduce((acc, [key, value]) => {
        const matchedLayer = keplerLayers.find(layer => layer.config.label === value.label);
        if (matchedLayer) {
          // console.log("Matched!", matchedLayer)
          const features = Object.keys(matchedLayer.config.visConfig);
          acc[key] = new Keyframes({...value, features});
        }
        return acc;
      }, keyframes);
    }

    // console.log(keyframes, keplerLayers);

    if (filterKeyframe) {
      keyframes.hubble_timeFilter = new FilterValueKeyframes(filterKeyframe);
    }
    return keyframes;
  }, [filterKeyframe, layerKeyframe]);

  const getFilters = useCallback(
    scene => {
      // console.log(scene)
      // console.log(scene.keyframes.timeFilter.getFrame())

      // Filter Frame
      if (scene.keyframes.hubble_timeFilter) {
        const frame = scene.keyframes.hubble_timeFilter.getFrame();
        dispatch(
          setFilter(scene.keyframes.hubble_timeFilter.filterId, 'value', [frame.left, frame.right])
        );
      }

      // Vis Config Frame
      keplerLayers.forEach(layer => {
        const keyframe = scene.keyframes[layer.config.label];
        if (keyframe) {
          // console.log(layer)
          const frame = keyframe.getFrame();
          // console.log(frame)
          dispatch(layerVisConfigChange(layer, frame));
        }
      });

      // Map State
      dispatch(updateViewState(scene.keyframes.camera.getFrame()));
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
              <StageContainer width={mapWidth} height={mapHeight} getFilters={getFilters} />
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
