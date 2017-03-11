import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {deleteItem} from '../../ModelActions';
import {I18n} from 'react-redux-i18n';
import {imageUrl} from 'core/utils/filters';
import {getModelPrimaryKey} from 'core/utils/helpers';
import classnames from 'classnames';


@connect(state=>({
  models: state.main.models
}), {
  deleteItem
})
export default class ModelListItemTemplate extends React.Component {
  render() {
    const {item, k, isChecked, modelName, models, checkOne} = this.props;
    const columns = models[modelName].structure.list;
    return (
      <tr>
        <td className="column-checkbox">
          <input type="checkbox" checked={isChecked} onChange={e=>checkOne(k, e.target.checked)}/>
        </td>
        {columns.map(columnName=><th key={columnName} className={this.getColumnClass(columnName)}>{this.renderColumn(columnName)}</th>)}
        <td className="column-actions">
          <Link className="button-wire" to={{name: 'ModelEdit', params: {modelName, modelId: item[getModelPrimaryKey(modelName)]}}}>[Edit]</Link>
          <button className="button-wire" onClick={()=>this.deleteItem(item[getModelPrimaryKey(modelName)])}>[Delete]</button>
        </td>
      </tr>
    )
  }
  getColumnClass(columnName) {
    const {modelName, models} = this.props;
    return classnames(`column-${models[modelName].fields[columnName].config.list.template}`)
  }
  renderColumn(columnName) {
    const {item, modelName, models} = this.props;
    const fieldConfig = models[modelName].fields[columnName].config.list;
    const column = item[columnName];
    switch(fieldConfig.template) {
      case 'choice': {
        return I18n.t(`choice.${column}`)
      }
      case 'boolean': {
        return column && <i className="fa fa-check" />
      }
      case 'modelCount': {
        return column && column.length;
      }
      case 'image': {
        return <img src={column ? imageUrl(column.filename, 'thumb') : require('../../../../Main/Layout/assets/images/placeholder/user.svg')} />;
      }
      default: {
        return typeof column == 'string' ? column : JSON.stringify(column);
      }
    }
  }
  deleteItem(modelId) {
    const {deleteItem, modelName, getList} = this.props;
    if(confirm(I18n.t('message.areYouSure'))) {
      deleteItem(modelName, modelId).then(getList);
    }
  }
}
