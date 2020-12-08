import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ButtonExport, Clear, Play, VideoClips} from './keyframes-icons';
import KeyframesTray from './keyframes-tray';
import KeyframeClip from './keyframe-clip';

export default class MagicKeyframes extends Component {
  static propTypes = {
    activeClipIndex: PropTypes.number.isRequired,
    animationInfo: PropTypes.object.isRequired,
    numClips: PropTypes.number.isRequired,
    onClickExport: PropTypes.func.isRequired,
    onClickPlay: PropTypes.func.isRequired
  };
  render() {
    const {activeClipIndex, animationInfo, numClips, onClickExport, onClickPlay} = this.props;
    const totalMs = animationInfo.clips.reduce((sum, clip) => sum + clip.length, 0);
    const {clips} = animationInfo;
    return (
      <div className={'magic-keyframes'}>
        <div className={'magic-header'}>
          <div className={'magic-header-wrapper'}>
            <div className={'magic-header-left'}>
              <VideoClips className={'magic-icon magic-header-content video-clips'} />
              <div className={'magic-header-content magic-header-text'}>Video Clips</div>
              <div className={'magic-header-content magic-header-subtext'}>{totalMs / 1000}s</div>
            </div>
            <div className={'magic-header-right'}>
              <div
                className={'magic-header-content click-magic-icon video-play'}
                onClick={onClickPlay}
              >
                <Play className={'magic-icon play'} onClick={onClickPlay} />
                <div className={'magic-header-text'} onClick={onClickPlay}>
                  Play
                </div>
              </div>
              <div className={'magic-header-content click-magic-icon video-clear'}>
                <Clear className={'magic-icon clear'} />
                <div className={'magic-header-text'}>Clear</div>
              </div>
              <div
                className={'magic-header-content click-magic-icon video-export'}
                onClick={onClickExport}
              >
                <ButtonExport className={'magic-icon  export'} onClick={onClickExport} />
              </div>
            </div>
          </div>
        </div>
        <div className={'magic-body'}>
          <KeyframesTray childWidth={304} childHeight={148}>
            {clips.map((clip, r) => (
              <KeyframeClip
                key={`keyframeClip${r}`}
                clipIndex={r}
                previewDataUrl={clip.previewImage}
                isActive={r === activeClipIndex}
                isAdd={r === numClips}
              />
            ))}
          </KeyframesTray>
        </div>
      </div>
    );
  }
}
