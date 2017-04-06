import React from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import { I18n } from 'react-redux-i18n';



@connect((state, props)=>({
  list: state.model.list[props.config.model],
  models: state.main.models
}))
export default class MultiSelectComponent extends React.Component {
  render() {
    const {config, list, models, ...props} = this.props;
    let configOptions = [];
    if(config.options) {
      configOptions = config.options.map(option=>({label: I18n.t(`option.${option}`), value: option}));
    } else if(props.options) {
      configOptions = props.options;
    } else if(models && config.model) {
      configOptions = list;
      props.labelKey = models[config.model].config.defaultField;
      props.valueKey = models[config.model].config.primaryKey;
    }
    return (
      <Select {...props} multi={true} options={configOptions} onBlur={()=>{}} />
    )
  }
}
