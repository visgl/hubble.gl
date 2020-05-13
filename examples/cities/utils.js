/* eslint-disable no-console */
export const findFilterIdx = (data, label) => {
  const foundDataset = Object.values(data.datasets).find(dataset => dataset.info.label === label);

  const filterIdx = data.config.visState.filters.findIndex(filter => {
    return filter.dataId === foundDataset.info.id;
  });
  console.log(data.config.visState.filters[filterIdx]);
  return filterIdx;
};

export function findLayer(visState, layerName) {
  return visState.layers.find(anyLayer => {
    return anyLayer.config.label === layerName;
  });
}
