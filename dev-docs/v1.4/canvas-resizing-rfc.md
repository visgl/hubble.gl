# RFC: Sizing Canvas for Optimal UI and Rendering Experience

* Authors: Chris Gervang
* Date: Oct, 2021
* Status: **Implemented**

## Motivation

A video generation component like hubble.gl needs to control canvas sizes because the map visualization libraries (e.g. luma.gl and mapbox-gl-js) couple viewport bounds and WebGL contexts / framebuffers with browser canvas external and internal size attributes, respectivly. If they had support for setting viewport size and a custom framebuffer, hubble.gl could directly set these - but they do not all support this.

Patching the libraries would be considerable effort since Hubble.gl utilize features from multiple map libraries, such as basemaps and visualization layers.

## Requirements

1. The rendering canvas internal size matches the user defined resolution (and can be modified by the user during runtime).
2. The rendering canvas element is scaled to fit in the user interface (and can re-scale when the user resizes the interface).
3. The map viewport boundaries shouldn't perceptually change when resolution changes or when the user resizes the map.

## Existing Problem

Our existing implementation satisfies `2.`, intermittently satifies `1.`, and always fails `3.`. As shown in this video demo:

https://user-images.githubusercontent.com/2461547/136107416-0cf7e2c2-aad5-4ad8-9531-0261fa87cc07.mov

### How do 3rd Libraries Control Canvas Size?

