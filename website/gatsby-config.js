const resolve = require('path').resolve;

module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-ocular`,
      options: {
        logLevel: 1, // Adjusts amount of debug information from ocular-gatsby

        // Folders
        DIR_NAME: __dirname,
        ROOT_FOLDER: `${__dirname}/../`,

        DOCS: require('../docs/table-of-contents.json'),
        DOC_FOLDERS: [
          `${__dirname}/../docs/`
        ],
        SOURCE: [
          `${__dirname}/static`,
          `${__dirname}/src`
        ],

        PROJECT_TYPE: 'github',

        PROJECT_NAME: 'hubble.gl',
        PROJECT_ORG: 'uber',
        PROJECT_ORG_LOGO: 'images/visgl-logo.png',
        PROJECT_URL: 'https://hubble.gl',
        PROJECT_DESC: 'High quality client-side 3d animation and video rendering',
        PATH_PREFIX: '/',
        THEME_OVERRIDES: '',

        GA_TRACKING: null,

        // For showing star counts and contributors.
        // Should be like btoa('YourUsername:YourKey') and should be readonly.
        GITHUB_KEY: null,

        HOME_PATH: '',
        LINK_TO_GET_STARTED: '/docs',
        PAGES: [
          {
            path: '/',
            componentUrl: resolve(__dirname, './templates/index.jsx'),
            content: ''
          },
          {
            title: 'Showcase',
            path: '/showcase',
            componentUrl: resolve(__dirname, './src/pages/showcase.jsx'),
          }
        ],

        PROJECTS: [
          {name: 'deck.gl', url: 'https://deck.gl'},
          {name: 'luma.gl', url: 'https://luma.gl'},
          {name: 'loaders.gl', url: 'https://loaders.gl'},
          {name: 'react-map-gl', url: 'https://visgl.github.io/react-map-gl'}
        ],

        ADDITIONAL_LINKS: [
          {name: 'Showcase', href: "/showcase", index: 1},
          {name: 'Blog', href: 'http://medium.com/vis-gl', index: 4}
        ],

        STYLESHEETS: [''],
        EXAMPLES: [
          {
            title: 'Getting Started: Basemap',
            path: 'examples/basic-basemap/',
            image: 'images/demo-thumb-basic-basemap.png',
            componentUrl: resolve('../examples/basic-basemap/app.js')
          },
          {
            title: 'Getting Started: Hello World',
            path: 'examples/hello-world/',
            image: 'images/demo-thumb-hello-world.png',
            componentUrl: resolve('../examples/quick-start/app.js')
          },
          {
            title: 'Animate Camera',
            path: 'examples/camera/',
            image: 'images/demo-thumb-animate-camera.png',
            componentUrl: resolve('../examples/camera/app.js')
          },
          {
            title: 'Landmark Tour',
            path: 'examples/terrain/',
            image: 'images/demo-thumb-terrain.jpg',
            componentUrl: resolve('../examples/terrain/app.js')
          },
          {
            title: 'Kepler.gl Animation',
            path: 'examples/kepler-integration/',
            image: 'images/demo-thumb-kepler-example.jpg',
            componentUrl: resolve('./src/pages/kepler-example.jsx')
          },
          {
            title: 'NYC Trips',
            path: 'examples/nyc-trips/',
            image: 'images/demo-thumb-nyc-trips.png',
            componentUrl: resolve('../examples/trips/app.js')
          }
        ],
      }
    },
    {resolve: 'gatsby-plugin-no-sourcemaps'}
  ]
};
