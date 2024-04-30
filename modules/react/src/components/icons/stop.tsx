// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base, { BaseIconProps } from './base';

export default class Stop extends Component<BaseIconProps> {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-stop',
    viewBox: '0 0 24 24'
  };

  render() {
    return (
      <Base {...this.props}>
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      </Base>
    );
  }
}
