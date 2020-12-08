import {MapContainerFactory, MapPopoverFactory, MapControlFactory} from 'kepler.gl/components';
import {StaticMap} from 'react-map-gl';

// Custom Panel Header renders default panel header, changing its default props
// to avoid rendering any action items on the top right
export function CustomMapContainerFactory() {
  const MapContainer = MapContainerFactory(MapPopoverFactory(), MapControlFactory());

  MapContainer.defaultProps = {
    ...MapContainer.defaultProps,
    MapComponent: StaticMap
  };
  return MapContainer;
}

export default CustomMapContainerFactory;
