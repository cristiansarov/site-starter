import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {deleteItem} from '../../ModelActions';
import {I18n} from 'react-redux-i18n';
import {imageUrl} from '../../../../core/utils/filters';

@connect(state=>({
  models: state.main.models
}), {
  deleteItem
})
export default class ModelImageListItemTemplate extends React.Component {
  render() {
    const {modelName, image} = this.props;
    return (
      <Link className="item" to={{name: 'ModelEdit', params: {modelName, modelId: image.id}}}>
        {image.preview ? (
          <div className="image" style={{backgroundImage: `url('${image.preview}')`}} />
        ) : (
          <div className="image" style={{backgroundImage: `url('${imageUrl(image.filename, 'thumbnail')}')`}} />
          ) }
      </Link>
    )
  }
  deleteItem(modelId) {
    const {deleteItem, modelName, getList} = this.props;
    deleteItem(modelName, modelId).then(getList);
  }
}
