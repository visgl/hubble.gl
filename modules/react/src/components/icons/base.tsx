// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import React, {CSSProperties, Component, PropsWithChildren} from 'react';
import PropTypes from 'prop-types';

const getStyleClassFromColor = (totalColor: number, colors: string[]): string[] =>
  new Array(totalColor)
    .fill(1)
    .reduce((accu: string, c, i: number) => `${accu}.cr${i + 1} {fill:${colors[i % colors.length]};}`, '');


export type BaseIconProps = PropsWithChildren<{
  height?: string | number
  width?: string | number
  viewBox?: string
  style?: CSSProperties
  predefinedClassName?: string
  className?: string
  colors?: string[],
  totalColor?: number
}> & Omit<React.SVGProps<SVGSVGElement>, 'ref'>
  
export default class Base extends Component<BaseIconProps> {
  static displayName = 'Base Icon';

  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    /** Set the width of the icon, ex. '16px' */
    width: PropTypes.string,
    /** Set the viewbox of the svg */
    viewBox: PropTypes.string,
    /** Path element */
    children: PropTypes.node,

    predefinedClassName: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    height: null,
    width: null,
    viewBox: '0 0 64 64',
    predefinedClassName: '',
    className: '',
    style: {
      fill: 'currentColor'
    }
  };

  render() {
    const {
      height,
      width,
      viewBox,
      style,
      children,
      predefinedClassName,
      className,
      colors,
      totalColor,
      ...props
    } = this.props;
    const svgHeight = height;
    const svgWidth = width || svgHeight;

    const fillStyle =
      Array.isArray(colors) && totalColor && getStyleClassFromColor(totalColor, colors);

    return (
      <svg
        viewBox={viewBox}
        width={svgWidth}
        height={svgHeight}
        style={style}
        className={`${predefinedClassName} ${className}`}
        {...props}
      >
        {fillStyle ? <style type="text/css">{fillStyle}</style> : null}
        {children}
      </svg>
    );
  }
}
