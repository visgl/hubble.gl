import React, {Component} from 'react';
import App from 'website-examples/trips/app';

export default class TripsDemo extends Component {
  render() {
    const otherProps = this.props;

    return (
      <App {...otherProps} />
    );
  }
}
