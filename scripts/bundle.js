const {resolve} = require('path');
const esbuild = require('esbuild')
const {externalGlobalPlugin} = require('esbuild-plugin-external-global')

const INPUT = process.argv[2]
const OUTPUT = process.argv[3]

const PACKAGE_INFO = require(resolve(INPUT, '../package.json'));

/**
 * peerDependencies are excluded using `externals`
 * https://webpack.js.org/configuration/externals/
 * e.g. @deck.gl/core is not bundled with @deck.gl/geo-layers
 */
function getExternals(packageInfo) {
  let externals = {
    // Hard coded externals
    // 'h3-js': 'h3'
  };
  const {peerDependencies = {}} = packageInfo;

  for (const depName in peerDependencies) {
    if (depName.startsWith('@hubble.gl')) {
      // Instead of bundling the dependency, import from the global `hubble` object
      externals[depName] = 'globalThis.hubble';
    }
  }

  return externals;
}

esbuild.build({
  entryPoints: [INPUT],
  target: 'es2018',
  bundle: true,
  minify: true,
  format: 'iife',
  outfile: OUTPUT,
  plugins: [
    externalGlobalPlugin(getExternals(PACKAGE_INFO)),
  ],
});
