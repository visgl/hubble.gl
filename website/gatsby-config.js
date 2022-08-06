const {resolve} = require('path');

const ROOT_DIR = resolve('..');

module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-ocular`,
      options: {
        logLevel: 1, // Adjusts amount of debug information from ocular-gatsby

        // Folders
        DIR_NAME: __dirname,
        ROOT_FOLDER: ROOT_DIR,

        DOCS: require('../docs/table-of-contents.json'),
        DOC_FOLDERS: [
          resolve(ROOT_DIR, 'docs'),
        ],
        SOURCE: [
          resolve('./static'),
          resolve('./src')
        ],

        PROJECT_TYPE: 'github',

        PROJECT_NAME: 'hubble.gl',
        PROJECT_ORG: 'visgl',
        PROJECT_ORG_LOGO: 'images/visgl-logo.png',
        PROJECT_URL: 'https://hubble.gl',
        PROJECT_DESC: 'High quality client-side 3d animation and video rendering',
        
        // This is only activated in staging, with `gatsby build --prefix-paths`
        PATH_PREFIX: '/hubble.gl',
        
        THEME_OVERRIDES: '',

        HOME_PATH: '',
        LINK_TO_GET_STARTED: '/docs',
        PAGES: [
          {
            path: '/',
            componentUrl: resolve(__dirname, './src/index.js'),
            content: ''
          },
          {
            title: 'Showcase',
            path: '/showcase',
            componentUrl: resolve('./src/showcase.js'),
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
        EXAMPLES: require('./examples.js'),

        GA_TRACKING_ID: null,

        // For showing star counts and contributors.
        // Should be like btoa('YourUsername:YourKey') and should be readonly.
        GITHUB_KEY: null
      }
    },
    {resolve: 'gatsby-plugin-no-sourcemaps'}
  ]
};
