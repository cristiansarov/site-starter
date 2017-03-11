import React from 'react';
import Datetime from 'react-datetime';

export default React.createClass({
  render() {
    return (
      <Datetime {...this.props} dateFormat="DD MMM YYYY" timeFormat={false} onFocus={()=>{}} />
    );
  }
})
