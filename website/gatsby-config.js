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
          `${__dirname}/../docs/`,
          `${__dirname}/../modules/`
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

        HOME_PATH: '/',
        LINK_TO_GET_STARTED: '/docs',
        INDEX_PAGE_URL: resolve(__dirname, './templates/index.jsx'),

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
            title: 'Minimal Example',
            path: 'examples/minimal/',
            image: 'images/visgl-logo.png',
            componentUrl: resolve('../examples/minimal/app.js')
          },
          {
            title: 'Terrain Example',
            path: 'examples/terrain/',
            image: 'images/visgl-logo.png',
            componentUrl: resolve('../examples/terrain/app.js')
          }
        ],
      }
    },
    {resolve: 'gatsby-plugin-no-sourcemaps'}
  ]
};
