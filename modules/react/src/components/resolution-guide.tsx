// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

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

function Outline({width, height, name}: {width: number; height: number; name: string}) {
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
