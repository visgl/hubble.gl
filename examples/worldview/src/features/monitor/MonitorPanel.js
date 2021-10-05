import React, {useMemo, useEffect} from 'react';
import {Play, Search, Maximize} from './Icons';
import {useDispatch, useSelector} from 'react-redux';
import {
  busySelector,
  durationSelector,
  dimensionSelector,
  usePreviewHandler,
  useRenderHandler,
  seekTime
} from '../renderer';
import {WithKeplerUI} from '@hubble.gl/react';
import {Map, viewStateSelector} from '../map';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {framestepSelector, timecodeSelector} from '../renderer/rendererSlice';
import {timeCursorSelector} from '../timeline/timelineSlice';
import {Pillarbox} from './Pillarbox';

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
    <div style={{background: 'black'}}>
      <CopyToClipboard text={str}>
        <div style={{color: 'pink'}}>{str}</div>
      </CopyToClipboard>
    </div>
  );
};

const RenderStatus = () => {
  const duration = useSelector(durationSelector);
  const timeCursor = useSelector(timeCursorSelector);

  const percent = useMemo(() => {
    return Math.floor((timeCursor / duration) * 100).toFixed(0);
  }, [timeCursor, duration]);

  return (
    <WithKeplerUI>
      {({LoadingSpinner}) => (
        <div>
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

export const MonitorPanel = ({deckProps = undefined, staticMapProps = undefined}) => {
  const rendererBusy = useSelector(busySelector);
  const viewState = useSelector(viewStateSelector);
  const dimension = useSelector(dimensionSelector);
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
        <Pillarbox dimension={dimension} overlay={rendererBusy === 'rendering' && <RenderStatus />}>
          {previewSize => (
            <Map
              previewSize={previewSize}
              deckProps={deckProps}
              staticMapProps={staticMapProps}
              debug={true}
            />
          )}
        </Pillarbox>
      </div>
      <PrintViewState viewState={viewState} />
      <MonitorBottomToolbar playing={Boolean(rendererBusy)} onPreview={onPreview} />
      <button onClick={onRender}>Render</button>
      <SeekSlider />
    </div>
  );
};
