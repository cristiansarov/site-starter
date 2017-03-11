import React, { Component } from 'react';
import { Field as ReduxField } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import { stringToObjectValue, setObjectDeepValue } from 'core/utils/helpers'
import classnames from 'classnames';
import Datetime from 'react-datetime';
import moment from 'moment';
import {Link} from 'react-router';
import Wysiwyg from './FormComponents/Wysiwyg/WysiwygComponent';
import Checkbox from './FormComponents/Checkbox/CheckboxComponent';
import Select from './FormComponents/Select/SelectComponent';
import MultiSelect from './FormComponents/Select/MultiSelectComponent';
import Image from './FormComponents/Image/ImageComponent';

// Export separate fields
export { Select };


/**
 * The Generic Field
 * @description An Interface for Form Field
 */
export class Field extends Component {

  renderFieldGroup({ input, name, type, label, placeholder, onClick, disabled, className, meta: { touched, error }, config={}, ...other }) {

    input.placeholder = placeholder;
    input.className = classnames('form-field', className);
    input.onClick = onClick;
    input.disabled = disabled;
    input.readOnly = config.readOnly;


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
      else if (type == 'wysiwyg') return <Wysiwyg {...input} />;
      else if (type == 'select') return <Select {...input} {...other} config={config} />;
      else if (type == 'checkbox') return <Checkbox {...input} {...other} config={config} />;
      else if (type == 'multiselect') return <MultiSelect {...input} {...other} config={config} />;
      else if (type == 'image') return <Image {...input} {...other} config={config} />;
      else if (type == 'date') return <Datetime {...input} value={input.value ? moment(input.value) : ''} dateFormat="DD MMM YYYY" timeFormat={false} onFocus={()=>{}} {...other} />;
      else if (type == 'datetime') return <Datetime {...input} value={input.value ? moment(input.value) : ''} dateFormat="DD MMM YYYY"  timeFormat="hh:mm a" onFocus={()=>{}} {...other} />;
    }

  }

  render() {
    if(this.props.type=='passwordCombo') return (
      <div>
        <ReduxField component={this.renderFieldGroup} {...this.props} type="password" name="passwordNew" />
        <ReduxField component={this.renderFieldGroup} {...this.props} type="password" name="passwordRepeat"
                    {...{[this.props.placeholder?'placeholder':'label']: "Password Repeat"}} />
      </div>
    );
    return <ReduxField component={this.renderFieldGroup} {...this.props} />;
  }
}


/**
 * FORM SUBMIT BUTTON
 */
export class SubmitButton extends Component {
  render() {
    var props = {};
    if (this.props.disabled || this.props.loading) props.disabled = true;
    return (
      <button type="submit" className="button button--green" {...props}>
        { this.props.loading && <span className="button-spinner"><i className="fa fa-spinner fa-spin"/></span> }
        { this.props.children || I18n.t('button.save') }
      </button>
    );
  }
}


/**
 * FORM RESET BUTTON
 */
export class ResetButton extends Component {
  render() {
    return (
      <button type="button" className="button" onClick={this.props.reset}>
        { this.props.children || I18n.t('button.reset') }
      </button>
    );
  }
}


/**
 * FORM RETURN BUTTON
 */
export class ReturnButton extends Component {
  render() {
    return (
      <Link className="button" to={this.props.route}>
        { this.props.children || I18n.t('button.return') }
      </Link>
    );
  }
}


/**
 * VALIDATION FUNCTION
 * @description Returns validate function required for Redux Form
 * @param:config The configuration object for generating the rules
 */
export function Validate(config) {

  var fields = config.fields || config;
  var tabList = config.tabList || [];


  /**
   * VALIDATION RULES
   */
  var rules = {
    required: function (fieldValue) {
      return !fieldValue;
    },
    arrayRequired: function (fieldValue) {
      if (!fieldValue) return false;
      return fieldValue.some(arrayItem=>!arrayItem);
    },
    propsInArrayRequired: function (fieldValue) {
      if (!fieldValue) return false;
      return fieldValue.some(arrayItem=> {
        var arrayInvalid = true;
        _.forEach(arrayItem, propValue=> {
          if (propValue) arrayInvalid = false;
        });
        return arrayInvalid;
      });
    },
    propsInArrayPropRequired: function (fieldValue, prop) {
      if (!fieldValue) return false;
      return fieldValue.some(arrayItem=> {
        var arrayInvalid = true;
        _.forEach(arrayItem[prop], propValue=> {
          if (propValue) arrayInvalid = false;
        });
        return arrayInvalid;
      });
    },
    minLength: function (fieldValue, validationValue) {
      if (!fieldValue) return false;
      return fieldValue.length < validationValue;
    },
    maxLength: function (fieldValue, validationValue) {
      if (!fieldValue) return false;
      return fieldValue.length > validationValue;
    },
    passwordRepeat: function(repeatPasswordValue, initialPasswordName, values) {
      if(!repeatPasswordValue) return false;
      var initialPasswordValue = stringToObjectValue(initialPasswordName, values);
      return initialPasswordValue!=repeatPasswordValue;
    },
    type: function (fieldValue, validationValue) {
      if (!fieldValue) return false;
      if(validationValue=='email') {
        var emailRegexp = /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,20})$/;
        return !emailRegexp.test(fieldValue);
      } else if(validationValue=='integer') {
        return typeof fieldValue != 'number';
      } else if(validationValue=='string') {
        return typeof fieldValue != 'string';
      } else {
        return false;
      }
    }
  };


  /**
   * Redux Form validate function returned
   */
  return function (values) {
    const errors = {};

    // validate field function
    var validateField = function (fieldName, validations) {
      var isInvalid, validationType;
      var validationKeys = Object.keys(validations);
      for (var x = 0; x < validationKeys.length; x++) {
        validationType = validationKeys[x];
        var validationValue = validations[validationType];
        if (rules[validationType]) {
          var fieldValue = stringToObjectValue(fieldName, values);
          isInvalid = rules[validationType](fieldValue, validationValue, values);
          if (isInvalid) break;
        }
      }
      return isInvalid ? validationType : false;
    };

    // validate all fields
    _.forEach(fields, (validations, fieldName) => {
      var isInvalid = validateField(fieldName, validations)
      if (isInvalid) {
        const validationMessage = ['propsInArrayPropRequired'].includes(isInvalid) ? {_error: I18n.t('validation.' + isInvalid, validations)} : I18n.t('validation.' + isInvalid, validations);
        setObjectDeepValue(errors, fieldName, validationMessage);
      }
    });

    // validate tabList
    tabList.forEach((tabFields, tabIndex) => {
      errors.tabList = errors.tabList || {};
      var isTabInvalid = false;
      tabFields.forEach(tabField => {
        if (validateField(tabField, fields[tabField])) {
          isTabInvalid = true;
        }
      });
      errors.tabList[tabIndex] = isTabInvalid
    });

    return errors;
  }

}
