import {text as requestText, json as requestJson} from 'd3-request';

/**
 * this method detects whther the response status is < 200 or > 300 in case the error
 * is not caught by the actualy request framework
 * @param response the response
 * @returns {{status: *, message: (*|{statusCode}|Object)}}
 */
function detectResponseError(response) {
  if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
    return {
      status: response.statusCode,
      message: response.body || response.message || response
    };
  }
  return undefined;
}

/**
 *
 * @param url
 * @returns {Promise<any>}
 */
export function loadRemoteConfig(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    requestJson(url, (error, config) => {
      if (error) {
        reject(error);
        return;
      }
      const responseError = detectResponseError(config);
      if (responseError) {
        reject(responseError);
        return;
      }
      resolve(config);
    });
  });
}

/**
 *
 * @param url to fetch data from (csv, json, geojson)
 * @returns {Promise<any>}
 */
export function loadRemoteData(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return Promise.resolve(null);
  }

  let requestMethod = requestText;
  if (url.includes('.json') || url.includes('.geojson')) {
    requestMethod = requestJson;
  }

  // Load data
  return new Promise((resolve, reject) => {
    requestMethod(url, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      const responseError = detectResponseError(result);
      if (responseError) {
        reject(responseError);
        return;
      }
      resolve(result);
    });
  });
}
