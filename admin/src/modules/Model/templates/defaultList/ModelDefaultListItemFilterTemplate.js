import React from 'react';
import {connect} from 'react-redux';
import {deleteItem} from '../../ModelActions';
import {I18n} from 'react-redux-i18n';
import {imageUrl} from 'core/utils/filters';
import {setQueryParam} from 'core/utils/helpers';
import {getModelPrimaryKey} from 'core/utils/helpers';
import classnames from 'classnames';
import Select from 'react-select';
import {SearchInput} from 'core/utils/components/ContentComponents';


@connect(state=>({
  models: state.main.models,
  query: state.main.location.query
}), {
  deleteItem
})
export default class ModelDefaultListItemFilterTemplate extends React.Component {
  render() {
    const {models, modelName, columnName, query} = this.props;
    const column = models[modelName].fields[columnName];
    switch(column.config.list.template) {
      case 'choice': {
        return <Select options={column.validation.enum.map(i=>({label: I18n.t(`field.${i}`), value: i}))}
                       value={query[columnName]} onChange={data=>setQueryParam(columnName, data ? data.value: data)} placeholder="Select" />
      }
      case 'boolean': {
        return <Select options={[{label: <i className="fa fa-check" />, value: 'true'}, {label: <i className="fa fa-ban" />, value: 'false'}]}
                       value={query[columnName]} onChange={data=>setQueryParam(columnName, data ? data.value: data)} placeholder="Select" />
      }
      case 'modelCount': {
        return null
      }
      case 'image': {
        return null;
      }
      default: {
        return <SearchInput param={columnName} />
      }
    }
  }
}
