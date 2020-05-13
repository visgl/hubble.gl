/* eslint-disable no-console */
import {addDataToMap, setFilter, updateMap, layerVisConfigChange} from 'kepler.gl/actions';
import {processKeplerglJSON} from 'kepler.gl/processors';
import {KeplerScene} from '@hubble.gl/experimental';
import {findFilterIdx, findLayer} from './utils';
import {
  cameraFrame,
  filterFrame,
  radiusFrame,
  elevationScaleFrame,
  opacityFrame
} from '@hubble.gl/core/frame';
import {getKeyframes} from './keyframes';

import {getData} from './data';

export const LENGTH = 30000;

export const keplerSceneBuilder = async (animationLoop, dispatch) => {
  // loaded data
  const data = await getData().then(keplerData => {
    const json = processKeplerglJSON(keplerData.demo);
    console.log(json.config.visState.layers);
    dispatch(addDataToMap(json));
    return json;
  });

  // defined kepler filters
  const filters = {
    a: findFilterIdx(data, 'A.csv'),
    b: findFilterIdx(data, 'B.csv')
  };

  // set up keyframes
  const keyframes = getKeyframes(animationLoop);

  // compute current frame (it's aware of global time setting)
  const _getFrame = (keplerGl, kfs, flts) => {
    dispatch(updateMap(cameraFrame(kfs.camera)));
    dispatch(setFilter(flts.a, 'value', filterFrame(kfs.a)));
    dispatch(setFilter(flts.b, 'value', filterFrame(kfs.b)));

    const visState = keplerGl.map.visState;
    const bLayer = findLayer(visState, 'B');
    dispatch(
      layerVisConfigChange(bLayer, {
        radius: radiusFrame(kfs.bRadius),
        opacity: opacityFrame(kfs.bOpacity)
      })
    );
    const aLayer = findLayer(visState, 'A');
    dispatch(
      layerVisConfigChange(aLayer, {
        radius: radiusFrame(kfs.aRadius)
      })
    );
    const cLayer = findLayer(visState, 'C');
    dispatch(
      layerVisConfigChange(cLayer, {
        radius: radiusFrame(kfs.cRadius)
      })
    );
    const dLayer = findLayer(visState, 'D');
    dispatch(
      layerVisConfigChange(dLayer, {
        elevationScale: elevationScaleFrame(kfs.dScale),
        opacity: opacityFrame(kfs.dOpacity)
      })
    );
  };

  return new KeplerScene(animationLoop, LENGTH, keyframes, data, filters, _getFrame);
};
