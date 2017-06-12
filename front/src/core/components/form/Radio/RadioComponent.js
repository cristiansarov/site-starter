import React from 'react';
import Radio from 'rc-radio';

require('./Radio.scss');

export default class RadioComponent extends React.Component {
  render() {
    return <Radio {...this.props} className="" onBlur={()=>{}} />
  }
}