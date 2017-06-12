import React from 'react';
import {Field} from 'core/utils/components/FormComponents';
import classnames from 'classnames';
import './JSONTemplate.scss';
import Fields from './templates/JSONTemplateFields';


export default class JSONTemplate extends React.Component {
  render() {
    const {label, fields, meta: {error, touched}} = this.props;
    return (
      <div className={classnames('field-group', 'fg-name-'+name, {'fg-invalid': error, 'fg-touched': touched})}>
        { label && <label>{label}</label> }
        <div>
          <Fields fields={fields} />
          { touched && error && <span className="fg-error">{error}</span> }
        </div>
      </div>
    )
  }
}
