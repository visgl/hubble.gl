// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import React, {type PropsWithChildren, createContext} from 'react';

/*
// Hook up mutual kepler imports
import {Button, Icons, Input, ItemSelector, Slider} from 'kepler.gl/components';

const IconButton = styled(Button)`
  padding: 0;
  svg {
    margin: 0;
  }
`;

const KEPLER_UI = {
  IconButton,
  Button,
  Icons,
  Input,
  ItemSelector,
  Slider,
};
*/

type KeplerUI = {[component: string]: any};

export const KeplerUIContext = createContext<KeplerUI>(null);

export const WithKeplerUI = KeplerUIContext.Consumer;

export const InjectKeplerUI = ({
  children,
  keplerUI
}: PropsWithChildren<{
  keplerUI: KeplerUI;
}>) => <KeplerUIContext.Provider value={keplerUI}>{children}</KeplerUIContext.Provider>;

export const injectKeplerUI = (Component: any, keplerUI: KeplerUI) => props =>
  (
    <KeplerUIContext.Provider value={keplerUI}>
      <Component {...props} />
    </KeplerUIContext.Provider>
  );
