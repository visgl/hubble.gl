# RFC: Integration - Simple Video Export - Trip Layers in Kepler.gl

* Authors: Chris Gervang
* Date: May, 2020
* Status: **Draft**

## Features

- Simple video export of the trips layer animations recently shipped in kepler.gl
- Video export settings to modify resolution, quality, framerate, etc.
- (stretch goal) Option to add a black or white timestamp watermark onto the video.

## Technical Milestones

- Establish how the hubble.gl integration in kepler.gl will look.
  - Kepler.gl core to import a @hubble.gl/kepler package, tree shaken to reduce footprint.
  - Hubble.gl to contain the generic UI components and encoders, so they can be reused by other applications.
  - Changes to kepler.gl are limited to whatever is necessary for integration - we’ll review changes on a case by case basis.
  - Opens to the door to more integrations in the future! (Like GIF and camera animation!)

## Hubble.gl Additions

### Core Library

We will make additions to the `hubble.gl/core` to integrate between the core library classes and kepler.gl.

- Kepler Adapter
  - We'll need some way to hook hubble.gl into the rendering life cycle of kepler. We may be able to use the DeckAdapter directly with some modifications or create a KeplerAdapter to account for incompatible edge cases.
- Kepler Scene
  - In addition to deck.gl `layers`, kepler adds support for data `filters` in animation scenes.
- Kepler Keyframes
- [Team to determine additional tasks, as necessary]

### React Components

All of these components are new. They will use styled-components with theme properties that match kepler.gl names. Ideally, they work standalone in the in the `@hubble.gl/react` package, and either integrated with kepler in `@hubble.gl/kepler` or `kepler.gl` directly.

- Render Settings Panel
  - React state temporary for user modifications (allows “cancel” feature)
- Video Playback Panel
  - In-browser video player of in-memory video data.
- Render Progress Panel
  - Would like to reuse the “progress” bar from Kepler.gl’s animation-control.
- Video Renderer
  - A wrapper component (or hook? or class?) to facilitate the frame-by-frame rendering lifecycle necessary.
- Timestamp Watermark
  - Based on floating-time-display. Will try to use dom-to-img utility.
  - Risk: Fusing the canvas and dom images may not be easy, or performant. Alternatively we could try the deck.gl TextLayer.

### Redux Store

We will extend the existing redux store to service the UI states. This conceptually breaks down what will be implemented in action creators, reducers, and selectors.

#### Store/Reducer

- Export Flow Steps
  - Step 0: Idle
  - Step 1: Rendering
    - UI clicks disabled, except for the cancel button.
    - Canvas in “Record Mode”.
    - Rendering progress panel open.
    - Trip Layer Playback (animation-control) panel closed.
  - Step 2: Complete (Video Playback & Download)
    - UI enabled.
- Export Settings
  - UI State: Open / Closed
  - Video Settings
    - Filename
    - Resolution
    - Framerate
    - Format
  - Timestamp Watermark
    - Color, Position
  - Rendering Progress
    - Current Frame (or %?)
    - Total Frames
  - Video Data
  - Scenes Data
    - Layers (one for now)
      - Keyframes
    - Total Duration

#### Actions

- Settings
  - openSettings: ()
  - saveSettings: (settings)
  - closeSettings: ()
- Animation
  - setScene: (sceneData)
- Render
  - startRender: ()
  - cancelRender: ()
  - completeRender: ()
  - setFrame: (frame)
- Playback Panel
  - openPlaybackPanel: ()
  - closePlaybackPanel: ()
- Download Video
  - download: ()

#### Open Implementation Question:

- Q: Anything special I should do while exporting the reducer, so that it’s easily imported by kepler.gl?
  - A: Flatten it into 1 reducer would make it easier to import
- Q: How should I name the action string so that they don’t collide with any other actions?

### Kepler.gl Changes

#### Imports

Public exports from @hubble.gl/kepler.

@hubble.gl/kepler

- components
  - RenderSettingsPanel
  - RenderingProgressPanel
  - VideoPlaybackPanel
- reducer
  - hubblegl
- actions
  - startRender
  - openSettings
- Rendering classes - this may be wrapped into a react component or redux middleware.

#### Animation Control

Addition of Settings and Export (assume everything else will still match production version)

- Video Export Button Component
  - This button will activate the “Record Mode” by dispatching “Set Scene” & “Start Render”
- Video Settings Button Component
  - This button will open the Video Settings Panel by dispatching “Open Settings”

#### Integrations

- Rendering Progress Panel
- Video Playback Panel, which will be the last stage of the feature. Download and playback video.
- Hubble.gl Store, which will control which UI panels are open, their states, and the rendered video data.

#### Map Container Component

- Update to newer react-map-gl StaticMap / deck.gl component, so that it is compatible with deck.gl/mapbox.
- “Record Mode” react render function
  - Fuse the mapbox and deck.gl canvas in the dom using deck.gl/mapbox, so they can be encoded.
  - Set the canvas resolution.
  - Disable Kepler UI, except for the cancel button.

Open Implementation Question:

1. Will modifying the existing kepler.gl map component be feasible?
2. Or, does record mode need to be a new MapComponent injected?
3. Or, does the existing map component need to wrapped?
