import React, {useMemo, useCallback} from 'react';
import {Play, Search, Maximize} from './Icons';
import {useSelector} from 'react-redux';
import {
  busySelector,
  durationSelector,
  dimensionSelector,
  usePreviewHandler,
  useRenderHandler
} from '../renderer';
import {AutoSizer} from 'react-virtualized';
import {WithKeplerUI} from '@hubble.gl/react';
import {useCameraKeyframes, useCameraFrame, usePrepareFrame} from '../timeline/hooks';
import {Map, viewStateSelector} from '../map';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {nearestEven} from '../../utils';

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

const AutoSizeStage = ({children}) => {
  const dimension = useSelector(dimensionSelector);

  const getMapDimensions = useCallback(
    (availableWidth, availableHeight) => {
      const scale = Math.min(availableWidth / dimension.width, availableHeight / dimension.height);

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
          availableHeight: nearestEven(height, 0),
          availableWidth: nearestEven(width, 0)
        });
      }}
    </AutoSizer>
  );
};

const MapBox = ({height, width, children}) => (
  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width, height}}>
    {children}
  </div>
);

export const MonitorPanel = ({
  getCameraKeyframes = undefined,
  getKeyframes,
  deckProps = undefined,
  staticMapProps = undefined
}) => {
  const rendererBusy = useSelector(busySelector);
  const duration = useSelector(durationSelector);
  const viewState = useSelector(viewStateSelector);

  if (!getCameraKeyframes) {
    getCameraKeyframes = useCameraKeyframes();
  }

  useCameraFrame();
  const prepareFrame = usePrepareFrame();
  const onPreview = usePreviewHandler({getCameraKeyframes, getKeyframes});
  const onRender = useRenderHandler({getCameraKeyframes, getKeyframes});

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
            <MapBox width={availableWidth} height={availableHeight}>
              {/* <div style={{width: mapWidth, height: mapHeight, backgroundColor: 'green'}} /> */}
              <Map
                width={mapWidth}
                height={mapHeight}
                prepareFrame={prepareFrame}
                deckProps={deckProps}
                staticMapProps={staticMapProps}
              />
              <PrintViewState viewState={viewState} />
              <MapOverlay
                rendererBusy={rendererBusy}
                duration={duration}
                width={availableWidth}
                height={availableHeight}
              />
            </MapBox>
          )}
        </AutoSizeStage>
      </div>
      <MonitorBottomToolbar playing={Boolean(rendererBusy)} onPreview={onPreview} />
      <button onClick={onRender}>Render</button>
    </div>
  );
};
