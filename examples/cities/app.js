/* eslint-disable no-console */
import React, {Component} from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled, {ThemeProvider} from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import {theme} from 'kepler.gl/styles';
import {MapboxLayer} from '@deck.gl/mapbox';
import {AUTH_TOKENS} from './kepler/constants/default-settings';
import {HubbleGl} from './hubble.gl/src/hubblegl';
import {handleKeyup} from './common/utils';

const startTime = 0;

const KeplerGl = require('kepler.gl/components').injectComponents([
  // [MapContainerFactory, CustomMapContainerFactory],
]);
/* eslint-enable no-unused-vars */

const sceneBuilder = async (animationLoop, dispatch) => {};

const GlobalStyle = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.labelColor};
  }
`;

class App extends Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: null,
    loaded: {
      deck: false,
      map: false,
      hubble: false,
      scene: false
    },
    playing: false,
    i: 0
  };

  componentDidMount() {
    window.addEventListener('keyup', handleKeyup.bind(this));

    // delay zs to show the banner
    // if (!window.localStorage.getItem(BannerKey)) {
    //   window.setTimeout(this._showBanner, 3000);
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.loaded.deck || !prevState.loaded.map || !prevState.loaded.scene) {
      if (this.state.loaded.deck && this.state.loaded.map && this.state.loaded.scene) {
        const hubblegl = new HubbleGl(this.deckgl, this.state.scene.length, 'png');

        // 'png'
        /* eslint-disable react/no-did-update-set-state */
        this.setState(
          {
            hubblegl,
            loaded: {
              ...this.state.loaded,
              hubble: true
            }
          },
          () => {
            this._proceedToNextFrame();
          }
        );
      }
    }
  }

  _getMapboxRef(mapbox, index) {
    if (!mapbox) {
      // The ref has been unset.
      // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      // console.log(`Map ${index} has closed`);
    } else {
      // We expect an InteractiveMap created by KeplerGl's MapContainer.
      // https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map
      const map = mapbox.getMap();

      map.on('load', e => {
        console.log('map loaded!');
        console.log('yo', this.deckgl);
        map.addLayer(new MapboxLayer({id: 'my-deck', deck: this.deckgl}));
        map.on('render', () => this._onAfterRender());

        this.setState({
          loaded: {
            ...this.state.loaded,
            map: true
          }
        }); // console.log(`Map ${index} zoom level: ${e.target.style.z}`);
      });
    }
  }

  _getDeckRef(deckgl) {
    this.deckgl = deckgl;
    const animationLoop = deckgl.animationLoop;
    animationLoop.timeline.setTime(startTime);

    this.setState({
      loaded: {
        ...this.state.loaded,
        deck: true
      }
    });

    sceneBuilder(animationLoop, this.props.dispatch).then(scene => {
      this.setState({
        loaded: {
          ...this.state.loaded,
          scene: true
        },
        scene
      });
    });

    console.log(this.state.loaded);
  }

  _viewState() {
    if (!this.state.loaded.hubble) {
      return this.props.demo.keplerGl.map.mapState;
    }
    return this.state.keyframes.camera.getFrame();
  }

  _onAfterRender() {
    if (this.state.hubblegl) {
      this.state.hubblegl.safeCapture(this._proceedToNextFrame);
    }
  }

  // Proceed to next frame given a time in ms.
  _proceedToNextFrame(timeMs) {
    console.log('next frame', timeMs);
    this.state.scene.getFrame(this.props.demo.keplerGl);
  }

  _start() {
    // UNCOMMENT TO ENABLE RECORDING
    this.state.hubblegl.start(startTime);
  }

  _stop() {
    this.state.hubblegl.stop();
  }

  render() {
    // we need render to run once per frame!
    if (this.af) {
      cancelAnimationFrame(this.af);
    }
    if (this.state.playing) {
      this.af = requestAnimationFrame(() => this._proceedToNextFrame());
    }
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle
          // this is to apply the same modal style as kepler.gl core
          // because styled-components doesn't always return a node
          // https://github.com/styled-components/styled-components/issues/617
          ref={node => {
            return node ? (this.root = node) : null;
          }}
        >
          <div
            style={{
              transition: 'margin 1s, height 1s',
              position: 'absolute',
              width: '100%',
              height: '100%',
              marginTop: 0
            }}
          >
            <AutoSizer>
              {({height, width}) => (
                <KeplerGl
                  mapboxApiAccessToken={AUTH_TOKENS.MAPBOX_TOKEN}
                  id="map"
                  /*
                   * Specify path to keplerGl state, because it is not mount at the root
                   */
                  getState={state => state.demo.keplerGl}
                  width={width}
                  height={height}
                  hubble={true}
                  getDeckRef={this._getDeckRef}
                  getMapboxRef={this._getMapboxRef}
                  // onMapRender={this._onAfterRender}
                />
              )}
            </AutoSizer>
          </div>
        </GlobalStyle>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  dispatchToProps
)(App);
