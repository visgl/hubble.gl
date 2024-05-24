const {resolve} = require('path');

function makeExampleEntries(data, category) {
  return Object.keys(data).map(name => ({
    title: name,
    category,
    path: `examples/${data[name]}/`,
    image: `images/examples/${data[name]}.jpg`,
    componentUrl: resolve(`./src/examples/${data[name]}.js`)
  }));
}

const GETTING_STARTED = {
  'Basemap': 'basic-basemap',
  'Hello World': 'quick-start'
}

const CORE_EXAMPLES = {
  'Animate Camera': 'camera',
  'Landmark Tour': 'terrain',
  'NYC Trips': 'trips'
}

const INTEGRATION_EXAMPLES = {
  // 'Kepler.gl': 'kepler' build independently 
}

module.exports = [].concat(
  makeExampleEntries(GETTING_STARTED, 'Getting Started'),
  makeExampleEntries(CORE_EXAMPLES, 'Animations'),
  {
    title: 'Kepler.gl',
    category: 'Integration',
    path: 'kepler',
    image: 'images/examples/kepler.jpg'
  }
);