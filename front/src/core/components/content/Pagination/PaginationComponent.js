import React from 'react';
import {connect} from 'core/decorators';
import { setQueryParam } from 'core/utils/helpers';
import {Pagination} from 'react-bootstrap';

require('./Pagination.scss');

@connect(state=>({
  location: state.main.location
}))
export default class PaginationComponent extends React.Component {
  render() {
    const { location: { query }, totalPages, activePage, onSelect } = this.props;
    if(totalPages<=1) return null;
    return (
      <Pagination
        prev={'Previous'}
        next={'Next'}
        bsSize="medium"
        boundaryLinks
        maxButtons={6}
        items={totalPages}
        activePage={activePage||parseInt(query.page)||1}
        onSelect={onSelect||this.handleOnSelect}/>
    )
  }
  handleOnSelect(page) {
    if(page==1) page = null;
    setQueryParam('page', page);
  }
}