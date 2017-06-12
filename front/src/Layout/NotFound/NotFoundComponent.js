import React, {Component} from 'react';
import {connect} from 'core/decorators';
import { setMetaTags } from 'core/Main/MainActions'
import {PageHeader} from 'core/components/content';


@connect(null, {
  setMetaTags
})
export default class NotFoundComponent extends Component {
  componentWillMount() {
    this.props.setMetaTags({
      title: 'Page Not found'
    });
  }
  render() {
    return (
      <div>
        <PageHeader title="Page not found" hideBreadcrumbs/>
        <div className="content container text-center">
          <h2>The page you are looking for does not exist</h2>
        </div>
      </div>
    );
  }
}
