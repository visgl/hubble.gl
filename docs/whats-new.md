# Whats New

## 1.4.0

This release focuses on improved deck.gl compatibility, and package maintainability.

### Fixed

- [#286](https://github.com/visgl/hubble.gl/pull/286) Improved compatibility up to deck.gl 8.9, react 18.0, react-map-gl 7.1, and kepler.gl 3.1.

### Added

- [#269](https://github.com/visgl/hubble.gl/pull/269) library is now authored in TypeScript and publishes official types.

### Changed

- [#288](https://github.com/visgl/hubble.gl/pull/288) Hubble.gl now expects users to use an interleaved `MapboxOverlay` instead of the now deprecated `MapboxLayer` class in `@deck.gl/mapbox`.

## 1.3.0

This release introduces a new decoupled animation manager, and refactors Please review API reference and examples before upgrading.

### Fixed

- [#113](https://github.com/visgl/hubble.gl/pull/113) encoders - gif options can be read-only
- [#147](https://github.com/visgl/hubble.gl/pull/147) kepler - fixed rendering while preview exception
- [#163](https://github.com/visgl/hubble.gl/pull/163) kepler - blank layer when no deck layers
- [#177](https://github.com/visgl/hubble.gl/pull/177) kepler - match 3d perspective in video export
- [#95](https://github.com/visgl/hubble.gl/pull/95) worldview - odd dimensions cause encoder issues

### Added

- [#98](https://github.com/visgl/hubble.gl/pull/98) Add `seek` method to DeckAdapter.
- [#125](https://github.com/visgl/hubble.gl/pull/125) Added new Keyframe classes.
  - `Keyframes.set` to update keyframe values without reconstructing and re-attaching to timeline.
  - `DeckLayerKeyframes`
  - `KeplerLayerKeyframes`
  - `KeplerFilterKeyframes`
  - `KeplerTripKeyframes`
- [#127](https://github.com/visgl/hubble.gl/pull/127) Added `Animation` to manage keyframes and drawing a frame.
  - `DeckAnimation`
  - `KeplerAnimation`
- [#130](https://github.com/visgl/hubble.gl/pull/130) Added `AnimationManager` to replace `DeckScene`
  - Manages a `Timeline` and attaching animations.

#### React

- [#130](https://github.com/visgl/hubble.gl/pull/130) `useDeckAdapter` hook for better react integration.
- Numerous improvements to kepler.gl support.
  - [#144](https://github.com/visgl/hubble.gl/pull/144) UI Modal Refinements. Thank you @RaymondDashWu!
  - [#146](https://github.com/visgl/hubble.gl/pull/146) support kepler.gl filter animate by interval keyframes
  - [#182](https://github.com/visgl/hubble.gl/pull/182) default filename prop
  - [#183](https://github.com/visgl/hubble.gl/pull/183) stop button and disable settings when previewing or rendering


### Changed

- [#161](https://github.com/visgl/hubble.gl/pull/161) `DeckAdapter` now waits for async deck.gl layers to finish loading before rendering a frame.
  - Check out the terrain example to see this in action!
- `DeckAdapter` has breaking changes for existing applications.
  - [#112](https://github.com/visgl/hubble.gl/pull/112)
  - [#119](https://github.com/visgl/hubble.gl/pull/119)
- [#106](https://github.com/visgl/hubble.gl/pull/106) renamed `encoderSettings` to `formatConfigs`
- [#175](https://github.com/visgl/hubble.gl/pull/175) renamed `dimension` to `resolution`

### Removed

- Removed `DeskScene` (replaced by `AnimationManager` and `Animation` classes).
- Removed Keyframe classes.
  - `LayerKeyframes` (replaced by `DeckLayerKeyframes`)
  - `FilterValueKeyframes`
  - `GridLayerKeyframes`
  - `ScatterPlotLayerKeyframes`

## 1.2.0

### Added

- Automatic animation attachment, [see example](https://github.com/uber/hubble.gl/compare/v1.1.0...master#diff-0b5ca119d2be595aa307d34512d9679e49186307ef94201e4b3dfa079aa89938L54).
- `DeckScene`
  - Added `initialKeyframes` parameter on `DeckScene`. Initializes keyframes prior to first render.
  - Provide dynamic keyframes via `DeckAdapter.render({getCameraKeyframes, getKeyframes})` accessors.
    - `DeckScene.setKeyframes` may also be used to register new keyframes.
- `DeckAdapter`
  - `DeckAdapter.seek` added to enable previewing any specific frame while paused.
  - DeckAdapter glContext parameter added to support browser testing.
  - `DeckAdapter.getProps({extraProps})` added to inject additional deck props without interfering with Hubble.
  - `DeckAdapter.getProps({getLayers})` added for when it’s necessary to access keyframes for animated layers.
    - getLayers: `(scene) => layers[]`
- `CameraKeyframes` now supports `flyTo` interpolation.
  - `new CameraKeyframes({interpolators: 'flyTo'})`
- `GifEncoder` defaults tuned to increase quality and reduce size.

#### React
- Kepler UI component injection [hooks and providers](https://github.com/uber/hubble.gl/blob/a821066de6aa24ed747609b3c0b71dfcc17d27b3/modules/react/src/components/inject-kepler.js). This enables 3rd party libraries integrated with Kepler.gl to inject components provided by Kepler without circularly depending on Kepler.

#### Examples

- [Quick start example](https://github.com/uber/hubble.gl/blob/a821066de6aa24ed747609b3c0b71dfcc17d27b3/examples/quick-start/app.js)
  - Read how to wrap deck.gl with a recorder in this [before](https://github.com/uber/hubble.gl/blob/a821066de6aa24ed747609b3c0b71dfcc17d27b3/examples/quick-start/quick-start-before.js) and [after](https://github.com/uber/hubble.gl/blob/a821066de6aa24ed747609b3c0b71dfcc17d27b3/examples/quick-start/quick-start-after.js).
- [Kepler.gl integration example](https://github.com/uber/hubble.gl/tree/master/examples/kepler-integration)
- [Worldview example](https://github.com/uber/hubble.gl/tree/master/examples/worldview) is a web app you can use to create fully customizable animated map videos in seconds without any installation or expensive server processing by utilizing hubble.gl.

### Removed

- Removed `DeckScene` construcor parameters:
  - `data` removed. Instead users should manage their data loading on their own.
  - `lengthMs` removed. Instead provide timecode parameter to `DeckAdapter.render`.
  - `currentCamera` removed. Instead manage `viewState` externally and set camera keyframes with `DeckScene.setCameraKeyframes`.
  - `animationLoop` removed. Instead provide a luma.gl `timeline`.
  - `renderLayers` removed. Instead either directly supply deckgl with layers, or provide a getLayers accessor, `DeckAdapter.getProps({getLayers})`, when it’s necessary to access keyframes for animated layers.
  - `keyframes` removed. Instead they can be initialized with `initialKeyframes` parameter and updated with `setKeyframes`, and `setCameraKeyframes` methods.
- `Encoder` base class removed. Use `FrameEncoder` instead.
- `DeckAdapter.preview` removed. Use `DeckAdapter.render({Encoder: PreviewEncoder})` instead.

### Changed
- `DeckAdapter.render`, `DeckAdapter.getProps`, and `DeckScene` constructor expect object wrapped parameters now.
- `DeckAdapter.render({encoderSettings})` is now split up into three objects:
    - `formatConfigs`, to config settings for specific formats (I.e. jpeg quality)
    - `timecode`, to specify render start and end times as well as framerate.
    - `filename`, to specify the file name when rendering to a downloaded file.

### Deprecations
- Frame definition pattern in [frame.js](https://github.com/uber/hubble.gl/blob/a821066de6aa24ed747609b3c0b71dfcc17d27b3/modules/core/src/keyframes/frame.js) should no longer be used. Will be removed in next release.
- `Keyframes.setActiveKeyframes` is now private `Keyframes._setActiveKeyframes`, and should not be used.

## 1.1.0

- Encoders are constructed right before rendering starts, instead of only when a scene is defined. [#1](https://github.com/uber/hubble.gl/pull/1)
- DeckAdapter.render now accepts a onStop callback.
- Remove stop and dispose from FrameEncoders [#3](https://github.com/uber/hubble.gl/pull/3)
- Allow PNGEncoder transparent frames [#4](https://github.com/uber/hubble.gl/pull/4)
- Refactor encoder settings and scene settings api [#8](https://github.com/uber/hubble.gl/pull/8)
  - scene settings are defined at scene load time, so you can set scene resolution and animation length there.
  - encoder settings are defined before every render, so you can set seek options there.
  - format-specific encoder settings are namespaced by encoder (`jpeg` settings are under `jpeg`, etc..).
- Gif Encoder [#7](https://github.com/uber/hubble.gl/pull/7)

## 1.0.1

Initial release.