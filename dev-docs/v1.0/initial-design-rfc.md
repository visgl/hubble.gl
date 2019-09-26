# RFC: Initial Release Design

* Authors: Chris Gervang
* Date: May, 2020
* Status: **Draft**

Hubble.gl brings animation and video rendering capabilities to the vis.gl ecosystem, empowering data scientists with tools to effectively communicate oceans of data with motion.

## Design Requirements

1. **Videos must be super high quality** - Guaranteed smooth framerates, high resolution, and a variety of formats.

2. **Core functions must work client-side in a web browser** - vis.gl works locally, so hubble.gl should as well to simplify integration. Opt-in server-side enhancements are available.

3. **End users shouldn't need to write code to make animations** - Hubble.gl provides an Animation Composer UI for applications to integrate. Need more power? You can also programmatically generate animations.

4. **First class support for kepler.gl and deck.gl** - Hubble.gl provides wrappers to simplify integration.

5. **Utilize existing vis.gl systems** - Hubble.gl is built on top of Luma.gl's Timeline and KeyFrame classes.

## Features: Finding the Right Home

This project’s goal, above shipping a new library, is to improve the animation experience across vis.gl. Therefore, some features planned in this project may not ship in the Hubble.gl library. Instead, we’ll be collaborating with the community to find the right home for features as they develop. We’d like to find the right home for a variety of features.

