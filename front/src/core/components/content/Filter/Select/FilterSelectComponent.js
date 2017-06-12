import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'core/decorators';
import {setQueryParam} from 'core/utils/helpers';
import {I18n} from 'react-redux-i18n';
import Select from 'react-select-plus';
import classnames from 'classnames';


@connect((state, {query, param, valueKey, labelKey})=>({
  value: query && query[param] || state.main.location.query[param],
  valueKey: valueKey || 'value',
  labelKey: labelKey || 'label'
}))
export default class FilterSelectComponent extends React.Component {
  static propTypes = {
    query: PropTypes.object,
    className: PropTypes.string,
    param: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    icon: PropTypes.string
  };
  render() {
    const {className, placeholder, param, icon, labelKey, valueKey, ...props} = this.props;
    return (
      <div className={classnames('search-group search-select', className)}>
        <Select {...props}
                value={this.getValue()}
                onChange={data=>setQueryParam(param, data && data[valueKey])}
                placeholder={placeholder||I18n.t('message.searchPlaceholder')}
                labelKey={labelKey}
                valueKey={valueKey}
        />
        {icon && <i><span className={icon} /></i>}
      </div>
    )
  }
  getValue() {
    const {options, valueKey, value} = this.props;
    let result = null;
    if(options && value) options.forEach(item => {
      if(item[valueKey] == value) result = item;
      if(item.options) item.options.forEach(item=>{
        if(item[valueKey] == value) result = item;
      })
    });
    return result;
  }
}