// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import log from '../utils/log';

declare global {
  const __VERSION__: string;
}

function checkVersion() {
  // Version detection using babel plugin
  // Fallback for tests and SSR since global variable is defined by Webpack.
  const version =
    typeof __VERSION__ !== 'undefined'
      ? __VERSION__
      : globalThis.HUBBLE_VERSION || 'untranspiled source';

  // Note: a `hubble` object not created by hubble.gl may exist in the global scope
  const existingVersion = globalThis.hubble && globalThis.hubble.VERSION;

  if (existingVersion && existingVersion !== version) {
    throw new Error(`hubble.gl - multiple versions detected: ${existingVersion} vs ${version}`);
  }

  if (!existingVersion) {
    log.log(1, `hubble.gl ${version}`)();

    globalThis.hubble = {
      ...globalThis.hubble,
      VERSION: version,
      version,
      log
    };
  }

  return version;
}

export const VERSION = checkVersion();
