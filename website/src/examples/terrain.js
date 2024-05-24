import React, {Component} from 'react';
import App from 'website-examples/terrain/app';

export default class TerrainDemo extends Component {
  render() {
    const otherProps = this.props;

    return (
      <App {...otherProps} />
    );
  }
}
