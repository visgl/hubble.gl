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

import React, {useState} from 'react';
import {
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GifEncoder
} from '@hubble.gl/core';
import EncoderDropdown from './encoder-dropdown';

const ENCODERS = {
  preview: PreviewEncoder,
  gif: GifEncoder,
  webm: WebMEncoder,
  jpeg: JPEGSequenceEncoder,
  png: PNGSequenceEncoder
};

export default function BasicControls({adapter, busy, setBusy, formatConfigs, timecode}) {
  const [encoder, setEncoder] = useState('gif');

  const onRender = () => {
    adapter.render({
      Encoder: ENCODERS[encoder],
      formatConfigs,
      timecode,
      onComplete: () => setBusy(false)
    });

    setBusy(true);
  };

  const onStop = () => {
    adapter.stop({onComplete: () => setBusy(false)});
  };

  return (
    <div>
      <EncoderDropdown disabled={busy} encoder={encoder} setEncoder={setEncoder} />
      <button disabled={busy} onClick={onRender}>
        Render
      </button>
      <button onClick={onStop}>Stop</button>
    </div>
  );
}
