// Sample data
/* eslint-disable no-unused-vars */
import sampleTripData, {sampleTripDataConfig} from './sample-trip-data';
import sampleAnimateTrip from './sample-animate-trip-data';
import {addDataToMap} from 'kepler.gl/actions';
import {processGeojson} from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

const loadPointData = () => {
  return addDataToMap({
    datasets: {
      info: {
        label: 'Sample Taxi Trips in New York City',
        id: 'test_trip_data'
      },
      data: sampleTripData
    },
    options: {
      centerMap: true,
      readOnly: false
    },
    config: sampleTripDataConfig
  });
};

const loadTripGeoJson = () => {
  return addDataToMap({
    datasets: [
      {
        info: {label: 'Trip animation'},
        data: processGeojson(sampleAnimateTrip)
      }
    ]
  });
};

export const loadSampleData = () => {
  return [loadPointData(), loadTripGeoJson()];
};
