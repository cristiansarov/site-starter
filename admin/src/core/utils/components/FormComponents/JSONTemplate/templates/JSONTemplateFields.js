import React from 'react';
import {Field} from 'core/utils/components/FormComponents';
import Children from './JSONTemplateChildren';


export default class JSONTemplateFields extends React.Component {

  typeList = [
    {label: 'Text', value: 'text'},
    {label: 'Object', value: 'object'},
    {label: 'List', value: 'list'},
    {label: 'List of Objects', value: 'objectList'}
  ];

  render() {
    const {fields} = this.props;
    return (
      <div className="form-json">
        {fields.map((field, k)=>(
          <div key={k}>
            <div className="item">
              <Field name={`${field}.type`} type="select" options={this.typeList} placeholder="Type" />
              <Field name={`${field}.name`} placeholder="Name" />
              <div><button type="button" onClick={()=>fields.remove(k)}>Remove</button></div>
            </div>
            <Children index={k} field={field} />
          </div>
        ))}
        <button type="button" onClick={()=>fields.push({type: 'text'})}>Add</button>
      </div>
    )
  }

}