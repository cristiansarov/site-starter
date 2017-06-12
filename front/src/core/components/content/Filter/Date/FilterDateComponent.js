import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'core/decorators';
import {setQueryParam} from 'core/utils/helpers';
import {I18n} from 'react-redux-i18n';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import classnames from 'classnames';
import moment from 'moment';
import './FilterDate.scss';



@connect((state, {query, param, format})=>({
  value: query && query[param] || state.main.location.query[param],
  format: format || 'YYYYMMDD'
}))
export default class FilterDateComponent extends React.Component {
  static propTypes = {
    query: PropTypes.object,
    className: PropTypes.string,
    param: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    icon: PropTypes.string,
    max: PropTypes.object,
    min: PropTypes.object
  };
  render() {
    const {className, placeholder, param, value, icon, format} = this.props;
    return (
      <div className={classnames('search-group search-date', className)}>
        <Datetime value={moment(value, format)}
                  inputProps={{placeholder: placeholder||I18n.t('message.searchPlaceholder')}}
                  onChange={data=>setQueryParam(param, data.format(format))}
                  dateFormat="DD MMM YYYY"
                  timeFormat={false}
                  closeOnSelect={true}
                  isValidDate={this.isValidDate.bind(this)}
        />
        {value && (
          <button onClick={()=>setQueryParam(param||'search', null)}>×</button>
        )}
        {icon && <i><span className={icon} /></i>}
      </div>
    )
    
  }
  isValidDate (current) {
    const {min, max} = this.props;
    let isValidAfter = min ? current.isAfter(moment(min).subtract(1, 'Days')) : true;
    let isValidBefore = max ? current.isBefore(max) : true;
    return isValidAfter && isValidBefore;
  }
}