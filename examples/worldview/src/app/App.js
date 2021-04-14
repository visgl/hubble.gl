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

import React, {useEffect} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {messages} from 'kepler.gl/localization';
import {theme} from 'kepler.gl/styles';
import {registerEntry} from 'kepler.gl/actions';
import {AUTH_TOKENS} from '../constants';

import {Stage} from '../features/stage/Stage';
import {useDispatch, useSelector} from 'react-redux';

import {InjectKeplerUI} from '@hubble.gl/react';
import {LoadingSpinner} from 'kepler.gl/components';
const KEPLER_UI = {
  LoadingSpinner
};

import {loadSampleData} from '../data/sample';
// import {loadJson} from '../data/json';

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

const App = ({}) => {
  const dispatch = useDispatch();
  const hubbleGl = useSelector(state => state.hubbleGl);
  useEffect(() => {
    dispatch(
      registerEntry({
        id: 'map',
        mint: true,
        mapboxApiAccessToken: AUTH_TOKENS.MAPBOX_TOKEN
        // mapboxApiUrl,
        // mapStylesReplaceDefault,
        // initialUiState
      })
    );
  }, []);

  useEffect(() => {
    // load sample data
    const actions = loadSampleData();
    actions.forEach(a => dispatch(a));

    // loadJson().then(data => {
    //   // console.log(data);
    //   dispatch(data);
    //   // console.log(this.props);
    //   // dispatch(mapStyleChange({styleType: "light"}))
    // });
  }, []);

  return (
    <IntlProvider locale="en" messages={messages.en}>
      <ThemeProvider theme={theme}>
        <GlobalStyle>
          <WindowSize>
            <InjectKeplerUI keplerUI={KEPLER_UI}>
              {hubbleGl.map.ready && (
                <>
                  <div style={{height: 1080, margin: 16}}>
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
};

export default App;
