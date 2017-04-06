import React from 'react';
import {FieldArray} from 'redux-form';
import {Field} from 'core/utils/components/FormComponents';
import classnames from 'classnames';
import './JSON.scss';


export default class JSON extends React.Component {
  typeList = [
    {label: 'Text', value: 'text'},
    {label: 'Textarea', value: 'textarea'}
  ];
  render() {
    return (
      <FieldArray name={this.props.name} component={this.renderArray.bind(this)} />
    )
  }
  renderArray({fields, meta: {error, touched}}) {
    const {label} = this.props;
    return (
      <div className={classnames('field-group', 'fg-name-'+name, {'fg-invalid': error, 'fg-touched': touched})}>
        { label && <label>{label}</label> }
        <div>
          <div className="form-json">
            {fields.map((field, k)=>(
              <div key={k} className="item">
                <Field name={`${field}.content`} placeholder="Content" />
                <Field name={`${field}.type`} type="select" options={this.typeList} placeholder="Type" />
              </div>
            ))}
            <button type="button" onClick={()=>fields.push({})}>Add</button>
          </div>
          { touched && error && <span className="fg-error">{error}</span> }
        </div>
      </div>
    )
  }
}
