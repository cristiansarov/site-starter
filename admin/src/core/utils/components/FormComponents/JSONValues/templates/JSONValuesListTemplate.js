import React from 'react';
import ContentEditable from './ContentEditable';


export default class JSONValuesListTemplate extends React.Component {

  static propTypes = {
    object: React.PropTypes.bool
  };

  render() {
    const {value, object, renderField} = this.props;
    return (
      <div className="child">
        {value && !!value.length && (
          <div>
            {object ? (
              value.map(this.renderField.bind(this))
            ) : (
              value.map(this.renderItem.bind(this))
            )}
          </div>
        )}
        <button type="button" onClick={this.addRow.bind(this)}>Add</button>
      </div>
    )
  }

  renderItem(item, k) {
    const {value: fieldList} = this.props;
    return (
      <div key={k} className="item">
        <span>"</span>
        <ContentEditable value={item} onChange={e=>this.onChange(k, e.target.value)} />
        <span>"{k !== fieldList.length - 1 && ','}</span>
        <div>
          <button type="button" onClick={()=>this.removeRow(k)}>x</button>
        </div>
      </div>
    )
  }

  renderField(rootValue, k) {
    const {value: fieldList, parent, keys, renderField} = this.props;
    return (
      <div key={k}>
        <span>&#123;</span>
        {keys.map((item, i)=> {
          let value;
          try {
            value = eval(`rootValue.${item.name}`);
          } catch(err) {}
          return (
            <div key={i} className="child">
              {renderField(item, value, `${parent}[${k}]`, i === keys.length - 1)}
            </div>
          );
        })}
        <span>&#125;{k !== fieldList.length - 1 && ','} <button type="button" onClick={()=>this.removeRow(k)}>x</button></span>
      </div>
    );
  }

  addRow() {
    const {value, onChange, object} = this.props;
    const newValue = value ? [...value] : [];
    newValue.push(object ? {} : '');
    onChange(newValue);
  }

  removeRow(index) {
    const {value, onChange} = this.props;
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  }

  onChange(index, targetValue) {
    const {value, onChange} = this.props;
    const newValue = [...value];
    newValue[index] = targetValue;
    onChange(newValue);
  }

}