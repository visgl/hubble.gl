import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {AddClipPlus, GrabBarLeft, GrabBarRight} from './keyframes-icons';

export default class KeyframeClip extends Component {
  static propTypes = {
    clipIndex: PropTypes.number.isRequired,
    previewDataUrl: PropTypes.string,
    isActive: PropTypes.bool,
    isAdd: PropTypes.bool
  };

  static defaultProps = {
    isActive: false,
    isAdd: false
  };

  render() {
    const {previewDataUrl, isActive, isAdd} = this.props;
    return (
      <div className="keyframe-clip">
        <div className={`keyframe${isActive ? ' clip-active' : ''}`}>
          {!isAdd && previewDataUrl && <img src={previewDataUrl} width="195" height="126" />}
          {isAdd && (
            <div className="add-clip">
              <div className="add-clip-filler" />
              <div className="add-clip-wrapper">
                <AddClipPlus />
              </div>
            </div>
          )}
        </div>
        {isActive && (
          <div className="clip-grabber clip-grabber-left">
            <GrabBarLeft />
          </div>
        )}
        {isActive && (
          <div className="clip-grabber clip-grabber-right">
            <GrabBarRight />
          </div>
        )}
      </div>
    );
  }
}
