import KeplerGlSchema from 'kepler.gl/schemas';
import {processGeojson, processCsvData} from 'kepler.gl/processors';
import {createAsyncThunk, nanoid} from '@reduxjs/toolkit';
import {loadRemoteConfig, loadRemoteData} from './remoteDataClient';
import {LOADING_SAMPLE_ERROR_MESSAGE} from './constants';

const processRemoteMap = (response, config, options) => {
  const datasetId = options.id || nanoid();
  const {dataUrl} = options;
  let processorMethod = processCsvData;
  // TODO: create helper to determine file ext eligibility
  if (dataUrl.includes('.json') || dataUrl.includes('.geojson')) {
    processorMethod = processGeojson;
  }

  const datasets = {
    info: {
      id: datasetId
    },
    data: processorMethod(response)
  };

  const parsedConfig = config ? KeplerGlSchema.parseSavedConfig(config) : null;

  return {
    datasets,
    config: parsedConfig,
    options
  };
};

/**
 *
 * @param {Object} options
 * @param {string} [options.dataUrl] the URL to fetch data from, e.g. https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/earthquakes/data.csv
 * @param {string} [options.configUrl] the URL string to fetch kepler config from, e.g. https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/earthquakes/config.json
 * @param {string} [options.id] the id used as dataset unique identifier, e.g. earthquakes
 * @param {string} [options.label] the label used to describe the new dataset, e.g. California Earthquakes
 * @param {string} [options.queryType] the type of query to execute to load data/config, e.g. sample
 * @param {string} [options.imageUrl] the URL to fetch the dataset image to use in sample gallery
 * @param {string} [options.description] the description used in sample galley to define the current example
 * @param {string} [options.size] the number of entries displayed in the current sample
 * @returns {Function}
 */
export const loadRemoteKeplerMap = createAsyncThunk(
  'kepler/loadRemoteKeplerMap',
  async (options, {rejectWithValue}) => {
    const {configUrl, dataUrl} = options;
    return await Promise.all([loadRemoteConfig(configUrl), loadRemoteData(dataUrl)])
      .then(([config, data]) => processRemoteMap(data, config, options))
      .catch(error => {
        if (error) {
          const {target = {}} = error;
          const {status, responseText} = target;
          return rejectWithValue({
            configUrl,
            status,
            message: `${responseText} - ${LOADING_SAMPLE_ERROR_MESSAGE} ${options.id} (${configUrl})`
          });
        }
        return Promise.reject(error);
      });
  }
);
