import React from 'react';
import {connect} from 'core/decorators';
import {setQueryParam} from 'core/utils/helpers';
import Select from 'react-select';
import './SelectFilter.scss';


@connect(state=>({
  query: state.main.location.query
}))
export default class SelectFilterComponent extends React.Component {

  render() {
    const {query, className, param, ...props} = this.props;
    return (
      <Select {...props}
              openOnFocus={true}
              autoBlur={true}
              className={className||'Select--filter'}
              value={query[param]}
              onChange={this.handleChange.bind(this)} />
    )
  }

  handleChange(item) {
    const {param, valueKey} = this.props;
    if(item) setQueryParam(param, item[valueKey||'value']);
    else setQueryParam(param, null);
  }

}