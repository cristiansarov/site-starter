import {I18n} from 'react-redux-i18n';
import _ from 'lodash';
import { stringToObjectValue, setObjectDeepValue } from 'core/utils/helpers'

/**
 * VALIDATION FUNCTION
 * @description Returns validate function required for Redux Form
 * @param:config The configuration object for generating the rules
 */
export default function Validate(config) {

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
