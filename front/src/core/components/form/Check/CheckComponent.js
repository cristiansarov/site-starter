import React from 'react';
import Check from 'rc-checkbox';

require('./Check.scss');


export default class CheckComponent extends React.Component {
  render() {
    return <Check {...this.props} className="" onBlur={()=>{}} />
  }
}