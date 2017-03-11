import React from 'react';
import {connect} from 'react-redux';
import debounce from 'debounce';
import {setQueryParam} from 'core/utils/helpers';
import {I18n} from 'react-redux-i18n';
import './SearchInput.scss';


@connect(state=>({
  query: state.main.location.query
}))
export default class SearchInputComponent extends React.Component {

  componentWillMount() {
    this.defaultParam = 'search';
    const {query, param=this.defaultParam} = this.props;
    this.state = {search: query[param]};
  }

  search(value) {
    this.setState({search: value});
    this.debounceSearch(value);
  }

  debounceSearch = debounce(value=>{
    const {param=this.defaultParam} = this.props;
    this.setState({search: value});
    setQueryParam(param, value||null);
  }, 300);

  render() {
    const {placeholder, query, param=this.defaultParam} = this.props;
    const {search} = this.state;
    return (
      <div className="filter-control-input">
        <input
          type="text"
          className="form-control"
          value={typeof search != 'undefined' ? search : query[param]}
          placeholder={placeholder||I18n.t('message.searchPlaceholder')}
          onChange={e=>this.search(e.target.value)}/>
        {search ? (
          <button className="fa fa-times" onClick={()=>{this.setState({search: ''});setQueryParam(param, null)}} />
        ) : (
          <i className="fa fa-search" />
        ) }
      </div>
    )
  }
}
