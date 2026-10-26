import test from 'tape-catch';

import {printDuration} from '@hubble.gl/react/components/export-video/utils';
import {
  isMaplibreV5,
  patchMaplibreV5Module,
  withMaplibreV5Compat
} from '@hubble.gl/react/components/export-video/maplibre-compat';

function createMapLib(version: string) {
  class Transform {
    _zoom = 0;
    _bearing = 0;
    _pitch = 0;
    _padding = {top: 0, bottom: 0, left: 0, right: 0};
    _center = {lng: 0, lat: 0};

    get zoom() {
      return this._zoom;
    }
    get bearing() {
      return this._bearing;
    }
    get pitch() {
      return this._pitch;
    }
    get padding() {
      return this._padding;
    }
    get center() {
      return this._center;
    }
    get pixelsToGLUnits() {
      return [1, 1];
    }

    setZoom(value) {
      this._zoom = value;
    }
    setBearing(value) {
      this._bearing = value;
    }
    setPitch(value) {
      this._pitch = value;
    }
    setPadding(value) {
      this._padding = value;
    }
    setCenter(value) {
      this._center = value;
    }

    clone() {
      const clone = new Transform();
      clone._zoom = this._zoom;
      clone._bearing = this._bearing;
      clone._pitch = this._pitch;
      clone._padding = this._padding;
      clone._center = this._center;
      return clone;
    }
  }

  class MapInstance {
    transform = new Transform();
  }

  return {Map: MapInstance, getVersion: () => version};
}

test('isMaplibreV5#detects MapLibre v5 only', t => {
  t.equal(isMaplibreV5(createMapLib('5.24.0')), true, 'maplibre v5');
  t.equal(isMaplibreV5(createMapLib('4.7.1')), false, 'maplibre v4');
  t.equal(isMaplibreV5(createMapLib('3.10.0')), false, 'mapbox v3');
  t.equal(isMaplibreV5(undefined), false, 'missing mapLib');
  t.end();
});

test('patchMaplibreV5Module#restores writable camera properties', t => {
  const mapLib = createMapLib('5.24.0');
  const patched = patchMaplibreV5Module(mapLib);

  t.notEqual(patched.Map, mapLib.Map, 'returns a patched Map class');

  const map = new patched.Map();
  map.transform.zoom = 6;
  map.transform.bearing = 20;
  map.transform.pitch = 45;
  map.transform.padding = {top: 1, bottom: 2, left: 3, right: 4};
  map.transform.center = {lng: 12, lat: 34};
  map.transform.pixelsToGLUnits = [2, -2];

  t.equal(map.transform.zoom, 6, 'zoom setter');
  t.equal(map.transform.bearing, 20, 'bearing setter');
  t.equal(map.transform.pitch, 45, 'pitch setter');
  t.deepEqual(map.transform.padding, {top: 1, bottom: 2, left: 3, right: 4}, 'padding setter');
  t.deepEqual(map.transform.center, {lng: 12, lat: 34}, 'center setter');
  t.deepEqual(map.transform.pixelsToGLUnits, [1, 1], 'pixelsToGLUnits accepts assignments');

  const clone = map.transform.clone();
  clone.zoom = 7;
  clone.bearing = 30;
  t.equal(clone.zoom, 7, 'cloned transform accepts assignments');
  t.equal(clone.bearing, 30, 'cloned transform accepts bearing assignments');

  t.end();
});

test('patchMaplibreV5Module#leaves v4 and mapbox modules untouched', t => {
  const v4 = createMapLib('4.7.1');
  const mapbox = createMapLib('3.10.0');
  t.equal(patchMaplibreV5Module(v4), v4, 'maplibre v4 is unchanged');
  t.equal(patchMaplibreV5Module(mapbox), mapbox, 'mapbox is unchanged');
  t.end();
});

test('withMaplibreV5Compat#patches a promised mapLib', t => {
  const mapLib = createMapLib('5.24.0');
  const mapProps = withMaplibreV5Compat({mapLib: Promise.resolve(mapLib)});

  mapProps.mapLib
    .then(patched => {
      t.notEqual(patched.Map, mapLib.Map, 'promised mapLib is patched');
      t.end();
    })
    .catch(error => {
      t.fail(String(error));
      t.end();
    });
});

test('withMaplibreV5Compat#leaves props without a mapLib untouched', t => {
  const mapProps = {mapStyle: 'https://example.com/style.json'};
  t.equal(withMaplibreV5Compat(mapProps), mapProps, 'returns the same props object');
  t.end();
});

test('printDuration#duration without milli or hour', t => {
  t.equal(printDuration(106050), '01:46');
  t.end();
});

test('printDuration#duration with milli and no hour', t => {
  t.equal(printDuration(106050, true), '01:46.5');
  t.end();
});

test('printDuration#duration with milli and with hour', t => {
  t.equal(printDuration(10605700, true), '02:56:45.7');
  t.end();
});

test('printDuration#duration no milli and with hour', t => {
  t.equal(printDuration(10605700, false), '02:56:45');
  t.end();
});
