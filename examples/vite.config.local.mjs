import {defineConfig} from 'vite';
import {getOcularConfig} from '@vis.gl/dev-tools';
import {join} from 'path';

const rootDir = join(__dirname, '..');

/** https://vitejs.dev/config/ */
export default defineConfig(async () => {
  const {aliases} = await getOcularConfig({root: rootDir});
  return {
    resolve: {
      alias: {
        ...aliases,
        // Use root dependencies
        '@luma.gl': join(rootDir, './node_modules/@luma.gl'), // Multiple installs cause issues for equality e.g. "instanceof Program" "Model needs a Program"
        // '@math.gl': join(rootDir, './node_modules/@math.gl'),
        // '@arcgis/core': join(rootDir, './node_modules/@arcgis/core'),
        // '@loaders.gl/core': join(rootDir, './node_modules/@loaders.gl/core'),
        'react': join(rootDir, './node_modules/react'), // Multiple installs cause issues for hooks e.g. useState
      }
    },
    define: {
      'process.env.GoogleMapsAPIKey': JSON.stringify(process.env.GoogleMapsAPIKey),
      'process.env.GoogleMapsMapId': JSON.stringify(process.env.GoogleMapsMapId),
      'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken)
    },
    server: {
      open: true,
      port: 8080
    },
    optimizeDeps: {
      esbuildOptions: {target: 'es2020'}
    },
    build: {
      sourcemap: 'inline',
    },
  };
});
