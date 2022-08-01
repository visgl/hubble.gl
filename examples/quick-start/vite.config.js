/* global process */
import fs from 'fs/promises';
import {defineConfig} from 'vite';

/** Run against local source */
const getAliases = async (frameworkName, frameworkRootDir) => {
  const modules = await fs.readdir(`${frameworkRootDir}/modules`);
  const aliases = {};
  for (const module of modules) {
    aliases[`${frameworkName}/${module}`] = `${frameworkRootDir}/modules/${module}/src`;
  }
  return aliases;
};

/** @see https://github.com/vitejs/vite/discussions/3448 */
const loadJsFilesAsJsx = async () => {
  return {
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: 'load-js-files-as-jsx',
            setup(build) {
              build.onLoad({filter: /.*\.js$/}, async args => ({
                loader: 'jsx',
                contents: await fs.readFile(args.path, 'utf8')
              }));
            }
          }
        ]
      }
    }
  };
};

/** @see https://vitejs.dev/config/ */
export default defineConfig(async () => ({
  resolve: {
    // eslint-disable-next-line no-process-env
    alias: process.env.LOCAL_ALIAS && (await getAliases('@hubble.gl', `${__dirname}/../..`))
  },
  server: {open: true},
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/,
    // loader: "tsx",
    // include: /src\/.*\.[tj]sx?$/,
    exclude: []
  },
  ...(await loadJsFilesAsJsx())
}));
