import React from 'react';

export default class SitemapModelComponent extends React.Component {

  render() {
    const {value} = this.props;
    return (
      <div>
        <label>Model Name</label>
        <input type="text" value={value ? value.name : ''} onChange={e=>this.onChange('name', e.target.value)}/>
        <label>Param</label>
        <input type="text" value={value ? value.param : ''} onChange={e=>this.onChange('param', e.target.value)}/>
        <label>DB Param</label>
        <input type="text" value={value ? value.dbParam : ''} onChange={e=>this.onChange('dbParam', e.target.value)}/>
      </div>
    )
  }

  onChange(name, targetValue) {
    const {value, onChange} = this.props;
    onChange({
      ...value,
      [name]: targetValue
    });
  }

}