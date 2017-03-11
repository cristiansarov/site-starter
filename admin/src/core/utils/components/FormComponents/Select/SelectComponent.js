import React from 'react';
import Select from 'react-select';
import { I18n } from 'react-redux-i18n';


export default class SelectComponent extends React.Component {
  render() {
    const {config, ...props} = this.props;
    const configOptions = config.options && config.options.map(option=>({label: I18n.t(`option.${option}`), value: option}));
    return (
      <Select {...props} options={props.options||configOptions} onBlur={()=>{}} onChange={object=>props.onChange(configOptions?object.value:object)} />
    )
  }
}
