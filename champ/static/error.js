import React, { Component } from "react";

class ErrorBlock extends Component {
  render () {
    return this.props.error ? <b>Error: {this.props.error }  { ' ' + (this.props.error_arg || '')} </b> : '';
  }
}

export default ErrorBlock;