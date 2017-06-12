import React from 'react';

export default class ContentEditable extends React.Component {
  componentWillMount() {
    this.onPaste = this.onPaste.bind(this);
  }
  render() {
    return (
      <div
        onInput={this.emitChange.bind(this)}
        onBlur={this.emitChange.bind(this)}
        contentEditable
        ref="element"
        dangerouslySetInnerHTML={{__html: this.props.value}}
      />
    );
  }
  componentDidMount() {
    this.refs.element.addEventListener('paste', this.onPaste);
  }
  onPaste(e) {
    e.preventDefault();
    const originalPasteValue = e.clipboardData.getData('text/html');
    const newPasteValue = this.replaceTags(originalPasteValue);
    window.document.execCommand('insertHTML', false, newPasteValue);
  }
  shouldComponentUpdate() {
    if(this.changing) {
      this.changing = false;
      return false;
    }
    return true;
  }
  emitChange() {
    const html = this.replaceTags(this.refs.element.innerHTML);
    if (this.props.onChange) {
      this.props.onChange({target: {value: html}});
      this.changing = true;
    }
  }
  replaceTags(string) {
    if(!string) return string;
    const replacements = {
      '<b>': '<strong>',
      '</b>': '</strong>',
    };
    string = string.replace(/<(?!\/?(b|strong|div)(?=>|\s.*>))\/?.*?>/gm, ''); // remove all tags except b and strong
    string = string.replace(/<(\w+)(.|[\r\n])*?>/gm, '<$1>'); // remove all attributes
    Object.keys(replacements).forEach(target => { // replace all <b>'s with <strong>'s
      const replacement = replacements[target];
      string = string.replace(new RegExp(target, 'g'), replacement);
    });
    return string;
  };
  componentWillUnmount() {
    this.refs.element.removeEventListener('paste', this.onPaste);
  }
}