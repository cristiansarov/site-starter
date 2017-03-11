import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {deleteItem} from '../../ModelActions';
import ItemHeader from './ModelDefaultListItemHeaderTemplate';
import ItemFilter from './ModelDefaultListItemFilterTemplate';
import ItemContent from './ModelDefaultListItemContentTemplate';
import {Pagination} from 'ContentComponents';
import {getModelPrimaryKey, setQueryParam} from 'core/utils/helpers';
import Select from 'react-select';


@connect((state, props)=>({
  models: state.main.models,
  list: state.model.pagedList[props.modelName],
  totalPages: state.model.totalPages[props.modelName],
  query: state.main.location.query
}), {
  deleteItem
})
export default class ModelListItemTemplate extends React.Component {

  pageSizes = [
    {label: '10 per page', value: '10'},
    {label: '25 per page', value: '25'},
    {label: '50 per page', value: '50'},
    {label: '100 per page', value: '100'}
  ];

  render() {
    const {checked, modelName, models, list, checkOne, checkAll, deleteItems, totalPages, getList, query} = this.props;
    const columns = models[modelName].structure.list;
    return (
      <div>

        <div className="list-actions">
          {!!Object.keys(checked).length && (
            <div className="check-actions">
              <button className="button" onClick={deleteItems}>Delete</button>
            </div>
          )}
        </div>

        {list && (
          <table className="table">
            <thead>
            <tr>
              <th>
                <input type="checkbox" checked={list.length&&Object.keys(checked).length==list.length} onChange={e=>checkAll()}/>
              </th>
              {columns.map(columnName=>(
                <ItemHeader key={columnName} columnName={columnName} modelName={modelName} />
              ))}
              <th>Actions</th>
            </tr>
            <tr>
              <td />
              {columns.map(columnName=>(
                <td key={columnName}><ItemFilter columnName={columnName} modelName={modelName} /></td>
              ))}
              <td>
                <Select options={this.pageSizes} value={query.perPage||this.pageSizes[0].value}
                        onChange={data=>setQueryParam('perPage', data ? (data.value != this.pageSizes[0].value ? data.value : null) : null)} />
              </td>
            </tr>
            </thead>
            {!!list.length && (
                <tbody>
                {list.map((item, k)=>(
                  <ItemContent key={item[getModelPrimaryKey(modelName)]} k={k} item={item} isChecked={checked[k]} modelName={modelName} getList={getList} checkOne={checkOne} />
                ))}
                </tbody>
              )}
          </table>
        ) }

        {list && !list.length && (
          <div>No content</div>
        )}

        <Pagination totalPages={totalPages} />

      </div>
    )
  }
}
