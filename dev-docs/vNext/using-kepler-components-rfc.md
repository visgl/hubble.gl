# RFC: Integration - Using Kepler Common Components

* Authors: Chris Gervang
* Date: Nov, 2020
* Status: **Draft**

## Context

The goal of the `@hubble.gl/react` package is to provide UI components that reduce the integration effort of adding video export features to vis.gl applications. Some of the design principles of these components are:

- Design generic components that can be reused between luma.gl, deck.gl, and kepler.gl applications

- Deliver use-case specific components for upstream integration with kepler.gl (which utilize the generic components)

The initial set of components we're shipping are focused on specific use-cases for kepler.gl. Some features of a "kepler.gl-ready" component are:

- Internationalization
- Theme Inheritance
- Redux Selectors
- Reuse of existing Kepler.gl components

The area this RFC discusses is specifically how an external library like, hubble.gl, can reuse React components written in kepler.gl. We'll explore two options: either fork kepler.gl code into the hubble.gl repo, or inject all kepler.gl dependencies into hubble.gl as props during runtime. There are pros/cons to both.

## Option A: Forked Components

Fork kepler.gl code into the hubble.gl repo. Record commit hash.

### Pros

- Components be used in applications that don't install kepler
- Can customize components
- Hubble avoids a very large dependency (the kepler package)

### Cons

- References to theme and localization variables can break is kepler renames them.
- Changes/Bug fixes made in kepler need to be manually copied over.
- There may be some unused code copied in from kepler

## Option B: Runtime Injection

Inject all kepler.gl dependencies into hubble.gl as props during runtime.

### Pros

- Internal theme and localization references will stay up to date
- No need to maintain a copied fork
- No impact on hubble bundle

### Cons

- Requires users to install kepler
- Increases complexity of integration (boiler plate required)
- The upstream components may break without warning (kepler may make a breaking change from hubble's point of view, which kepler isn't testing for).

## Option C: Repackaging Kepler.gl

Create `@kepler.gl/*` packages for all importable modules, such as components, constants, actions, localization, etc.

### Pros

- Version compatibility is pinned, low chance of silent breakage.
- All changes in one place

### Cons

- Effort and alignment required from kepler.gl maintainers

## Recommendation

For the initial release we recommend Option A since it does not increase integration complexity or require effort of designing a robust dependency injection system. Overtime we would like to move to Option C and believe the learnings from Option A can transfer to the effort. For example, we've identified packages that should be peer dependencies and demonstrated code isolation from kepler.gl into lerna packages works.

## Code

We've implemented Option A [here](https://github.com/uber/hubble.gl/tree/b18bef4861e2f0e3b0c1ec63e8477e96d12e71c3/modules/react/src/components/export-video/kepler).