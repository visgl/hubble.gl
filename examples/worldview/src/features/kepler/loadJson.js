import {JSONLoader} from '@loaders.gl/json';
import {parse} from '@loaders.gl/core';
import {addDataToMap} from 'kepler.gl/actions';
import {processKeplerglJSON} from 'kepler.gl/processors';

const fetchFile = url => parse(fetch(url), JSONLoader, {});

export const loadKeplerJson = async url => {
  return addDataToMap(
    processKeplerglJSON({
      ...(await fetchFile(url)),
      options: {
        centerMap: false,
        readOnly: false
      }
    })
  );
};
