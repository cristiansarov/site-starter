import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {deleteItem, appendItemToList, replaceItemInList, removeItemFromList} from '../../ModelActions';
import {I18n} from 'react-redux-i18n';
import Item from './ModelImageListItemTemplate';
import Dropzone from 'react-dropzone';
import {uploadImage} from '../../../../Main/MainUploadService';

require('./ModelImageList.scss');


@connect((state, props)=>({
  models: state.main.models,
  list: state.model.pagedList[props.modelName],
}), {
  deleteItem,
  appendItemToList,
  replaceItemInList,
  removeItemFromList
})
export default class ModelImageListTemplate extends React.Component {

  state = { rejectedFiles: [] };

  render() {
    const {checked, list, deleteItems, modelName} = this.props;
    const dropzoneConfig = {
      disableClick: true,
      maxSize: 10 * 1024 * 1024,
      onDrop: this.onDrop.bind(this),
      style: {},
      activeClassName: 'active'
    };
    return (
      <div>

        <div className="list-actions">
          {!!Object.keys(checked).length && (
            <div className="check-actions">
              <button className="button" onClick={deleteItems}>Delete</button>
            </div>
          )}
          <div className="permanent-actions">
            <button className="button" onClick={()=>this.dropzone.open()}>Upload</button>
          </div>
        </div>

        <Dropzone className="model-image-list" ref={dz=>this.dropzone=dz} {...dropzoneConfig}>
          {list && list.map((image, k)=>(
            <div key={image.id}>
              <Item k={k} image={image} modelName={modelName} />
            </div>
          ))}
        </Dropzone>

      </div>
    )
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const {modelName, appendItemToList, replaceItemInList, removeItemFromList} = this.props;
    acceptedFiles.forEach(file=>{
      const fileItem = {
        id: new Date().getTime(),
        fileName: file.name,
        preview: file.preview
      };
      appendItemToList(modelName, fileItem);
      uploadImage(file)
        .then(function (res) {
          // replaceItemInList()
        })
        .catch(function (err) {
          this.setState({
            rejectedFiles: [
              ...this.state.rejectedFiles,
              file
            ]
          });
        });
    });
    this.setState({
      rejectedFiles: [
        ...this.state.rejectedFiles,
        ...rejectedFiles
      ]
    });
  }

}
