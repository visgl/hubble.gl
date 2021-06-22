import {SaveExportDropdownFactory, withState} from 'kepler.gl/components';
import {toggleHubbleExportModal} from '../actions';
import {Icons} from 'kepler.gl/components';

// TODO panel-header finds certain items. Figure out how and add new one
const CustomSaveExportDropdownFactory = (...deps) => {
  const SaveExportDropdown = SaveExportDropdownFactory(...deps);
  const defaultLoadingMethods = SaveExportDropdown.defaultProps.items;

  const exportVideoModal = {
    label: 'toolbar.exportVideoModal',
    icon: Icons.Files, // TODO Temp icon
    key: 'video',
    onClick: props => unusedPanelHeaderProps => props.toggleHubbleExportModal(true) // Normally expects props from PanelHeaderFactory
    // but this is being used as part of Hubble. Otherwise will get filtered out. Reference https://github.com/keplergl/kepler.gl/blob/master/src/components/side-panel/panel-header.js#L139
    // TODO load hubble modal https://twitter.com/dan_abramov/status/824308413559668744?lang=en
  };
  // console.log("SaveExportDropdown.defaultProps", SaveExportDropdown.defaultProps)
  // console.log("defaultLoadingMethods", defaultLoadingMethods)
  // add more loading methods
  SaveExportDropdown.defaultProps = {
    ...SaveExportDropdown.defaultProps,
    items: [...defaultLoadingMethods, exportVideoModal]
  };
  // console.log('SaveExportDropdown.defaultProps', SaveExportDropdown.defaultProps);

  return withState([], () => {}, {toggleHubbleExportModal})(SaveExportDropdown);
};

CustomSaveExportDropdownFactory.deps = SaveExportDropdownFactory.deps;

export function replaceSaveExportDropdown() {
  return [SaveExportDropdownFactory, CustomSaveExportDropdownFactory];
}
