import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML, ContentState, convertToRaw, EditorState, getSafeBodyFromHTML, DefaultDraftBlockRenderMap } from 'draft-js';
import {uploadImage} from 'Main/MainUploadService';
import {stateFromHTML} from 'draft-js-import-html';
import {stateToHTML} from 'draft-js-export-html';
import createImagePlugin from 'draft-js-image-plugin';



export default class WysiwygComponent extends React.Component {
  toolbarConfig = {
    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'image', 'remove'],
    inline: {
      // inDropdown: false,
      options: ['bold', 'italic', 'underline', 'monospace'],
    },
    blockType: {
      options: [ 'Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
    },
    fontSize: {
      options: [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96],
    },
    fontFamily: {
      options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    },
    list: {
      options: ['unordered', 'ordered'],
    },
    textAlign: {
      inDropdown: true,
      options: ['left', 'center', 'right', 'justify'],
    },
    link: {
      // inDropdown: false,
      options: ['link', 'unlink'],
    },
    image: {
      // urlEnabled: true,
      // uploadEnabled: true,
      alignmentEnabled: true,
      uploadCallback: this.uploadCallback,
    }
  };
  componentWillMount() {
    const {value} = this.props;
    this.state = {editorContent: this.fromHTML(value||'')};
  }
  componentWillReceiveProps(nextProps) {
    if(this.internalChange) this.internalChange = false;
    else this.setState({editorContent: this.fromHTML(nextProps.value)});
  }
  onChange = (editorContent) => {
    this.setState({editorContent});
    this.internalChange = true;
    if (this.props.onChange) this.props.onChange(this.toHTML(editorContent));
  };
  render() {
    const { editorContent } = this.state;
    const { disabled, readonly } = this.state;
    return (
     <div>
       <Editor
         wrapperClassName="wrapper-class"
         editorClassName="editor-class"
         toolbarClassName="toolbar-class"
         toolbar={this.toolbarConfig}
         editorState={editorContent}
         onEditorStateChange={this.onChange.bind(this)}
         readOnly={disabled||readonly}
         plugins={[createImagePlugin()]}
       />
     </div>
    )
  }
  uploadCallback(file) {
    return new Promise(
      (resolve, reject) => {
        uploadImage(file).then(response=>{
          resolve({ data: { link: `/images/${response.data.filename}` } });
        }, reject)
      }
    );
  }
  fromHTML(html) {
    return EditorState.createWithContent(ContentState.createFromBlockArray((convertFromHTML(html))));
  }
  toHTML(editorContent) {
    return draftToHtml(convertToRaw(editorContent.getCurrentContent()));
  }
}
