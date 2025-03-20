/** @typedef {import('@vis.gl/dev-tools').OcularConfig} OcularConfig */
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const packageRoot = dirname(fileURLToPath(import.meta.url));

/** @type {OcularConfig} */
const config = {
  lint: {
    paths: ['modules', 'test']
    // paths: ['modules', 'test', 'examples', 'website']
  },

  babel: false,

  bundle: {
    globalName: 'hubble',
    target: ['chrome110', 'firefox110', 'safari15'],
    format: 'umd',
    globals: {
      '@hubble.gl/*': 'globalThis.hubble'
    }
  },

  aliases: {
    'hubble.gl-test': join(packageRoot, './test')
  },

  coverage: {
    test: 'force-browser-tests'
  },

  entry: {
    test: 'test/node.ts',
    'test-browser': 'index.html',
    // bench: 'test/bench/index.js',
    // 'bench-browser': 'test/bench/browser.html',
    size: 'test/size/import-nothing.js'
  }
};

export default config;
