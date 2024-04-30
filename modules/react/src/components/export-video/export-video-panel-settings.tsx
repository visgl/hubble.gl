// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import React, {useState} from 'react';
import {withTheme} from 'styled-components';

import {WithKeplerUI} from '../inject-kepler';

import AnimationTab from './modal-tab-animation';
import SettingsTab from './modal-tab-settings';
import get from 'lodash.get';

export type ExportVideoSettings = {
  // AnimationTab
  durationMs: number
  setDuration: (val: number) => void
  cameraPreset: string
  setCameraPreset: (cameraPreset: string) => void
  // SettingsTab
  fileName: string
  fileNamePlaceholder: string
  setFileName: (value: string) => void
  mediaType: string
  setMediaType: (value: string) => void
  resolution: string
  setResolution: (value: string) => void
  frameRate: number
}

type ExportVideoPanelSettingsProps = {
  theme?: any
  settings: ExportVideoSettings, 
  resolution: [number, number], 
  disabled: boolean
}

type ModalTabMethod = {
  id: string
  label: string
  elementType: any
}

function ExportVideoPanelSettings(
  {
    settings, 
    resolution, 
    disabled
  }: ExportVideoPanelSettingsProps) {
  const loadingMethods: ModalTabMethod[] = [
    // Each entry creates new tabs with ModalTabsFactory
    // id: The tab id in state
    // label: What the text of the tab will be
    // elementType: The component to render
    {
      id: 'export-modal-tab-animation',
      label: 'exportVideoModal.animation',
      elementType: AnimationTab
    },
    {
      id: 'export-modal-tab-settings',
      label: 'exportVideoModal.settings',
      elementType: SettingsTab
    }
  ];
  const getDefaultMethod = (methods?: ModalTabMethod[]) => (Array.isArray(methods) ? get(methods, [0]) : null);
  const [currentMethod, toggleMethod] = useState<ModalTabMethod | null>(getDefaultMethod(loadingMethods));
  const ModalTab = currentMethod.elementType;

  return (
    <WithKeplerUI>
      {({ModalTabsFactory}) => {
        const ModalTabs = ModalTabsFactory();
        return (
          <div className="export-video-modal-tab-container">
            <ModalTabs
              currentMethod={currentMethod.id}
              loadingMethods={loadingMethods}
              toggleMethod={toggleMethod}
            />
            {currentMethod && (
              <ModalTab // Represents all the params needed across all tabs
                settings={settings}
                resolution={resolution}
                disabled={disabled}
              />
            )}
          </div>
        );
      }}
    </WithKeplerUI>
  );
}

// fix type with react 18
const ThemedExportVideoPanelSettings: any = withTheme(ExportVideoPanelSettings);

export default ThemedExportVideoPanelSettings;
