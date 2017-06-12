import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'core/decorators';
import Check from 'rc-checkbox';
import {setQueryParam} from 'core/utils/helpers';
import classnames from 'classnames';


@connect((state, {query, param})=>({
  value: query && query[param] || state.main.location.query[param]
}))
export default class FilterCheckComponent extends React.Component {
  static propTypes = {
    query: PropTypes.object,
    className: PropTypes.string,
    param: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  };
  render() {
    const {className, param, label, value} = this.props;
    const checked = value ? JSON.parse(value) : false;
    return (
      <label className={classnames('search-group search-check', className)}>
        <Check checked={checked} onChange={e=>setQueryParam(param, e.target.checked)} />
        <div>{label}</div>
      </label>
    )
  }
}