import React from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import { I18n } from 'react-redux-i18n';


@connect((state, props)=>({
  list: state.model.list[props.config.model],
  models: state.main.models
}))
export default class SelectComponent extends React.Component {
  render() {
    const {config, list, models, onChange, options, ...props} = this.props;
    let configOptions = [];
    let labelKey = 'label';
    let valueKey = 'value';
    let objectValue = false;
    if(config.options) {
      configOptions = config.options.map(option=>({label: I18n.t(`option.${option}`), value: option}));
    } else if(options) {
      configOptions = options;
    } else if(models && config.model) {
      configOptions = list;
      labelKey = models[config.model].config.defaultField;
      valueKey = models[config.model].config.primaryKey;
      objectValue = true;
    }
    return (
      <Select {...props} labelKey={labelKey} valueKey={valueKey} options={options||configOptions} onBlur={()=>{}}
              onChange={obj=>onChange(!objectValue && obj ? obj[valueKey] : obj)} />
    )
  }
}
