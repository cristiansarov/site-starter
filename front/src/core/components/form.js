import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field as ReduxField} from 'redux-form';
import {I18n} from 'react-redux-i18n';
import {Link} from 'react-router';
import _ from 'lodash';
import {stringToObjectValue, setObjectDeepValue} from 'core/utils/helpers';
import classnames from 'classnames';
import Check from './form/Check/CheckComponent';
import Radio from './form/Radio/RadioComponent';
import DateTime from './form/DateTime/DateTimeComponent';
import Select from './form/Select/SelectComponent'
import File from './form/File/FileComponent'



/**
 * The Generic Field
 * @description An Interface for Form Field
 */
export class Field extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string
  };

    renderFieldGroup({input, type, label, placeholder, onClick, disabled, replaceValue, replaceChecked, isLoading, autoFocus, icon, meta: {touched, error, form}, className, ...rest}) {

    input.placeholder = placeholder;
    input.className = 'form-control';
    input.onClick = onClick;
    input.disabled = disabled;
    input.value = typeof replaceValue != 'undefined' ? replaceValue : input.value;
    input.checked = typeof replaceChecked != 'undefined' ? replaceChecked : input.checked;
    input.autoFocus = autoFocus;

    if (['checkbox', 'radio'].includes(type)) return (
      <label
        className={classnames('field-group', className, `fg-name-${input.name}`, `fg-type-${type}`, {'fg-invalid': error, 'fg-touched': touched})}>
        <strong>{ renderField() }</strong>
        <div>
          { label }
          { touched && error && <span className="field-error">{error}</span> }
        </div>
      </label>
    );

    return (
      <div
        className={classnames('field-group', className, `fg-name-${input.name}`, `fg-type-${type}`, {'fg-invalid': error, 'fg-touched': touched})}>
        { label && (
          <label>
            {label}
            {icon && <i className={icon} />}
          </label>
        ) }
        <div>
          { renderField() }
          { touched && error && <span className="field-error">{error}</span> }
        </div>
      </div>
    );

    function renderField() {

            const inputTypes = ['text', 'password', 'email', 'phone', 'hidden', 'number', 'tel' ];
            type = type || inputTypes[0];
            if (inputTypes.includes(type)) return <input type={type} {...input} {...rest} />; // for all fields in inputFields constant
            else if (type == 'display') return input.value;
            else if (type == 'checkbox') return <Check {...input} {...rest} />;
            else if (type == 'file') return <File {...input} {...rest} form={form} />;
            else if (type == 'radio') return <Radio {...input} {...rest} />;
            else if (type == 'textarea') return <textarea {...input} />;
            else if (type == 'select')return <Select isLoading={isLoading} {...input} {...rest}/>;
            else if (type == 'datetime') return <DateTime {...input} {...rest} />;
        }

  }

  render() {
    return <ReduxField component={this.renderFieldGroup} {...this.props} />;
  }
}


/**
 * FORM SUBMIT BUTTON
 */
export class SubmitButton extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool
  };
  render() {
    const {disabled, loading, children, className} = this.props;
    return (
      <button type="submit" className={className} disabled={disabled||loading}>
        { loading && <span className="button-spinner"><i className="icon-spinner icon-spin"/></span> }
        { children }
      </button>
    );
  }
}

/**
 * FORM DELETE BUTTON
 */

export class DeleteButton extends Component {
  render() {
    return (
      <button type="button" className="button" onClick={this.props.onDelete}>
        { this.props.children || I18n.t('button.delete') }
      </button>
    )
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
        <i className="icon-arrow-left"/>
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

  let fields = config.fields || config;
  let tabList = config.tabList || [];

  // Warning - every validation that targets a FieldArray must be inserted here
  const arrayValidationRules = ['surveyValid', 'propsInArrayPropRequired'];

  /**
   * VALIDATION RULES
   */
  let rules = {
    required: function (fieldValue) {
      return !fieldValue;
    },
    wysiwygRequired: function (fieldValue) {
      return !fieldValue || fieldValue == '<p><br></p>' || fieldValue.trim() == '';
    },
    arrayRequired: function (fieldValue) {
      if (!fieldValue) return false;
      return fieldValue.some(arrayItem=>!arrayItem);
    },
    propsInArrayRequired: function (fieldValue) {
      if (!fieldValue) return false;
      return fieldValue.some(arrayItem=> {
        let arrayInvalid = true;
        _.forEach(arrayItem, propValue=> {
          if (propValue) arrayInvalid = false;
        });
        return arrayInvalid;
      });
    },
    propsInArrayPropRequired: function (fieldValue, prop) {
      if (!fieldValue) return false;
      return fieldValue.some(arrayItem=> {
        let arrayInvalid = true;
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
      return fieldValue.length >= validationValue;
    },
    integer: function (fieldValue) {
      if (!fieldValue) return false;
      return typeof fieldValue == 'number';
    },
    email: function (fieldValue) {
      if (!fieldValue) return false;
      let emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return !emailRegexp.test(fieldValue);
    }
  };


  /**
   * Redux Form validate function returned
   */
  return function (values) {
    const errors = {};

    // validate field function
    let validateField = function (fieldName, validations) {
      let isInvalid, validationType;
      let validationKeys = Object.keys(validations);
      for (let x = 0; x < validationKeys.length; x++) {
        validationType = validationKeys[x];
        let validationValue = validations[validationType];
        if (rules[validationType]) {
          let fieldValue = stringToObjectValue(fieldName, values);
          isInvalid = rules[validationType](fieldValue, validationValue, values);
          if (isInvalid) break;
        }
      }
      return isInvalid ? validationType : false;
    };

    // validate all fields
    _.forEach(fields, (validations, fieldName) => {
      let isInvalid = validateField(fieldName, validations)
      if (isInvalid) {
        const validationMessage = arrayValidationRules.includes(isInvalid) ? {_error: I18n.t('validation.' + isInvalid, {fieldName})} : I18n.t('validation.' + isInvalid, {fieldName});
        setObjectDeepValue(errors, fieldName, validationMessage);
      }
    });

    // validate tabList
    tabList.forEach((tabFields, tabIndex) => {
      errors.tabList = errors.tabList || {};
      let isTabInvalid = false;
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
