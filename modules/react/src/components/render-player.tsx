// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import React, {useEffect, useState} from 'react';
import {parse} from '@loaders.gl/core';
import {ZipLoader} from '@loaders.gl/zip';
import styled from 'styled-components';
import {type Encoders, GIF, JPEG, PNG, WEBM} from './encoders';

const parseImages = async (blob: Blob, encoder?: Encoders): Promise<{[name: string]: string}> => {
  const images = await parse(blob, ZipLoader);
  for (const image in images) {
    images[image] = URL.createObjectURL(
      new Blob([images[image]], {type: encoder === JPEG ? 'image/jpeg' : 'image/png'})
    );
  }
  return images;
};

const VideoPlayer = styled.video`
  margin: 8px 0;
  width: 100%;
`;

const GifPlayer = styled.img`
  margin: 8px 0;
  width: 100%;
`;

const ScrollBox = styled.div`
  width: 500px;
  height: 400px;
  position: relative;
  overflow: auto;
  margin: 8px 0;
`;

const ImageGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Thumbnail = styled.img`
  width: 64px;
`;

export default function RenderPlayer({encoder, blob}: {encoder: Encoders, blob?: Blob}) {
  const [src, setSrc] = useState('');
  const [gallery, setGallery] = useState<{[name: string]: string}>({});

  useEffect(() => {
    setSrc('');
  }, [encoder]);

  useEffect(() => {
    if (blob) {
      switch (encoder) {
        case GIF:
        case WEBM: {
          setSrc(URL.createObjectURL(blob));
          break;
        }
        case PNG:
        case JPEG: {
          if (blob.type === 'application/zip') {
            parseImages(blob).then(setGallery);
          }
          break;
        }
        default: {
          break;
        }
      }
    } else {
      setSrc('');
      setGallery({});
    }
  }, [blob]);

  switch (encoder) {
    case WEBM: {
      return <VideoPlayer src={src} controls={true} autoPlay={true} />;
    }
    case GIF: {
      return <GifPlayer src={src} />;
    }
    case PNG:
    case JPEG: {
      return (
        <ScrollBox>
          <div style={{position: 'absolute'}}>
            <ImageGallery>
              {Object.entries(gallery).map(([name, value]) => {
                return <Thumbnail key={name} src={value} title={name} />;
              })}
            </ImageGallery>
          </div>
        </ScrollBox>
      );
    }
    default: {
      return null;
    }
  }
}
