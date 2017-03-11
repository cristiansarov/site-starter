import React from 'react';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

export default class CheckboxComponent extends React.Component {
  render() {
    const { config, ...props } = this.props;
    return (
      <div>
        <Checkbox {...props} />
      </div>
    )
  }
}
