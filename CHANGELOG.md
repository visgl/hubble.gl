# Change Log

All notable changes to hubble.gl will be documented in this file.

For a human readable version, visit https://hubble.gl/#/documentation/overview/upgrade-guide

<!--
Each version should:
  List its release date in the above format.
  Group changes to describe their impact on the project, as follows:
  Added for new features.
  Changed for changes in existing functionality.
  Deprecated for once-stable features removed in upcoming releases.
  Removed for deprecated features removed in this release.
  Fixed for any bug fixes.
  Security to invite users to upgrade in case of vulnerabilities.
Ref: http://keepachangelog.com/en/0.3.0/
-->

## hubble.gl v1.4

### hubble.gl v1.4 Prereleases

## hubble.gl v1.3

### hubble.gl v1.3 Prereleases

#### hubble.gl [1.3.0-alpha.6] - Aug 27 2021

- feat(core) File Size Estimation Improvements by @RaymondDashWu in https://github.com/visgl/hubble.gl/pull/143
- feat(react) Modal Refinements Update by @RaymondDashWu in https://github.com/visgl/hubble.gl/pull/144
- enhancement(core) disable static map property by @igorDykhta in https://github.com/visgl/hubble.gl/pull/150
- chore(react) remove redundant mapState updater by @chrisgervang in https://github.com/visgl/hubble.gl/pull/152
- bug(core) time filter idx is expected to be a number by @chrisgervang in https://github.com/visgl/hubble.gl/pull/153

#### hubble.gl [1.3.0-alpha.5] - Aug 2 2021

- chore(core) consolidate copied kepler layer creation code by @chrisgervang in https://github.com/visgl/hubble.gl/pull/138
- chore(core) consolidate form setting props into an object by @chrisgervang in https://github.com/visgl/hubble.gl/pull/139
- bug(react) remove double install of react-intl by @chrisgervang in https://github.com/visgl/hubble.gl/pull/140
- enhancement(react) kepler, memo and return the viewState before/after rendering by @chrisgervang in https://github.com/visgl/hubble.gl/pull/142
- feat(core) support kepler.gl filter animate by interval keyframes by @heshan0131 in https://github.com/visgl/hubble.gl/pull/146
- bug(core) fixed rendering while preview exception by @macrigiuseppe in https://github.com/visgl/hubble.gl/pull/147

#### hubble.gl [1.3.0-alpha.4] - Jul 8 2021

- enhancement(core) use layers from deckProps in createLayers, add mapboxLayerBeforeId prop by @heshan0131 in https://github.com/visgl/hubble.gl/pull/137

#### hubble.gl [1.3.0-alpha.3] - Jul 6 2021

- enhancement(core) Correct zoom scale and bounds in kepler video export by @chrisgervang in https://github.com/visgl/hubble.gl/pull/136

#### hubble.gl [1.3.0-alpha.2] - Jul 1 2021

- enhancement(core) Refine kepler.gl keyframe generation by @chrisgervang in https://github.com/visgl/hubble.gl/pull/135

#### hubble.gl [1.3.0-alpha.1] - Jun 29 2021

- fix(encoders) Copy gif options before assignment. by @chrisgervang in https://github.com/visgl/hubble.gl/pull/113
- refactor(core) Make scene definition synchronous by supplying our own Timeline by @chrisgervang in https://github.com/visgl/hubble.gl/pull/112
- chore(core) remove unnecessary readiness checks by @chrisgervang in https://github.com/visgl/hubble.gl/pull/116
- chore(core) remove width and height from DeckScene by @chrisgervang in https://github.com/visgl/hubble.gl/pull/119
- enhancement(core) split DeckScene keyframes up between layers and camera. by @chrisgervang in https://github.com/visgl/hubble.gl/pull/121
- enhancement(core) new keyframe classes by @chrisgervang in https://github.com/visgl/hubble.gl/pull/125
- enhancement(core) Introducing animation classes by @chrisgervang in https://github.com/visgl/hubble.gl/pull/127
- chore(react) pass deckProps and staticMapProps to ExportVideoPanelContainer by @chrisgervang in https://github.com/visgl/hubble.gl/pull/128
- chore(react) add dimension prop to QuickAnimation by @chrisgervang in https://github.com/visgl/hubble.gl/pull/129
- enhancement(core) Replace DeckScene with AnimationManager by @chrisgervang in https://github.com/visgl/hubble.gl/pull/130

## hubble.gl v1.2

### hubble.gl v1.2 Prereleases

#### hubble.gl [1.2.0-alpha.10] - Jun 10 2021

