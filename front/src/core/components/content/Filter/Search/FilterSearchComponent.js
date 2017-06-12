import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'core/decorators';
import debounce from 'debounce';
import {setQueryParam} from 'core/utils/helpers';
import {I18n} from 'react-redux-i18n';


@connect((state, {query, param})=>({
  value: query && query[param||'search'] || state.main.location.query[param||'search']
}))
export default class FilterSearchComponent extends React.Component {

  static propTypes = {
    query: PropTypes.object,
    className: PropTypes.string,
    param: PropTypes.string,
    placeholder: PropTypes.string,
    icon: PropTypes.string
  };

  componentWillMount() {
    this.state = {search: this.props.value};
  }

  search(value) {
    this.setState({search: value});
    this.debounceSearch(value);
  }

  debounceSearch = debounce(value=>{
    const {beforeSearch, param} = this.props;
    if(typeof beforeSearch == 'function') beforeSearch();
    this.setState({search: value});
    setQueryParam(param||'search', value||null);
  }, 300);

  render() {
    const {placeholder, value, param, icon} = this.props;
    const {search} = this.state;
    return (
      <div className="search-group search-input">
        <div>
          <input className="form-control" type="text"
                 value={typeof search != 'undefined' ? search : value}
                 placeholder={placeholder||I18n.t('message.searchPlaceholder')}
                 onChange={e=>this.search(e.target.value)} />
        </div>
        {(search || value) && (
          <button onClick={()=>{this.setState({search: ''});setQueryParam(param||'search', null)}}>×</button>
        )}
        {icon && <i><span className={icon} /></i>}
      </div>
    )
  }
}