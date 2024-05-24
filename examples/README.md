# hubble.gl Examples

All hubble.gl examples are set up to be "stand-alone", which means that
you can copy the example folder to your own environment, run `yarn` or `npm install`
and `yarn start` or `npm start` and within minutes have a running, minimal app that you can
start modifying and experimenting with.

## Examples Catalog

### [Get-Started Examples](./get-started)

These are intended to be absolutely minimal (in terms of application code,
package.json, webpack config etc) examples of how to get deck.gl and a base
map working together.

* **[Pure JS](./get-started/pure-js)** Applications without depending any additional framework. Bundled with
  webpack and served with webpack-dev-server.
* **[React](./get-started/react)** React exmples using `@hubble.gl/react` and `react-map-gl`. Bundled with
  webpack and served with webpack-dev-server. Transpiled with Babel.
* **[Scripting](./get-started/scripting)** HTML single-file examples that can be  opened directly in a browser.

### [Website Examples](./website)

These are stand-alone versions of the examples in the [hubble.gl
website](https://hubble.gl), with smaller uncompressed data sets to make it easy to understand
how they work.

### [Kepler.gl Integration](./kepler)

This is the [kepler.gl animation demo](https://hubble.gl/kepler), showcasing hubble.gl video export integration within `kepler.gl`.

### Running Examples Against hubble.gl Source Code

Most examples are set up so that they can be run either
against the local source code (enabling debugging of hubble.gl itself,
with hot reloading) or against an installed version of hubble.gl
(enables testing that things work with the published version).

Examples that support this mode have a `start-local` script in their
`package.json`.

Look at the `webpack.config.local.js` in this directory for details.
