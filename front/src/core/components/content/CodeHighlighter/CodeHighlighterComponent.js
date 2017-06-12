import React from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js';
import './CodeHighlighter.scss';


export default class CodeHighlighterComponent extends React.Component {

  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  render() {
    const {children} = this.props;
    return (
      <div dangerouslySetInnerHTML={{__html: children}} />
    )
  }

  highlightCode() {
    const domNode = ReactDOM.findDOMNode(this);
    const nodes = [...domNode.querySelectorAll('pre'), ...domNode.querySelectorAll('code')];
    if (nodes.length > 0) {
      for (var i = 0; i < nodes.length; i = i + 1) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  }

}