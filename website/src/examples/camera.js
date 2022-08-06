import React, {Component} from 'react';
import App from 'website-examples/camera/app';

export default class CameraDemo extends Component {
  render() {
    const otherProps = this.props;

    return (
      <App {...otherProps} />
    );
  }
}
