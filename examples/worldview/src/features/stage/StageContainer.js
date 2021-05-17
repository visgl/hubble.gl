// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import {DeckAdapter, DeckScene} from '@hubble.gl/core';

import {StageMap} from './StageMap';
import {connect} from 'react-redux';

import {setupRenderer, dimensionSelector, durationSelector} from '../renderer';

import {updateViewState, viewStateSelector} from './mapSlice';

export class StageContainer extends Component {
  constructor(props) {
    super(props);
    this.getDeckScene = this.getDeckScene.bind(this);

    const {glContext, dispatch} = props;

    const adapter = new DeckAdapter(this.getDeckScene, glContext);
    dispatch(setupRenderer(adapter));

    this.state = {
      adapter
    };
  }

  getDeckScene(animationLoop) {
    const {
      duration,
      dimension: {width, height}
    } = this.props;
    return new DeckScene({
      animationLoop,
      lengthMs: duration,
      width,
      height
    });
  }

  render() {
    const {
      // state
      viewState,
      dimension,
      // actions
      dispatch,
      // own props
      width,
      height,
      prepareFrame,
      deckProps,
      staticMapProps
    } = this.props;

    const {adapter} = this.state;

    return (
      <StageMap
        deckProps={deckProps}
        staticMapProps={staticMapProps}
        // UI Props
        width={width}
        height={height}
        // Map Props
        viewState={viewState}
        setViewState={vs => dispatch(updateViewState(vs))}
        // Hubble Props
        adapter={adapter}
        dimension={dimension}
        prepareFrame={prepareFrame}
      />
    );
  }
}

StageContainer.defaultProps = {
  width: 540,
  glContext: undefined
};

const mapStateToProps = state => {
  return {
    dimension: dimensionSelector(state),
    viewState: viewStateSelector(state),
    duration: durationSelector(state)
  };
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(StageContainer);
