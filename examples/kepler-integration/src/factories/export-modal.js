import {SaveExportDropdownFactory, withState} from 'kepler.gl/components';
import {toggleHubbleExportModal} from '../actions';
import {Icons} from 'kepler.gl/components';

const CustomSaveExportDropdownFactory = (...deps) => {
  const SaveExportDropdown = SaveExportDropdownFactory(...deps);
  const defaultLoadingMethods = SaveExportDropdown.defaultProps.items;

  const exportVideoModal = {
    label: 'toolbar.exportVideoModal',
    icon: Icons.Files, // TODO: video icon
    key: 'video',
    onClick: props => _ => props.toggleHubbleExportModal(true)
  };

  // add more loading methods
  SaveExportDropdown.defaultProps = {
    ...SaveExportDropdown.defaultProps,
    items: [...defaultLoadingMethods, exportVideoModal]
  };

  return withState([], () => {}, {toggleHubbleExportModal})(SaveExportDropdown);
};

CustomSaveExportDropdownFactory.deps = SaveExportDropdownFactory.deps;

export function replaceSaveExportDropdown() {
  return [SaveExportDropdownFactory, CustomSaveExportDropdownFactory];
}
