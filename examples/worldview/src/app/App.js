// Copyright (c) 2021 Uber Technologies, Inc.
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

import React, {useMemo} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {messages} from 'kepler.gl/localization';
import {theme} from 'kepler.gl/styles';
import {useSelector} from 'react-redux';
import {InjectKeplerUI} from '@hubble.gl/react';
import {LoadingSpinner} from 'kepler.gl/components';
const KEPLER_UI = {
  LoadingSpinner
};
import {MonitorPanel} from '../features/monitor/MonitorPanel';
import {useKeplerDeckLayers, createSelectMapStyle} from '../features/kepler';

// import {useScene} from '../scenes/newYork';
import {useScene} from '../scenes/montage2';

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

const KEPLER_MAP_ID = 'map';
const selectMapStyle = createSelectMapStyle(KEPLER_MAP_ID);
let sceneLayers = [];
const App = ({}) => {
  sceneLayers = useScene();
  const keplerDeckLayers = useKeplerDeckLayers(KEPLER_MAP_ID);
  const deckProps = useMemo(() => {
    return {
      layers: [...keplerDeckLayers, ...sceneLayers]
      // layers: [...sceneLayers, ...keplerDeckLayers]
      // layers: []
      // layers: keplerDeckLayers
    };
  }, [keplerDeckLayers, sceneLayers]);
  const mapStyle = useSelector(selectMapStyle);
  const staticMapProps = {
    mapStyle
  };

  return (
    <IntlProvider locale="en" messages={messages.en}>
      <ThemeProvider theme={theme}>
        <GlobalStyle>
          <WindowSize>
            <InjectKeplerUI keplerUI={KEPLER_UI}>
              <div style={{height: 1080, margin: 16}}>
                <MonitorPanel deckProps={deckProps} staticMapProps={staticMapProps} />
              </div>
            </InjectKeplerUI>
          </WindowSize>
        </GlobalStyle>
      </ThemeProvider>
    </IntlProvider>
  );
};

export default App;
