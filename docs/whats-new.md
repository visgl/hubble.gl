# Whats New

## 1.0.1

Initial release.

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