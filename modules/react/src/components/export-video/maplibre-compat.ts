// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/**
 * MapLibre v5 turned the camera properties of a transform into getters and moved
 * mutation to `setZoom()`, `setBearing()`, `setPitch()`, `setCenter()` and
 * `setPadding()`. react-map-gl v7, which the export panel preview uses, still
 * assigns those properties directly in `applyViewStateToTransform()`, so every
 * preview running on MapLibre v5 throws.
 *
 * These helpers restore assignment semantics on the transform prototype, which
 * also covers the render transform react-map-gl clones from `map.transform`.
 * They are a no-op for MapLibre v4 and older and for Mapbox GL, whose transform
 * properties are still writable.
 */

type MapLibModule = Record<string, any>;

const TRANSFORM_SETTERS: ReadonlyArray<readonly [string, string]> = [
  ['zoom', 'setZoom'],
  ['bearing', 'setBearing'],
  ['pitch', 'setPitch'],
  ['padding', 'setPadding'],
  ['center', 'setCenter']
];

const PATCHED_FLAG = '__hubbleMaplibreV5Compat';

const patchedModules = new WeakMap<object, MapLibModule>();
const compatMapLibs = new WeakMap<object, MapLibModule | Promise<MapLibModule>>();

function getMapLibrary(module: MapLibModule): any {
  if (!module) return undefined;
  return 'Map' in module ? module : module.default;
}

function getMajorVersion(mapLib: any): number {
  const version = typeof mapLib?.getVersion === 'function' ? mapLib.getVersion() : mapLib?.version;
  const major = parseInt(String(version ?? ''), 10);
  return Number.isNaN(major) ? -1 : major;
}

function findPropertyDescriptor(object: any, property: string): PropertyDescriptor | undefined {
  let current = object;
  while (current) {
    const descriptor = Object.getOwnPropertyDescriptor(current, property);
    if (descriptor) return descriptor;
    current = Object.getPrototypeOf(current);
  }
  return undefined;
}

/** True when the map library is MapLibre v5 or newer. Mapbox GL is always older. */
export function isMaplibreV5(mapLib: any): boolean {
  const library = getMapLibrary(mapLib);
  return typeof library?.Map === 'function' && getMajorVersion(library) >= 5;
}

/** Restore writable camera properties on a MapLibre v5 transform prototype. */
export function patchMaplibreV5Transform(transform: any): void {
  if (!transform) return;

  const prototype = Object.getPrototypeOf(transform);
  if (!prototype || prototype[PATCHED_FLAG]) return;

  for (const [property, setter] of TRANSFORM_SETTERS) {
    const descriptor = findPropertyDescriptor(prototype, property);
    // MapLibre v4 and Mapbox GL already define setters; leave them alone.
    if (descriptor?.set || typeof transform[setter] !== 'function') continue;

    Object.defineProperty(prototype, property, {
      get: descriptor?.get,
      set(value) {
        this[setter](value);
      },
      enumerable: descriptor?.enumerable ?? false,
      configurable: true
    });
  }

  // react-map-gl copies this property onto the render transform it clones.
  const pixelsToGLUnits = findPropertyDescriptor(prototype, 'pixelsToGLUnits');
  if (pixelsToGLUnits && !pixelsToGLUnits.set) {
    Object.defineProperty(prototype, 'pixelsToGLUnits', {
      get: pixelsToGLUnits.get,
      set() {},
      enumerable: pixelsToGLUnits.enumerable ?? false,
      configurable: true
    });
  }

  Object.defineProperty(prototype, PATCHED_FLAG, {value: true, configurable: true});
}

/**
 * Wrap a MapLibre v5 module so map instances patch their transform on
 * construction. Other map libraries are returned unchanged.
 */
export function patchMaplibreV5Module(mapLib: MapLibModule): MapLibModule {
  if (!mapLib || !isMaplibreV5(mapLib)) return mapLib;

  const cached = patchedModules.get(mapLib);
  if (cached) return cached;

  const library = getMapLibrary(mapLib);
  class HubbleMaplibreV5Map extends library.Map {
    constructor(...args: any[]) {
      super(...args);
      patchMaplibreV5Transform((this as any).transform);
    }
  }

  const patchedLibrary = {...library, Map: HubbleMaplibreV5Map};
  // react-map-gl resolves either the module namespace or its default export.
  const patched =
    'Map' in mapLib ? {...mapLib, ...patchedLibrary} : {...mapLib, default: patchedLibrary};
  patchedModules.set(mapLib, patched);
  return patched;
}

/** Apply the MapLibre v5 compatibility patch to a preview's `mapProps`. */
export function withMaplibreV5Compat<T extends {mapLib?: any}>(mapProps: T): T {
  const mapLib = mapProps?.mapLib;
  if (!mapLib) return mapProps;

  let compatMapLib = compatMapLibs.get(mapLib);
  if (!compatMapLib) {
    compatMapLib =
      typeof mapLib.then === 'function'
        ? mapLib.then(patchMaplibreV5Module)
        : patchMaplibreV5Module(mapLib);
    compatMapLibs.set(mapLib, compatMapLib);
  }

  return {...mapProps, mapLib: compatMapLib};
}
