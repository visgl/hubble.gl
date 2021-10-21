// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useEffect, useMemo, useState} from 'react';

import EncoderDropdown from './encoder-dropdown';
import styled from 'styled-components';
import {DownloadVideo} from './icons';
import RenderPlayer from './render-player';
import {ENCODERS, GIF} from './encoders';

const RenderResult = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  background-color: #fff;
  margin: 24px;
  padding: 10px 24px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  min-width: 300px;
`;

const RenderControls = styled.div`
  max-width: 300px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Result = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  max-width: 500px;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
`;

const H3 = styled.h3`
  font-size: 16px;
  margin: 8px 0;
  font-family: Helvetica, Arial, sans-serif;
`;

const Download = styled.div`
  color: blue;
  cursor: pointer;
  padding: 0 8px;
  display: ${props => (props.show ? 'flex' : 'none')};
`;

export default function BasicControls({
  children,
  adapter,
  busy,
  setBusy,
  formatConfigs,
  timecode,
  embed = true
}) {
  const [encoder, setEncoder] = useState(GIF);
  const [blob, setBlob] = useState(undefined);
  const [renderStatus, setRenderStatus] = useState(undefined);

  const renderText = useMemo(() => {
    switch (renderStatus) {
      case 'in-progress':
        return 'Rendering animation...';
      case 'saving':
        return 'Saving render...';
      case 'rendered':
        return 'Render complete!';
      default:
        return 'Renderer idle...';
    }
  }, [renderStatus]);

  useEffect(() => {
    // reset result UI when encoder changes.
    setBlob(undefined);
    setRenderStatus(undefined);
  }, [encoder]);

  const onSave = newBlob => {
    setBlob(newBlob);
    setRenderStatus('rendered');
  };

  const onRender = () => {
    adapter.render({
      Encoder: ENCODERS[encoder],
      formatConfigs,
      timecode,
      onStopped: () => setRenderStatus('saving'),
      onComplete: () => setBusy(false),
      onSave: embed && onSave
    });
    setRenderStatus('in-progress');
    setBusy(true);
  };

  const onStop = () => {
    adapter.stop({
      onStopped: () => setRenderStatus('saving'),
      onComplete: () => setBusy(false),
      onSave: embed && onSave
    });
  };

  return (
    <RenderResult>
      <Status>
        <H3>{renderText}</H3>
        <Download
          show={blob}
          title="Download"
          onClick={() => {
            adapter.videoCapture.download(blob);
          }}
        >
          <DownloadVideo height="18px" />
        </Download>
      </Status>
      <RenderControls>
        <EncoderDropdown disabled={busy} encoder={encoder} setEncoder={setEncoder} />
        <ButtonGroup>
          <button disabled={busy} onClick={onRender}>
            Render
          </button>
          <button disabled={!busy} onClick={onStop}>
            Stop
          </button>
        </ButtonGroup>
      </RenderControls>
      <Result show={blob}>
        <RenderPlayer encoder={encoder} blob={blob} />
      </Result>
      <div style={{marginTop: '8px'}}>{children}</div>
    </RenderResult>
  );
}
