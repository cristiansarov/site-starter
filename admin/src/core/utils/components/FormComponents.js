import React, { Component } from 'react';
import { Field as ReduxField, FieldArray } from 'redux-form';
import classnames from 'classnames';
import Datetime from 'react-datetime';
import Validate from './Validate';
import moment from 'moment';
import SubmitButton from './FormComponents/buttons/SubmitButtonComponent';
import ResetButton from './FormComponents/buttons/ResetButtonComponent';
import ReturnButton from './FormComponents/buttons/ReturnButtonComponent';
import Slug from './FormComponents/Slug/SlugComponent';
import Wysiwyg from './FormComponents/Wysiwyg/WysiwygComponent';
import Checkbox from './FormComponents/Checkbox/CheckboxComponent';
import Select from './FormComponents/Select/SelectComponent';
import MultiSelect from './FormComponents/Select/MultiSelectComponent';
import Image from './FormComponents/Image/ImageComponent';
import JSONTemplate from './FormComponents/JSONTemplate/JSONTemplateComponent';
import JSONValues from './FormComponents/JSONValues/JSONValuesComponent';
import SitemapModel from './FormComponents/SitemapModel/SitemapModelComponent';

// Export separate fields
export { Select, Validate, SubmitButton, ResetButton, ReturnButton };


/**
 * The Generic Field
 * @description An Interface for Form Field
 */
export class Field extends Component {

  render() {
    if(this.props.type=='passwordCombo') return (
      <div>
        <ReduxField component={this.renderFieldGroup} {...this.props} type="password" name="passwordNew" />
        <ReduxField component={this.renderFieldGroup} {...this.props} type="password" name="passwordRepeat"
                    {...{[this.props.placeholder?'placeholder':'label']: "Password Repeat"}} />
      </div>
    );
    if(['jsonTemplate'].includes(this.props.type)) {
      return <FieldArray name={this.props.name} component={this.renderArrayGroup.bind(this)} {...this.props} />
    }
    return <ReduxField component={this.renderFieldGroup.bind(this)} {...this.props} />;
  }

  renderFieldGroup({ input, name, type, label, placeholder, onClick, disabled, className, meta: { touched, error, form }, config={}, ...other }) {

    input.placeholder = placeholder;
    input.className = classnames('form-field', className);
    input.onClick = onClick;
    input.disabled = disabled;
    input.readOnly = config.readOnly;
    input.onBlur = ()=>{};
    other.onFocus = ()=>{};


    return (
      <div className={classnames('field-group', 'fg-name-'+name, {'fg-invalid': error, 'fg-touched': touched})}>
        { label && <label>{label}</label> }
        <div>
          { renderField() }
          { touched && error && <span className="fg-error">{error}</span> }
        </div>
      </div>
    );

    function renderField() {
      const inputTypes = ['text', 'password', 'email', 'number', 'phone'];
      type = type || inputTypes[0];
      if (inputTypes.includes(type)) return <input type={type} {...input} {...other} />; // for all fields in inputFields constant
      else if (type == 'textarea') return <textarea {...input} />;
      else if (type == 'jsonValues') return <JSONValues {...input} {...other} config={config} form={form} />;
      else if (type == 'sitemapModel') return <SitemapModel {...input} {...other} config={config} form={form} />;
      else if (type == 'slug') return <Slug {...input} {...other} form={form} />;
      else if (type == 'wysiwyg') return <Wysiwyg {...input} />;
      else if (type == 'select') return <Select {...input} {...other} config={config} />;
      else if (type == 'checkbox') return <Checkbox {...input} {...other} config={config} />;
      else if (type == 'multiselect') return <MultiSelect {...input} {...other} config={config} />;
      else if (type == 'image') return <Image {...input} {...other} config={config} />;
      else if (type == 'date') return <Datetime {...input} value={input.value ? moment(input.value) : ''} dateFormat="DD MMM YYYY" timeFormat={false} onFocus={()=>{}} {...other} />;
      else if (type == 'datetime') return <Datetime {...input} value={input.value ? moment(input.value) : ''} dateFormat="DD MMM YYYY"  timeFormat="hh:mm a" onFocus={()=>{}} {...other} />;
    }

  }

  renderArrayGroup({type, ...props}) {
    if(type === 'jsonTemplate') return <JSONTemplate {...props} />
  }

}