Luma.gl and mapbox-gl-js syncronize implementations for setting canvas size attributes, so that they can be visually in sync with eachother: 
- `canvas.clientWidth/Height` (in RFC as [Canvas Client Size](#Canvas-Client-Size))
- `canvas.width/height` (in RFC as [Canvas Internal Size](#Canvas-Internal-Size)). 

Discussed in more detail below, hubble.gl needs to control of both attributes because the [Canvas Client Size](#Canvas-Client-Size) effects the Viewport bounds and [Canvas Internal Size](#Canvas-Internal-Size) effects the export Resolution. The libraries allow setting [Canvas Client Size](#Canvas-Client-Size) with CSS width/height properties, but they control the [Canvas Internal Size](#Canvas-Internal-Size) internally (see [luma.gl](https://github.com/visgl/luma.gl/blob/15e7acd33363ffe2add58b28638d19f697651ea6/modules/gltools/src/context/context.ts#L363-L377) and [mapbox](https://github.com/mapbox/mapbox-gl-js/blob/cb4778f7cbde092dc11c959696eacfcfeb28ee71/src/ui/map.js#L2580-L2590) implementation) - this is a problem for hubble.gl.

## Solution Proposal: 

1. Modify `window.devicePixelRatio` to change the webgl internal size.
  a. Add `resolution` prop on `Map` changes the export resolution.
2. Use CSS `transform: scale` to fit the map into the available space.
  a. Add `previewSize` prop on `Map` changes the UI size.
3. Keep viewport bounds consistent across resize by fitting canvas client size around a 1080px box.
  a. Configurable with `viewportMinAxis` prop on `Map`.

### Risks

- Setting the browser's read-only `window.devicePixelRatio` is not guarenteed to work in all browsers, and may break without warning.

- We couldn't show two maps in parallel at different resolutions because `window.devicePixelRatio` is global. However, we can show multiple maps if they all have the same resolution (or is we don't care about their resolution). We can also resize each map with `previewSize` without issues.

- Multiple `Map` components will set conflicting `window.devicePixelRatio` values unless we have a flag to disable setting on all but one.

- Other 3rd party libraries that rely on `window.devicePixelRatio` will be effected by this solution.

### Prototype

https://github.com/visgl/hubble.gl/pull/171

#### Requirement 1. Demo Video

https://user-images.githubusercontent.com/2461547/136107744-d706b689-b703-4d05-b331-066d7f141ba9.mov

#### Requirement 2. and 3. Demo Video

https://user-images.githubusercontent.com/2461547/136107906-1dde2c00-32a6-4d97-aac6-12822fae0581.mov

## Size Variables Discussion

### Resolution

The user defined size of the exported videos and images. e.g. 1920px x 1080px

### UI Preview Size

The size of the HTML element containing the canvas in the UI.

- This is provided by the application.
- The aspect ratio of this size needs to match resolution.

### Viewport Boundary

The deck.gl / mapbox viewport perspective bounds (see [non-perspective getBounds](https://deck.gl/docs/api-reference/core/viewport#getbounds) for background).

- All map library viewports in use change with canvas client size and viewState.
- To minimize viewport changes (Req #3) we cannot dramatically change canvas client size.
- An animation is expected to have complete control of viewState, so we can't impose limits.

### Canvas Client Size

The deck.gl canvas element's CSS size (canvas.clientWidth/Height).

- To satisfy [requirement #3](#Requirements), the viewport shouldn't ever perceptually[0] change because of Canvas Client Size.
- Only allow the aspect to change.
- Set the min(width, height) to 1080px.
- Set the max(width, height) to Resolution Aspect Ratio * 1080px.
  - Why 1080?
    - Resolution is usually set close to 1080px in one axis, so this keeps scalars close to 1.
    - 2px (any tiny number), 500k (any big number) is not a good idea because floating point scalar problems. 
      - Precision Loss: E.g. 1920/500k = 0.00384. The “0.00” is lost precision. 1920/1080 = 1.777. No zeros, so no lost precision.
  - What if we change 1080 in the future?
    - Old animations that assume 1080-based viewport will appear zoomed out if 1080 increases, and zoomed in if 1080 decreases.

[0] there is a viewport change at the edges when the aspect ratio changes, but this solution creates a ["safe-area"](https://en.wikipedia.org/wiki/Safe_area_(television)) for video content since the center square of the viewport is always the same.

### Deck Style Prop
The CSS prop that sets the Canvas Client Size, and scales it to fit the UI Preview Size.

- To satisfy [requirement #2](#Requirements), the canvas [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) needs to fit in Preview Size.
- Scale to fit Preview Size using a CSS scale transform. 
  - Important to note CSS transforms have no effect on any other variables.
  - Preview Scalar = Preview Size / Canvas Client 

### Canvas Internal

The deck.gl canvas element's internal size.

- To satisfy [requirement #1](#Requirements), internal size to match Resolution.
- Same as WebGL/GPU/default framebuffer width and height.
- We won’t be able to directly set canvas internal
  - While we could change this in LumaGL, it wouldn’t set the Mapbox GPU size because it has its own implementation and we won’t be able to change Mapbox’s implementation.
  - mapbox/luma.gl implement size as a function of Canvas Client Size * [devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio). [See Luma.gl Code](https://github.com/visgl/luma.gl/blob/15e7acd33363ffe2add58b28638d19f697651ea6/modules/gltools/src/context/context.ts#L376-L377).
  - devicePixelRatio = Resolution / Canvas Client Size

## Example

![canvas-resizing-example](https://user-images.githubusercontent.com/2461547/136319821-47f5f5bb-f054-4e2b-8332-d7d897f422d1.png)

## Discussion

https://github.com/visgl/hubble.gl/issues/159

https://github.com/visgl/luma.gl/issues/1512

## Alternate Solution: Override resize functions in 3rd Party Libraries

Decouple viewport and WebGL from canvas external and internal sizes, respectivly, by overriding map library functions at runtime, or patching the libraries.

### Decouple Viewport and Canvas External

TODO

The viewport width/height would still need to be set around a 1080px box (e.g. `viewportMinAxis` prop). This solution just directly sets the value, so that client size can be set to `previewSize` prop and eliminates any use of CSS `transform: scale`.

### Decouple WebGL and Canvas Internal

Option 1: with custom Framebuffer supplied to luma.gl and mapbox. [See discussion.](https://github.com/visgl/hubble.gl/pull/176#discussion_r724380715)

Option 2: Override functions in mapbox [`Map` class](https://github.com/mapbox/mapbox-gl-js/blob/cb4778f7cbde092dc11c959696eacfcfeb28ee71/src/ui/map.js#L2580-L2590), and luma.gl [resizeGlContext](https://github.com/visgl/luma.gl/blob/15e7acd33363ffe2add58b28638d19f697651ea6/modules/gltools/src/context/context.ts#L363-L377).

### Risks

- Will be difficult to maintain. Adding a new library support will need custom override each time, and new versions can break old overrides.

### Prototype

TODO

## Solution Comparisons

Consideration: Is it better to override global devicePixelRatio or the mapbox/luma.gl functions at runtime?

### devicePixelRatio 

Pros: Lower effort to integrate an additional map library since most they syncronize resize implementations.
Cons: Setting the browser's read-only `window.devicePixelRatio` is not guarenteed to work in all browsers, and may break without warning.

### Overriding map library functions

Pros: Direct control of libraries is easier to debug compared to indirect control via devicePixelRatio.
Cons: Will be difficult to maintain. Adding a new library support will need custom override each time, and new versions can break old overrides.
