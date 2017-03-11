import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {deleteItem} from '../../ModelActions';
import {I18n} from 'react-redux-i18n';
import Item from './ModelDefaultListItemTemplate';
import {Pagination} from 'ContentComponents';
import {getModelPrimaryKey} from 'helpers';


@connect((state, props)=>({
  models: state.main.models,
  list: state.model.pagedList[props.modelName],
  totalPages: state.model.totalPages[props.modelName],
}), {
  deleteItem
})
export default class ModelListItemTemplate extends React.Component {
  render() {
    const {checked, modelName, models, list, checkOne, checkAll, deleteItems, totalPages, getList} = this.props;
    const columns = models[modelName].structure.list;
    return (
      <div>

        <div className="list-actions">
          {!!Object.keys(checked).length && (
            <div className="check-actions">
              <button className="button" onClick={deleteItems}>Delete</button>
            </div>
          )}
          <div className="permanent-actions">
            <Link className="button" to={{name: 'ModelAdd', params: {modelName}}}>Add</Link>
          </div>
        </div>

        <Pagination totalPages={totalPages} />

        {list && list.length ? (
          <table className="table">
            <thead>
            <tr>
              <th>
                <input type="checkbox" checked={Object.keys(checked).length==list.length} onChange={e=>checkAll()}/>
              </th>
              {columns.map(column=>this.getColumnHeader(column))}
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {list.map((item, k)=>(
              <Item key={item[getModelPrimaryKey(modelName)]} k={k} item={item} isChecked={checked[k]} modelName={modelName} getList={getList} checkOne={checkOne} />
            ))}
            </tbody>
          </table>
        ) : ( list && (
          <div>
            No content
          </div>
        ) ) }

        <Pagination totalPages={totalPages} />

      </div>
    )
  }
  getColumnHeader(columnName) {
    const {modelName, models} = this.props;
    const columnConfig = models[modelName].fields[columnName].config.list;
    const columnContent = columnConfig.icon ? <i className={columnConfig.icon} /> : columnName;
    return <th key={columnName} className={`column-${columnConfig.template}`}>{columnContent}</th>
  }
}
