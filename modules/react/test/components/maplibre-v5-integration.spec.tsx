import React from 'react';
import test from 'tape-catch';
import {createRoot} from 'react-dom/client';
import ReactMapGL, {type MapRef} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import {withMaplibreV5Compat} from '@hubble.gl/react/components/export-video/maplibre-compat';

const EMPTY_STYLE = {version: 8 as const, sources: {}, layers: []};

function waitFor(predicate: () => any, timeoutMs = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const tick = () => {
      let value;
      try {
        value = predicate();
      } catch (error) {
        reject(error);
        return;
      }
      if (value) {
        resolve(value);
      } else if (Date.now() - startedAt > timeoutMs) {
        reject(new Error('timed out waiting for the map'));
      } else {
        setTimeout(tick, 50);
      }
    };
    tick();
  });
}

test('ExportVideoPanelPreview#maplibre v5 accepts view state updates', t => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) {
    t.skip('WebGL is not available');
    t.end();
    return;
  }

  const container = document.createElement('div');
  container.style.width = '200px';
  container.style.height = '200px';
  document.body.appendChild(container);

  const mapRef = React.createRef<MapRef>();
  const root = createRoot(container);
  const mapProps = withMaplibreV5Compat({mapLib: maplibregl});

  const render = (longitude: number, latitude: number, zoom: number) =>
    root.render(
      <ReactMapGL
        ref={mapRef}
        {...mapProps}
        mapStyle={EMPTY_STYLE}
        longitude={longitude}
        latitude={latitude}
        zoom={zoom}
        style={{width: 200, height: 200}}
      />
    );

  render(0, 0, 2);

  waitFor(() => mapRef.current?.getMap())
    .then(map => {
      render(10, 20, 3);
      return waitFor(() => map.getZoom() === 3).then(() => map);
    })
    .then(map => {
      t.equal(map.getZoom(), 3, 'zoom was applied');
      t.equal(map.getCenter().lng, 10, 'longitude was applied');
      t.equal(map.getCenter().lat, 20, 'latitude was applied');
    })
    .catch(error => {
      t.fail(String(error));
    })
    .then(() => {
      root.unmount();
      container.remove();
      t.end();
    });
});
