import React from 'react';


export default class SelectComponent extends React.Component {
  render() {
    const {options, ...props} = this.props;
    return (
      <select {...props}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  }
}
