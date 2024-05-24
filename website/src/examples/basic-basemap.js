import React, {Component} from 'react';
import App from 'website-examples/basic-basemap/app';

export default class BasicBasemapDemo extends Component {
  render() {
    const otherProps = this.props;

    return (
      <App {...otherProps} />
    );
  }
}
