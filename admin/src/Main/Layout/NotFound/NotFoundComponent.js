import React, {Component} from 'react';
import { connect } from 'react-redux';

class NotFoundComponent extends Component {
  componentWillMount() {
    document.title = 'Page not found';
  }
  render() {
    return (
      <section className="page-not-found">
        <div className="container">
          <h2>The page doesn't exist</h2>
        </div>
      </section>
    );
  }
}

export default connect(null, null)(NotFoundComponent);
