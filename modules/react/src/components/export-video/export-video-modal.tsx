// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
/* global window */
import React, {Component, createRef} from 'react';
import Modal from 'react-modal';
import {ThemeProvider} from 'styled-components';
import {ModalContainer} from './styled-components';
import {createSelector} from 'reselect';

type ExportVideoModalProps = {
  theme: {
    sidePanelInnerPadding?: number;
    sidePanel?: {
      margin?: {
        left?: number;
      };
    };
    sidePanelScrollBarWidth?: number;
    modalOverLayZ?: number;
    sidePanelBg?: string;
    panelBorderRadius?: string;
  };
  isOpen: boolean;
  defaultSettingsPos?: {top: string; left: string};
  bottomBuffer?: number;
  settingsHeight: number;
  showSettings: boolean;
};

class ExportVideoModal extends Component<ExportVideoModalProps> {
  static defaultProps = {
    defaultSettingsPos: {top: '320px', left: '320px'},
    bottomBuffer: 212
  };

  root = createRef<HTMLDivElement>();

  // derive settings position based on root component
  showSettingsSelector(props: ExportVideoModalProps) {
    return props.showSettings;
  }
  themeSelector(props: ExportVideoModalProps) {
    return props.theme;
  }
  settingsPosSelector = createSelector(
    this.showSettingsSelector,
    this.themeSelector,
    (showSettings, theme = {}) => {
      const {defaultSettingsPos, bottomBuffer, settingsHeight} = this.props;
      if (showSettings === false || !this.root || !this.root.current) return defaultSettingsPos;
      const {sidePanelInnerPadding = 16, sidePanel = {}, sidePanelScrollBarWidth = 10} = theme;
      const sidePanelLeft = (sidePanel.margin || {}).left || 20;
      const offsetX = sidePanelInnerPadding + sidePanelLeft + sidePanelScrollBarWidth;
      // find component Root position
      const bounding = this.root.current.getBoundingClientRect();
      const {x, y, width} = bounding;

      // set the top so it won't collide with bottom widget
      const top =
        y + settingsHeight <= window.innerHeight - bottomBuffer
          ? y
          : window.innerHeight - bottomBuffer - settingsHeight;

      return {top: `${top}px`, left: `${x + width + offsetX}px`};
    }
  );

  modalStylesSelector = createSelector(this.themeSelector, theme => ({
    content: {
      top: 'auto',
      left: 'auto',
      right: '50%',
      bottom: '50%',
      transform: 'translate(50%, 50%)',
      padding: '0px 0px 0px 0px',
      border: 0,
      backgroundColor: theme.sidePanelBg,
      borderRadius: theme.panelBorderRadius || '2px'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, .5)',
      zIndex: (this.props.theme && this.props.theme.modalOverLayZ) || 1000
    }
  }));

  render() {
    const {isOpen, theme, children} = this.props;

    const modalStyles = this.modalStylesSelector(this.props);
    return (
      <ThemeProvider theme={theme}>
        <ModalContainer className="export-video-modal" ref={this.root}>
          {this.root.current ? (
            <Modal
              isOpen={isOpen}
              style={modalStyles}
              ariaHideApp={false}
              parentSelector={() => {
                return (
                  this.root.current ||
                  ({
                    removeChild: () => {},
                    appendChild: () => {}
                  } as unknown as HTMLElement)
                );
              }}
            >
              {children as any}
            </Modal>
          ) : null}
        </ModalContainer>
      </ThemeProvider>
    );
  }
}

export default ExportVideoModal;
