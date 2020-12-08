import React, {Component} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {connect} from 'react-redux';
import {createClip} from '../../actions/animation';
import {getCurrentKeyframe} from '../../reducers';
import MagicKeyframes from '../common/magic-keyframes';
import {HubbleGl} from '../../../hubble.gl/src/hubblegl';

class AnimationPanel extends Component {
  state = {
    previewImage: null,
    requestPreview: true
  };
  go = true;

  componentDidMount() {
    const hubblegl = new HubbleGl(this.props.deckgl, 10000, 'jpg');
    hubblegl.start();
    this.props.map.on('render', () => {
      if (this.state.requestPreview) {
        if (this.go) {
          hubblegl.safeCapture(timeMs => console.log(timeMs));
          hubblegl.recorder.save(blob => {
            const reader = new FileReader();
            reader.onload = () => {
              console.log(reader.result);
              const context = getCurrentKeyframe(this.props.keplerGlState);
              this.props.dispatch(createClip(context, reader.result));
              this.setState({
                previewImage: reader.result,
                requestPreview: false
              });
            }; // data url!
            const source = reader.readAsDataURL(blob);
          });
        }
        this.go = false;
      }
    });
  }

  render() {
    const {
      animation: {editing}
    } = this.props;

    let activeClipIndex = -1;
    if (editing) {
      activeClipIndex = editing.clipIdx;
    }

    return (
      <div
        style={{
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          width: 'calc(100% - 320px)',
          height: '278px',
          padding: '20px',
          paddingBottom: '30px'
        }}
      >
        <div
          style={{
            backgroundColor: '#242730',
            width: '100%',
            height: '100%',
            display: 'flex'
          }}
        >
          <MagicKeyframes
            activeClipIndex={activeClipIndex}
            animationInfo={this.props.animation}
            numClips={this.props.animation.clips.length}
            onClickExport={this.props.onClickExport}
            onClickPlay={this.props.onClickPlay}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  keplerGlState: state.demo.keplerGl.map,
  animation: state.demo.animation
});
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(AnimationPanel);
