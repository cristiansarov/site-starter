import React from 'react';
import { Layout } from 'ContentComponents';

require('./Model.scss');

export default class Model extends React.Component {
  render() {
    return (
      <Layout key={this.props.params.modelName}>
        {this.props.children}
      </Layout>
    )
  }
}
