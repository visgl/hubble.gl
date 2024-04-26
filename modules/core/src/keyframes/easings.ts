// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

export type Easing = (p: number) => number

export const hold: Easing = p => (p === 1 ? 1 : 0);

export const linear: Easing = p => p;
