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
import styled, {ThemeProvider} from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl';
import {messages} from 'kepler.gl/localization';
import {theme} from 'kepler.gl/styles';
import {registerEntry} from 'kepler.gl/actions';
import {AUTH_TOKENS} from '../constants';

import {Stage} from '../features/stage/Stage';

import {InjectKeplerUI} from '@hubble.gl/react';
import {LoadingSpinner} from 'kepler.gl/components';
const KEPLER_UI = {
  LoadingSpinner
};

// Sample data
/* eslint-disable no-unused-vars */
import sampleTripData, {sampleTripDataConfig} from '../data/sample-trip-data';
import sampleAnimateTrip from '../data/sample-animate-trip-data';
import {addDataToMap} from 'kepler.gl/actions';
import {processGeojson} from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

// const keplerGlGetState = state => state.demo.keplerGl;

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

const WindowSize = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #0e0e10;
`;

class App extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentDidMount() {
    // add a new entry to reducer
    this.props.dispatch(
      registerEntry({
        id: 'map',
        mint: true,
        mapboxApiAccessToken: AUTH_TOKENS.MAPBOX_TOKEN
        // mapboxApiUrl,
        // mapStylesReplaceDefault,
        // initialUiState
      })
    );

    // load sample data
    this._loadSampleData();
  }

  _loadSampleData() {
    this._loadPointData();
    this._loadTripGeoJson();
  }

  _loadPointData() {
    this.props.dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: 'Sample Taxi Trips in New York City',
            id: 'test_trip_data'
          },
          data: sampleTripData
        },
        options: {
          centerMap: true,
          readOnly: false
        },
        config: sampleTripDataConfig
      })
    );
  }

  _loadTripGeoJson() {
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {label: 'Trip animation'},
            data: processGeojson(sampleAnimateTrip)
          }
        ]
      })
    );
  }

  _getMapboxRef = (mapbox, index) => {
    if (!mapbox) {
      // The ref has been unset.
      // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      // console.log(`Map ${index} has closed`);
    } else {
      // We expect an InteractiveMap created by KeplerGl's MapContainer.
      // https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map
      const map = mapbox.getMap();
      map.on('zoomend', e => {
        // console.log(`Map ${index} zoom level: ${e.target.style.z}`);
      });
    }
  };

  render() {
    return (
      <IntlProvider locale="en" messages={messages.en}>
        <ThemeProvider theme={theme}>
          <GlobalStyle
            // this is to apply the same modal style as kepler.gl core
            // because styled-components doesn't always return a node
            // https://github.com/styled-components/styled-components/issues/617
            ref={node => {
              if (node) {
                this.root = node;
              }
            }}
          >
            <WindowSize>
              <InjectKeplerUI keplerUI={KEPLER_UI}>
                {this.props.hubbleGl.map.ready && (
                  <>
                    <div style={{height: 400, margin: 16}}>
                      <Stage />
                    </div>
                  </>
                )}
              </InjectKeplerUI>
            </WindowSize>
          </GlobalStyle>
        </ThemeProvider>
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
