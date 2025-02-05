// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';

import * as hubble from 'hubble.gl';
import * as core from '@hubble.gl/core';
import * as react from '@hubble.gl/react';

test('Top-level imports', t0 => {
  const hasEmptyExports = obj => {
    for (const key in obj) {
      if (obj[key] === undefined) {
        return key;
      }
    }
    return false;
  };

  t0.test('import "hubble.gl"', t => {
    t.notOk(hasEmptyExports(hubble), 'No empty top-level export in hubble.gl');
    t.notOk(hasEmptyExports(core), 'No empty top-level export in @hubble.gl/core');
    t.notOk(hasEmptyExports(react), 'No empty top-level export in @hubble.gl/react');
    t.end();
  });

  t0.end();
});

test('hubble.gl re-exports', t => {
  const findMissingExports = (source, target) => {
    const missingExports = [];
    for (const key in source) {
      // Exclude experimental exports
      if (key[0] !== '_' && key !== 'experimental' && target[key] !== source[key]) {
        missingExports.push(key);
      }
    }
    return missingExports.length ? missingExports : null;
  };

  t.notOk(findMissingExports(core, hubble), 'hubble.gl re-exports everything from @hubble.gl/core');
  t.notOk(
    findMissingExports(react, hubble),
    'hubble.gl re-exports everything from @hubble.gl/react'
  );

  t.end();
});
