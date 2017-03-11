import React from 'react';
import { PageHeader, Loader, Layout } from 'ContentComponents';

require('./Dashboard.scss');

export default class DashboardComponent extends React.Component {

  componentWillMount() {
    document.title = 'Dashboard';
  }

  render() {
    return (
      <Layout>
        Dashboard
      </Layout>
    );
  }

}