- feat(core) Add jpegQuality to GIF and default to 1.0 by @chrisgervang in https://github.com/visgl/hubble.gl/pull/74
- feat(core) Use object parameters for functions by @chrisgervang in https://github.com/visgl/hubble.gl/pull/75
- feat(core) Adding flyTo interpolator option to CameraKeyframes by @chrisgervang in https://github.com/visgl/hubble.gl/pull/87
- feat(react) Add more hooks and improve isolation of kepler.gl within components by @chrisgervang in https://github.com/visgl/hubble.gl/pull/88
- feat(react) Adding usePreviewHandler and useRenderHandler hook by @chrisgervang in https://github.com/visgl/hubble.gl/pull/89
- feat(core) Adding extraProps to DeckAdapter by @chrisgervang in https://github.com/visgl/hubble.gl/pull/94
- fix(core) odd dimensions cause encoder issues by @chrisgervang in https://github.com/visgl/hubble.gl/pull/95
- feat(react) Adding PrintViewState for easier camera keyframe creation by @chrisgervang in https://github.com/visgl/hubble.gl/pull/96
- feat(core) seek video and update frame by @chrisgervang in https://github.com/visgl/hubble.gl/pull/98
- feat(react) add tripLayerKeyframe for Kepler Trip Layer support by @chrisgervang in https://github.com/visgl/hubble.gl/pull/101
- feat(react) add SeekSlider UI component to preview animation by @chrisgervang in https://github.com/visgl/hubble.gl/pull/102
- refactor(core) Remove duration, use timecode instead by @chrisgervang in https://github.com/visgl/hubble.gl/pull/104
- refactor(core) Add timecode to examples by @chrisgervang in https://github.com/visgl/hubble.gl/pull/105
- chore(core) rename encoderSettings to formatConfigs by @chrisgervang in https://github.com/visgl/hubble.gl/pull/106
- chore(core) use Timeline instead of AnimationLoop by @chrisgervang in https://github.com/visgl/hubble.gl/pull/107
- chore(core) remove data param from DeckScene by @chrisgervang in https://github.com/visgl/hubble.gl/pull/108

#### hubble.gl [1.2.0-alpha.9] - Apr 11 2021

- feat(react) Use the active map style by @chrisgervang in https://github.com/visgl/hubble.gl/pull/72
- feat(react) Rendering Feedback Refinement by @RaymondDashWu in https://github.com/visgl/hubble.gl/pull/64
- feat(react) Modal tabs separating "Edit" and "Export" by @RaymondDashWu in https://github.com/visgl/hubble.gl/pull/68

#### hubble.gl [1.2.0-alpha.8] - Jan 1 2021

- feat(react) Quick Animation Component by @chrisgervang in https://github.com/visgl/hubble.gl/pull/57
- feat(react) Rendering feedback - Spinner by @RaymondDashWu in https://github.com/visgl/hubble.gl/pull/58

#### hubble.gl [1.2.0-alpha.7] - Dec 16 2020

- feat(core) Simplify camera keyframes setup by @chrisgervang in https://github.com/visgl/hubble.gl/pull/55
- feat(core) Implementing keyframe system for deck.gl layers by @chrisgervang in https://github.com/visgl/hubble.gl/pull/56

#### hubble.gl [1.2.0-alpha.6] - Dec 11 2020

- feat(core) Add optional to DeckAdapter glContext for test-utils. by @chrisgervang in https://github.com/visgl/hubble.gl/pull/52

#### hubble.gl [1.2.0-alpha.5] - Dec 7 2020

- fix(react) Remove kepler.gl recursive includes by @unconed in https://github.com/visgl/hubble.gl/pull/51

#### hubble.gl [1.2.0-alpha.4] - Dec 7 2020

- chore(react) Simplify derived react state + cleanup by @unconed in https://github.com/visgl/hubble.gl/pull/48
- chore(react) Kepler.GL integration tweaks by @unconed in https://github.com/visgl/hubble.gl/pull/49

#### hubble.gl [1.2.0-alpha.3] - Dec 4 2020

- chore(react) Removing Forked Kepler Code, Instead Hoisted Dep by @chrisgervang in https://github.com/visgl/hubble.gl/pull/45
- feat(react) Modal now uses Mapbox, creation of duration sliders, and more resolution options by @RaymondDashWu in https://github.com/visgl/hubble.gl/pull/47

#### hubble.gl [1.2.0-alpha.2] - Nov 18 2020

- feat(react) Kepler.gl UI Integration by @chrisgervang in https://github.com/visgl/hubble.gl/pull/34

## hubble.gl v1.1

### hubble.gl v1.1 Prereleases

#### hubble.gl [1.1.0-alpha.5] - Sep 11 2020

#### hubble.gl [1.1.0-alpha.4] - Jul 13 2020

- feat(react) Adding a ResolutionGuide component. by @chrisgervang in https://github.com/visgl/hubble.gl/pull/17

#### hubble.gl [1.1.0-alpha.3] - Jul 13 2020

- feat(core) Improve App Integration: Make Camera and Layers Optional in a DeckScene by @chrisgervang in https://github.com/visgl/hubble.gl/pull/15

#### hubble.gl [1.1.0-alpha.2] - Jun 11 2020

- fix(core) Filename (or any setting) wasn't refreshed between renders. by @chrisgervang in https://github.com/visgl/hubble.gl/pull/9

#### hubble.gl [1.1.0-alpha.1] - Jun 7 2020

- feat(core) Refactor encoder settings and scene settings api by @chrisgervang in https://github.com/visgl/hubble.gl/pull/8
- feat(core) Gif Encoder by @chrisgervang in https://github.com/visgl/hubble.gl/pull/7

## hubble.gl v1.0

### hubble.gl v1.0 Prereleases

#### hubble.gl [1.0.2-alpha.2] - Jun 6 2020

#### hubble.gl [1.0.2-alpha.1] - Jun 6 2020

#### hubble.gl [1.0.2-alpha.0] - Jun 6 2020

#### hubble.gl [1.0.1-alpha.0] - May 13 2020
