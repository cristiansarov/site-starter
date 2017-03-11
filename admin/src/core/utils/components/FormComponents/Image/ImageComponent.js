import React from 'react';
import {uploadImage} from 'Main/MainUploadService';
import Dropzone from 'react-dropzone';
import {imageUrl} from 'core/utils/filters';
import {toastr} from 'react-redux-toastr';


export default class ImageComponent extends React.Component {
  render() {
    const { config, ...props } = this.props;
    console.log('props', props)

    const dropzoneConfig = {
      disableClick: true,
      maxSize: 2 * 1024 * 1024,
      multiple: false,
      onDrop: this.onDrop.bind(this),
      style: {},
      activeClassName: 'active'
    };
    const image = props.value;
    return (
      <Dropzone className="model-image" ref={dz=>this.dropzone=dz} {...dropzoneConfig}>
        {image ? (image.preview ? (
            <div className="image" style={{backgroundImage: `url('${image.preview}')`}} />
          ) : (
            <div className="image" style={{backgroundImage: `url('${imageUrl(image.filename, 'thumbnail')}')`}} />
          )) : (
            <div>
              NO IMAGE
            </div>
          ) }
          <button type="button" onClick={()=>this.dropzone.open()}>ADD ONE</button>
      </Dropzone>
    )
  }


  onDrop(files, rejectedFiles) {
    const {onChange} = this.props;
    console.log('files', files);
    console.log('rejectedFiles', rejectedFiles);
    const file = files[0];
    onChange({
      id: new Date().getTime(),
      fileName: file.name,
      preview: file.preview
    });
    uploadImage(file)
      .then(function (response) {
        onChange(response.data)
      })
      .catch(function (err) {
        toastr.error('Upload failed', 'See console for more details.')
        console.log('NOOO fost uploadat', err)
      });
  }
}
