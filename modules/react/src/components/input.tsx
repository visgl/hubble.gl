// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import React, {ChangeEvent, PureComponent} from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  font: 14px / 20px Helvetica, Arial, sans-serif;
  box-sizing: border-box;

  &:last-child {
    margin-bottom: 20px;
  }

  > * {
    vertical-align: middle;
    white-space: nowrap;
  }
  label {
    display: inline-block;
    width: 40%;
    margin-right: 10%;
    margin-top: 2px;
    margin-bottom: 2px;
  }
  input,
  a,
  button,
  select {
    background: #fff;
    font-size: 0.9em;
    text-transform: none;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    padding: 0 4px;
    margin: 0;
    width: 50%;
    height: 20px;
    line-height: 1.833;
    text-align: left;
  }
  button {
    color: initial;
  }
  button:disabled {
    color: #aaa;
    cursor: default;
    background: #eee;
  }
  input {
    border: solid 1px #ccc;

    &:disabled {
      background: #eee;
    }
    &[type='checkbox'] {
      height: auto;
    }
  }

  .tooltip {
    left: 50%;
    top: 24px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms;
  }
  &:hover .tooltip {
    opacity: 1;
  }
`;

type GenericInputProps = {
  options: string[];
  name?: string;
  min?: number;
  max?: number;
  onChange: (name: string, value: string | number | boolean) => void;
  value?: string | number | boolean;
  altValue?: string | number | boolean;
  altType?: string;
  displayName: string;
  type: string;
  displayValue: string;
  disabled: boolean;
};

export default class GenericInput extends PureComponent<GenericInputProps> {
  _onChange(evt: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const {value, type} = evt.target;
    let newValue: string | number | boolean = value;
    if (type === 'checkbox') {
      newValue = (evt as ChangeEvent<HTMLInputElement>).target.checked;
    }
    if (type === 'range') {
      newValue = Number(value);
      if (this.props.min !== undefined) {
        newValue = Math.max(this.props.min, newValue);
      }
      if (this.props.max !== undefined) {
        newValue = Math.min(this.props.max, newValue);
      }
    }
    this.props.onChange(this.props.name, newValue);
  }

  _resetFunction() {
    return this.props.onChange(this.props.name, this.props.altValue);
  }

  render() {
    const {displayName, type, displayValue, disabled} = this.props;
    const props: GenericInputProps & {checked?: boolean} = {...this.props};
    delete props.displayName;
    delete props.displayValue;
    delete props.altType;
    delete props.altValue;

    if (type === 'link') {
      return (
        <div className="input">
          <label>{displayName}</label>
          <a href={displayValue} target="_new">
            {displayValue}
          </a>
        </div>
      );
    }
    if (type === 'function' || type === 'json') {
      const editable = 'altValue' in this.props;
      return (
        <div className="input">
          <label>{displayName}</label>
          <button
            type="button"
            disabled={!editable || disabled}
            onClick={this._resetFunction.bind(this)}
          >
            {displayValue}
          </button>
        </div>
      );
    }
    if (type === 'select') {
      return (
        <InputContainer>
          <div className="input">
            <label>{displayName}</label>
            <select disabled={disabled} onChange={this._onChange.bind(this)} value={displayValue}>
              {props.options.map((value: string, i: number) => (
                <option key={i} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </InputContainer>
      );
    }

    if (type === 'checkbox') {
      props.checked = props.value as boolean;
    }

    return (
      <InputContainer>
        <label>{displayName}</label>
        <div className="tooltip">
          {displayName}: {String(displayValue)}
        </div>
        <input {...props} value={displayValue} onChange={this._onChange.bind(this)} />
      </InputContainer>
    );
  }
}
