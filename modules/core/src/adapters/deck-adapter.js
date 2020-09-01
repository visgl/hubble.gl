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
/* eslint-disable no-console */
import {Timeline} from '@luma.gl/engine';
import {PreviewEncoder} from '../encoders';
// eslint-disable-next-line no-unused-vars
import {DeckScene} from '../scene';
import {VideoCapture} from '../capture/video-capture';

export default class DeckAdapter {
  /** @type {DeckScene} */
  scene;
  /** @type {(animationLoop: any, defaultViewState: any) => Promise<DeckScene> | DeckScene} */
  sceneBuilder;
  /** @type {boolean} */
  shouldAnimate;

  /**
   * @param {(animationLoop: any) => DeckScene | Promise<DeckScene>} sceneBuilder
   */
  constructor(sceneBuilder) {
    this.sceneBuilder = sceneBuilder;
    this.videoCapture = new VideoCapture();

    this.shouldAnimate = true;
    this.getProps = this.getProps.bind(this);
    this.render = this.render.bind(this);
    this.preview = this.preview.bind(this);
    this.stop = this.stop.bind(this);
    this._deckOnLoad = this._deckOnLoad.bind(this);
    this._getViewState = this._getViewState.bind(this);
    this._getLayers = this._getLayers.bind(this);
    this._applyScene = this._applyScene.bind(this);

    this.enabled = false;
  }

  /**
   * @param {{ current: { deck: any; }; }} deckRef
   * @param {(ready: boolean) => void} setReady
   * @param {(nextTimeMs: number) => void} onNextFrame
   */
  getProps(deckRef, setReady, onNextFrame, enabled) {
    const props = {
      onAfterRender: () => this._onAfterRender(onNextFrame),
      onLoad: () =>
        this._deckOnLoad(deckRef.current.deck).then(() => {
          // console.log('adapter')
          setReady(true);
        }),
      _animate: this.shouldAnimate
    };

    console.log(this.enabled);

    // Animating the camera is optional, but if a keyframe is defined then viewState is controlled by camera keyframe. CHANGED
    if (this.scene && this.scene.keyframes.camera && this.enabled) {
      console.log("going here");

      props.controller = false;
      props.viewState = this._getViewState();

    }

    if(!this.enabled){
      props.controller = true;
    }
    


  // What it's needed
  /*
   1. When the user changes its viewState in the map, that will be the starting position of the camera
   2. this._getViewState - Gets the camera position from the keyframes, but this position needs to be updated from the current viewState of the canvas
    (when th user drags on the screen) Currently is not being re-rendered or updated
  
  
  */

   // console.log("props.viewState", props.viewState);

    // Only replace layers when use defines scene layers
    // TODO: Could potentially concat instead of replace, but layers are supposed to be static.
    if (this.scene && this.scene.hasLayers()) {
      props.layers = this._getLayers();
    }

    if (this.scene) {
      props.width = this.scene.width;
      props.height = this.scene.height;
    }
    return props;
  }

  /**
   * @param {typeof import('../encoders').FrameEncoder} Encoder
   * @param {import('types').FrameEncoderSettings} encoderSettings
   * @param {() => void} onStop
   */
  render(Encoder = PreviewEncoder, encoderSettings = {}, onStop = undefined) {


    this.shouldAnimate = true;
    this.videoCapture.render(Encoder, encoderSettings, this.scene.lengthMs, onStop);
    this.scene.animationLoop.timeline.setTime(this.videoCapture.encoderSettings.startOffsetMs);

    this._onEnabled();
    console.log(this.enabled);
   
  }

  preview() {
    this.scene.animationLoop.timeline.play();
  }

  /**
   * @param {() => void} callback
   */
  stop(callback) {
    this.shouldAnimate = false;
    this.videoCapture.stop(callback);
  }

  async _deckOnLoad(deck) {
    this.deck = deck;

    console.log("this.deck", this.deck);

    const animationLoop = deck.animationLoop;
    animationLoop.attachTimeline(new Timeline());
    animationLoop.timeline.setTime(0);

    await Promise.resolve(this.sceneBuilder(animationLoop, this.deck.props.viewState)).then(scene => {
      this._applyScene(scene);
    });
  }

  // TODO: allow user to change scenes at runtime.
  _applyScene(scene) {
    this.scene = scene;
  }

  _getViewState() {
    if (!this.scene) {
      return null;
    }
    const frame = this.scene.keyframes.camera.getFrame();
    return frame;
  }

  _getLayers() {
    if (!this.scene) {
      return [];
    }
    return this.scene.renderLayers();
  }

  /**
   * @param {(nextTimeMs: number) => void} proceedToNextFrame
   */
  _onAfterRender(proceedToNextFrame) {
    // console.log('after render');
    this.videoCapture.capture(this.deck.canvas, nextTimeMs => {
      this.scene.animationLoop.timeline.setTime(nextTimeMs);
      proceedToNextFrame(nextTimeMs);
    });

  }

  _onEnabled(){
    const viewState = this._getViewState();
    this.enabled = true;
    
      this.scene.keyframes.camera.values[0].latitude = viewState.latitude;
      this.scene.keyframes.camera.values[0].longitude = viewState.longitude;
      this.scene.keyframes.camera.values[0].pitch = viewState.pitch;
      this.scene.keyframes.camera.values[0].zoom = viewState.zoom;
      this.scene.keyframes.camera.values[0].bearing = viewState.bearing;

      this.scene.keyframes.camera.values[1].latitude = viewState.latitude;
      this.scene.keyframes.camera.values[1].longitude = viewState.longitude;
      this.scene.keyframes.camera.values[1].pitch = viewState.pitch;
      this.scene.keyframes.camera.values[1].zoom = viewState.zoom;
      this.scene.keyframes.camera.values[1].bearing = viewState.bearing + 90;

     if(!this.enabled) {
      this.scene.animationLoop.timeline.setTime(this.videoCapture.encoderSettings.startOffsetMs);
     }

  
   // return this.enabled === false ? this.enabled = true : this.enabled = false;
  }



}
