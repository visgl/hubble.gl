// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base, { BaseIconProps } from './base';

export default class Play extends Component<BaseIconProps> {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-play',
    viewBox: '0 0 24 24'
  };

  render() {
    return (
      <Base {...this.props}>
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z" />
      </Base>
    );
  }
}
