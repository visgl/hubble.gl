// Copyright (c) 2019 Uber Technologies, Inc.
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

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {ButtonGroup, Button} from 'kepler.gl/components/common/styled-components';
// import {Settings} from 'components/common/icons';

const StyledAnimationControls = styled.div`
  display: flex;

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

// const IconButton = styled(Button)`
//   padding: 6px 4px;
//   svg {
//     margin: 0 6px;
//   }
// `;

function nop() {}
const DEFAULT_BUTTON_HEIGHT = '18px';

function AnimationExportsFactory() {
  const AnimationExports = ({
    isExportable,
    buttonStyle,
    exportAnimation = nop
    // openExportSettings = nop,
    // buttonHeight = DEFAULT_BUTTON_HEIGHT
  }) => {
    const btnStyle = buttonStyle ? {[buttonStyle]: true} : {};

    return (
      <StyledAnimationControls
        className={classnames('time-range-slider__control', {
          disabled: !isExportable
        })}
      >
        <ButtonGroup>
          {/* <IconButton  className="playback-control-button"
            {...btnStyle}
            onClick={openExportSettings}>
            <Settings height={buttonHeight} />
          </IconButton> */}
          <Button
            {...btnStyle}
            height={DEFAULT_BUTTON_HEIGHT}
            className={'playback-control-button'}
            onClick={exportAnimation}
          >
            Export
          </Button>
        </ButtonGroup>
      </StyledAnimationControls>
    );
  };
  return AnimationExports;
}

export default AnimationExportsFactory;
