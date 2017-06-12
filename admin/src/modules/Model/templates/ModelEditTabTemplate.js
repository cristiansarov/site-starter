import React from 'react';
import {Field} from '../../../core/utils/components/FormComponents';
import {I18n} from 'react-redux-i18n';


export default class ModelEditTabTemplate extends React.Component {
  render() {
    const {fields} = this.props;
    return (
      <div>
        {fields.map(field => (
          <Field key={field.name}
                 name={field.name}
                 type={field.template}
                 label={I18n.t(`field.${field.name}`)}
                 config={field}
          />
        ))}
      </div>
    )
  }
}
