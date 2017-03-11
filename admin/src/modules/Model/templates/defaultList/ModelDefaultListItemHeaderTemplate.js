import React from 'react';
import {connect} from 'react-redux';
import {deleteItem} from '../../ModelActions';
import {setQueryParam} from 'core/utils/helpers';


@connect(state=>({
  models: state.main.models,
  query: state.main.location.query
}), {
  deleteItem
})
export default class ModelDefaultListItemHeaderTemplate extends React.Component {
  render() {
    const {models, query, columnName, modelName} = this.props;
    const columnConfig = models[modelName].fields[columnName].config.list;
    const columnContent = columnConfig.icon ? <i className={columnConfig.icon} /> : columnName;
    const sorts = query.sort ? query.sort.split(',') : [];
    return (
      <th key={columnName} className={`column-${columnConfig.template}`}>
        {columnContent}
        {[undefined, 'boolean', 'choice'].includes(columnConfig.template) && (
          <span className="column-sort-buttons">
            {sorts.includes(`${columnName} ASC`) ? (
                <button className="fa fa-caret-down" onClick={()=>this.removeSort(`${columnName} ASC`)} />
              ) : (!sorts.includes(`${columnName} DESC`)  && (
                <button className="fa fa-caret-down" onClick={()=>this.addSort(`${columnName} ASC`)} />
              ))}
            {sorts.includes(`${columnName} DESC`) ? (
                <button className="fa fa-caret-up" onClick={()=>this.removeSort(`${columnName} DESC`)} />
              ) : (!sorts.includes(`${columnName} ASC`)  && (
                <button className="fa fa-caret-up" onClick={()=>this.addSort(`${columnName} DESC`)} />
              ))}
          </span>
        )}
      </th>
    )
  }
  addSort(sort) {
    const {query} = this.props;
    const sorts = query.sort ? query.sort.split(',') : [];
    sorts.push(sort);
    setQueryParam('sort', sorts.join(','));
  }
  removeSort(sort) {
    const {query} = this.props;
    const sorts = query.sort.split(',');
    const sortIndex = sorts.indexOf(sort);
    sorts.splice(sortIndex, 1);
    setQueryParam('sort', sorts.length ? sorts.join(',') : null);
  }
}
