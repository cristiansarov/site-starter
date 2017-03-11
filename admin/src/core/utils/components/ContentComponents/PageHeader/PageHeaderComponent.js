import React from 'react';

require('./PageHeader.scss');

export default React.createClass({
  render() {
    const { children} = this.props;
    return (
      <div className="page-header">
        <div className="container">
          <h1>{children}</h1>
        </div>
      </div>
    )
  }
});
