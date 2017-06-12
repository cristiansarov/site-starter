import React from 'react';
import {connect} from 'react-redux';
import {Field} from 'core/utils/components/FormComponents';
import {formValueSelector, FieldArray} from 'redux-form';
import Fields from './JSONTemplateFields';


@connect((state, {field})=>({
  type: formValueSelector('TabsForm')(state, `${field}.type`)
}))
export default class JSONTemplateObjectType extends React.Component {
  render() {
    const {field, type} = this.props;
    if(!['object', 'objectList'].includes(type)) return null;
    return (
      <FieldArray name={`${field}.children`} component={({fields})=><Fields fields={fields} />} />
    )
  }

}