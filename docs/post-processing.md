# Post Processing Workflow

Video editors and presentation software can be used to add text, dissolve between clips, and combine multiple renderings. While there are probably methods to incorporate many post processing techniques we've used into the web browser, there are many benefits afforded from using existing tools for certain parts of your animation workflow. This document aims to breakdown our workflow and walk you through the steps taken _after_ a render completes.

## Adding Text and Graphics

The most common post processing needed is some kind of text annotation to contextualize what your audience is looking at. For presentations, we recommend adding text or simple graphical elements, such as a legend, within your presentation software, such as Google Slides or Apple Keynote. This enables much faster iteration on copy and typographic design between you and your team compared to rendering and importing again after every text change.

<!-- TODO: In this example, [24hr timeline] -->

> For example, presentation software was used to add text and an animated timeline synced with the data being displayed.

## Pacing Animations with your Speaker

While presentations are usually rehearsed and carefully planned, they are _live_ performances. That means the speaker expects to have control over their pacing as they guide their audience through a story. If planned for up front, splitting animations up into multiple slides is an easy way to give your speaker this control without adding much additional complexity to your program.

To do this, match your camera positions up at the end of one slide and the start of the next. To avoid unpolished transitions between slides, make each clip shorter than the speakers time spent on the slide and simply freeze on the last frame of the video when it ends.

<!-- TODO: In this example, [Downtown *click* to John Wayne] -->

> For example, the clip pauses after each camera motion is finished and the speaker clicks to activate the next slide.

## Combining Clips

Revealing new visuals within a single clip can have a great effect for your audience. Usually animating opacity within hubble.gl is sufficient, but in some situations, such as transitioning between base maps using a video editor is the easiest way to produce the effect.

Plan to capture multiple renderings with hubble.gl for each phase of your clip. Ensure they use the same camera motion and encoder settings. Line clips up in your video editor to dissolve between them.

<!-- TODO: In this example, [add LAX breakdown slide] -->

> For example, the base map and bar styles transition to reveal the points of interest at this location.

A quick note on video editors, pay attention to video export settings and try to avoid losing quality during an export. <!-- TODO: Check out rendering tips to learn more. -->
