// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import React, {useCallback, useEffect, useMemo, useState, type PropsWithChildren} from 'react';
import {DeckAdapter, FormatConfigs, Timecode} from '@hubble.gl/core';
import {styled} from 'styled-components';

import EncoderDropdown from './encoder-dropdown';
import {DownloadVideo} from './icons/index';
import RenderPlayer from './render-player';
import {ENCODERS, type Encoders, WEBM} from './encoders';

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
  max-height: calc(100% - 48px);
`;

const RenderControls = styled.div``;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
`;

const Result = styled.div<{$show?: boolean}>`
  display: ${props => (props.$show ? 'block' : 'none')};
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

const Download = styled.div<{$show?: boolean}>`
  color: blue;
  cursor: pointer;
  padding: 0 8px;
  display: ${props => (props.$show ? 'flex' : 'none')};
`;

const TogglePlayer = styled.div`
  font-family: Helvetica, Arial, sans-serif;
  display: inline-block;
  user-select: none;
  margin: 8px 0;
  text-decoration: underline;
  float: right;
  &:hover {
    color: blue;
  }
`;

type BasicControlsProps = {
  adapter: DeckAdapter;
  busy: boolean;
  setBusy: (busy: boolean) => void;
  formatConfigs: Partial<FormatConfigs>;
  timecode: Timecode;
  embed?: boolean;
  filename?: string;
};

export default function BasicControls({
  children,
  adapter,
  busy,
  setBusy,
  formatConfigs,
  timecode,
  embed = true,
  filename = undefined
}: PropsWithChildren<BasicControlsProps>) {
  const [encoder, setEncoder] = useState<Encoders>(WEBM);
  const [blob, setBlob] = useState<Blob>(undefined);
  const [renderStatus, setRenderStatus] = useState<string>(undefined);
  const [showPlayer, setShowPlayer] = useState(true);

  const renderText = useMemo(() => {
    switch (renderStatus) {
      case 'in-progress':
        return 'Rendering animation...';
      case 'saving':
        return 'Processing render...';
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

  const onSave = useCallback((newBlob: Blob) => {
    setBlob(newBlob);
    setRenderStatus('rendered');
  }, []);

  const onRender = useCallback(() => {
    adapter.render({
      Encoder: ENCODERS[encoder],
      formatConfigs,
      filename,
      timecode,
      onStopped: () => setRenderStatus('saving'),
      onComplete: () => setBusy(false),
      onSave: embed && onSave
    });
    setRenderStatus('in-progress');
    setBusy(true);
  }, [adapter, onSave, encoder, embed, formatConfigs, timecode, filename]);

  const onStop = useCallback(() => {
    adapter.stop({
      onStopped: () => setRenderStatus('saving'),
      onComplete: () => setBusy(false),
      onSave: embed && onSave
    });
  }, [adapter, onSave, embed]);

  return (
    <RenderResult>
      <div>
        <Status>
          <H3>{renderText}</H3>
          <Download
            $show={Boolean(blob)}
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
            <button disabled={!busy || renderStatus === 'saving'} onClick={onStop}>
              Interrupt
            </button>
          </ButtonGroup>
        </RenderControls>
        <Result $show={Boolean(blob)}>
          <TogglePlayer onClick={() => setShowPlayer(!showPlayer)}>
            {showPlayer ? 'Hide Player' : 'Show Player'}
          </TogglePlayer>
          {showPlayer && <RenderPlayer encoder={encoder} blob={blob} />}
        </Result>
        <div style={{marginTop: '8px'}}>{children}</div>
      </div>
    </RenderResult>
  );
}
