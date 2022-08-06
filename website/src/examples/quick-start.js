import React, {Component} from 'react';
import App from 'website-examples/quick-start/app';

export default class QuickStartDemo extends Component {
  render() {
    const otherProps = this.props;

    return (
      <App {...otherProps} />
    );
  }
}
