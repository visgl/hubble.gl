// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import React from 'react';
import Input from './input';
import {ENCODER_LIST, type Encoders} from './encoders';

export default function EncoderDropdown({
  disabled,
  encoder,
  setEncoder
}: {
  disabled: boolean;
  encoder: Encoders;
  setEncoder: (encoder: Encoders) => void;
}) {
  return (
    <Input
      type="select"
      disabled={disabled}
      displayName="Encoder"
      displayValue={encoder}
      onChange={(_, newValue: Encoders) => setEncoder(newValue)}
      options={ENCODER_LIST}
    />
  );
}
