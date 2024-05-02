/** @typedef {import('ocular-dev-tools').OcularConfig} OcularConfig */
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

  typescript: {
    project: 'tsconfig.build.json'
  },

  aliases: {
    'hubble.gl-test': join(packageRoot, './test')
  },

  coverage: {
    test: 'browser'
  },

  entry: {
    test: 'test/node.js',
    'test-browser': 'test/browser.js',
    bench: 'test/bench/node.js',
    'bench-browser': 'test/bench/browser.js',
    size: 'test/size/main.js'
  }
};

export default config;
