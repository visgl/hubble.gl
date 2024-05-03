// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-catch';
import * as hubblegl from 'hubble.gl/../bundle';

test('standalone#imports', t => {
  t.ok(hubblegl.VERSION, 'version is exported');
  t.ok(hubblegl.DeckAdapter, 'DeckAdapter class is exported');

  t.ok(globalThis.hubble, 'deck namespace is exported');

  t.end();
});
