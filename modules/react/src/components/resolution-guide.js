// Copyright (c) 2020 Uber Technologies, Inc.
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

import React from 'react';

export default function ResolutionGuide() {
  return (
    <div style={{position: 'relative'}}>
      <Outline width={2560} height={1440} name={'2160p, 2K'} />
      <Outline width={2560} height={1440} name={'1440p'} />
      <Outline width={1920} height={1080} name={'1080p, Full HD'} />
      <Outline width={1280} height={720} name={'720p, HD'} />
      <Outline width={854} height={480} name={'480p, WSD'} />
      <Outline width={640} height={480} name={'480p, SD'} />
      <Outline width={640} height={360} name={'360p'} />
      <Outline width={426} height={240} name={'240p'} />
    </div>
  );
}

function Outline({width, height, name}) {
  return (
    <div style={{position: 'absolute', width, height, outline: '2px dashed black'}}>
      <div
        style={{
          position: 'absolute',
          bottom: -20,
          right: 0,
          fontSize: '14px',
          font: "normal 14px/20px 'Uber Move',Helvetica,Arial,sans-serif"
        }}
      >
        {name} ({width} x {height})
      </div>
    </div>
  );
}
