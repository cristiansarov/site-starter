import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import {I18n} from 'react-redux-i18n';
import './File.scss';


export default class FileComponent extends Component {

  static propTypes = {
    fileTypes: React.PropTypes.arrayOf(React.PropTypes.oneOf(['pdf', 'word', 'excel', 'ppt']))
  };
  state = {};
  maxSize = 5 * 1024 * 1024;
  mimeTypes = {
    pdf: ['application/pdf'],
    word: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    excel: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ppt: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  };

  render() {
    const {value, fileTypes, onChange, label, placeholder} = this.props;
    const {errors} = this.state;
    const dropzoneConfig = {
      ref: 'dropzone',
      onDrop: this.onDrop.bind(this),
      multiple: false,
      style: {},
      disableClick: true,
      maxSize: this.maxSize,
      accept: this.getMimeTypes(fileTypes).join(', ')
    };
    return (
      <Dropzone {...dropzoneConfig} className="file-component">
        <div className="file">
          {value ? (
            <div className="file__ready">
              <i className="icon-check" />
              <span>{value.name}</span>
              <button className="button-icon icon-times" onClick={()=>onChange(null)} />
            </div>
          ) : (
            <button type="button" className="file__empty" onClick={this.open.bind(this)}>
              <div>
                <i className="icon-paperclip" />
                <span>{label||placeholder||'Upload file'}</span>
              </div>
            </button>
          )}
        </div>
        {errors && (
          <div className="errors">{errors.map(error=><div key={error.type}>{I18n.t(`fileComponentError.${error.type}`, error.meta)}</div>)}</div>
        )}
      </Dropzone>
    )
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const {onChange} = this.props;
    let errors = null;
    if (acceptedFiles.length) {
      onChange(acceptedFiles[0]);
    } else if(rejectedFiles.length && !rejectedFiles[0].type) { // fix for files with no type
      onChange(rejectedFiles[0]);
    } else {
      errors = this.getErrors(rejectedFiles[0]);
    }
    this.setState({errors});
  }

  open() {
    this.refs.dropzone.open();
  }

  getMimeTypes(fileTypes) {
    if(!fileTypes) return [];
    const mimeTypes = [];
    fileTypes.forEach(fileType=>{
      this.mimeTypes[fileType].forEach(mimeType=>{
        mimeTypes.push(mimeType);
      })
    });
    return mimeTypes;
  }

  getErrors(rejectedFile) {
    const {fileTypes} = this.props;
    const errors = [];
    if(rejectedFile.size > this.maxSize) {
      errors.push({type: 'maxSize', meta: {size: `${this.maxSize/1024/1024}MB`}});
    }
    const mimeTypeList = this.getMimeTypes(fileTypes);
    if(mimeTypeList.length && !mimeTypeList.includes(rejectedFile.type)) {
      errors.push({type: 'type', meta: {types: fileTypes.join(', ')}});
    }
    return errors.length ? errors : null;
  }

}
