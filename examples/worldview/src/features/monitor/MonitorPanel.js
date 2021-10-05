import React, {useMemo, useCallback, useEffect} from 'react';
import {Play, Search, Maximize} from './Icons';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {
  busySelector,
  durationSelector,
  dimensionSelector,
  usePreviewHandler,
  useRenderHandler,
  seekTime
} from '../renderer';
import {AutoSizer} from 'react-virtualized';
import {WithKeplerUI} from '@hubble.gl/react';
import {Map, viewStateSelector} from '../map';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {nearestEven} from '../../utils';
import {framestepSelector, timecodeSelector, resolutionChange} from '../renderer/rendererSlice';
import {timeCursorSelector} from '../timeline/timelineSlice';

const MonitorBottomToolbar = ({playing, onPreview}) => {
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

function basicViewState(viewState = {}) {
  const allowed = ['latitude', 'longitude', 'zoom', 'bearing', 'pitch'];
  return Object.keys(viewState)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = viewState[key];
      return obj;
    }, {});
}

const PrintViewState = ({viewState}) => {
  const str = JSON.stringify(basicViewState(viewState));
  return (
    <div style={{position: 'absolute', bottom: 0, left: 0, background: 'black'}}>
      <CopyToClipboard text={str}>
        <div style={{color: 'pink'}}>{str}</div>
      </CopyToClipboard>
    </div>
  );
};

const MapOverlay = ({rendererBusy, currentTime, duration, width, height}) => {
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

const AutoSizeMapBox = ({children}) => {
  const dimension = useSelector(dimensionSelector);

  const getMapDimensions = useCallback(
    (containerWidth, containerHeight) => {
      const scale = Math.min(containerWidth / dimension.width, containerHeight / dimension.height);

      return {
        mapWidth: nearestEven(dimension.width * scale, 0),
        mapHeight: nearestEven(dimension.height * scale, 0)
      };
    },
    [dimension]
  );

  return (
    <AutoSizer>
      {({width, height}) => {
        const {mapWidth, mapHeight} = getMapDimensions(width, height);
        return children({
          mapHeight,
          mapWidth,
          containerHeight: nearestEven(height, 0),
          containerWidth: nearestEven(width, 0)
        });
      }}
    </AutoSizer>
  );
};

const MapBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

const SeekSlider = () => {
  const timecode = useSelector(timecodeSelector);
  const framestep = useSelector(framestepSelector);
  const timeCursor = useSelector(timeCursorSelector);
  const dispatch = useDispatch();
  useEffect(() => dispatch(seekTime({timeMs: timecode.start})), [timecode.start]);

  return (
    <input
      type="range"
      min={timecode.start}
      max={timecode.end}
      step={framestep}
      value={timeCursor}
      onChange={e => dispatch(seekTime({timeMs: parseInt(e.target.value, 10)}))}
    />
  );
};

const DimensionPicker = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(resolutionChange({width: 1920, height: 1080}))}>1080p</button>
      <button onClick={() => dispatch(resolutionChange({width: 1280, height: 720}))}>720p</button>
      <button onClick={() => dispatch(resolutionChange({width: 320, height: 180}))}>320x180</button>
      <button onClick={() => dispatch(resolutionChange({width: 500, height: 500}))}>500x500</button>
      <button onClick={() => dispatch(resolutionChange({width: 5000, height: 5000}))}>
        5000x5000
      </button>
      <button onClick={() => dispatch(resolutionChange({width: 1000, height: 2000}))}>
        1000x2000
      </button>
      <button onClick={() => dispatch(resolutionChange({width: 2000, height: 1000}))}>
        2000x1000
      </button>
    </div>
  );
};

export const MonitorPanel = ({deckProps = undefined, staticMapProps = undefined}) => {
  const rendererBusy = useSelector(busySelector);
  const duration = useSelector(durationSelector);
  const timeCursor = useSelector(timeCursorSelector);
  const viewState = useSelector(viewStateSelector);
  const onPreview = usePreviewHandler();
  const onRender = useRenderHandler();

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
        <AutoSizeMapBox>
          {({mapHeight, mapWidth, containerHeight, containerWidth}) => (
            <MapBox width={containerWidth} height={containerHeight}>
              {/* <div style={{width: mapWidth, height: mapHeight, backgroundColor: 'green'}} /> */}
              <Map
                width={mapWidth}
                height={mapHeight}
                deckProps={deckProps}
                staticMapProps={staticMapProps}
                debug={true}
              />
              <PrintViewState viewState={viewState} />
              <MapOverlay
                rendererBusy={rendererBusy}
                duration={duration}
                width={containerWidth}
                height={containerHeight}
                currentTime={timeCursor}
              />
            </MapBox>
          )}
        </AutoSizeMapBox>
      </div>
      <MonitorBottomToolbar playing={Boolean(rendererBusy)} onPreview={onPreview} />
      <DimensionPicker />
      <button onClick={onRender}>Render</button>
      <SeekSlider />
    </div>
  );
};
